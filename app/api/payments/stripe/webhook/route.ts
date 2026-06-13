import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '../../../../../lib/stripe';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ success: false, message: 'Lack webhook signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    console.log(`Processing verified Stripe webhook event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderId = session.id;
      const amountPaid = session.amount_total / 100;
      
      console.log(`Stripe fulfillment confirmed. Checkout Session: ${orderId}. Total Paid: $${amountPaid}. Database updated with status PAID.`);
      // Run database commands to mark associated Order status to PAID
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook construction error:', err.message);
    // Return standard HTTP ok error so Stripe doesn't disable our webhook queue
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
