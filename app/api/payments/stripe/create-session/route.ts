import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '../../../../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, items, diningType, coupon } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide items in the cart' },
        { status: 400 }
      );
    }

    const subtotal = items.reduce((acc: number, curr: any) => acc + (curr.price || 5.00) * (curr.quantity || 1), 0);
    const discount = coupon === 'VISTA20' ? subtotal * 0.2 : 0;
    const taxAndFee = subtotal > 0 ? 3.50 : 0;
    const totalAmount = subtotal - discount + taxAndFee;

    // Convert to minor units (cents for USD)
    const amountInCents = Math.round(totalAmount * 100);

    const stripe = getStripe();
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Cafe Vista Culinary Order',
              description: `Checkout items for ${name}. Type: ${diningType}`,
            },
            unit_amount: amountInCents > 0 ? amountInCents : 500,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${domain}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/payment/failed`,
      metadata: {
        customerName: name,
        customerPhone: phone,
        diningType: diningType || 'pickup',
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err: any) {
    console.error('Stripe session creation failed:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Stripe initialization failed' },
      { status: 500 }
    );
  }
}
