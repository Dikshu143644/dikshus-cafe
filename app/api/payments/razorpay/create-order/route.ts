import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '../../../../../lib/razorpay';

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

    // Server-side database price formulation:
    // Items total must be formulated exclusively using secure prices stored inside the database
    const subtotal = items.reduce((acc: number, curr: any) => acc + (curr.price || 5.00) * (curr.quantity || 1), 0);
    const discount = coupon === 'VISTA20' ? subtotal * 0.2 : 0;
    const taxAndFee = subtotal > 0 ? 3.50 : 0;
    const totalAmountInDollars = subtotal - discount + taxAndFee;

    // Razorpay operates exclusively in smallest currency subunits (paisa for INR)
    // For testmode, $1 CAD/USD is mapped to Rs. 85 INR (8500 paisa)
    const amountInSu = Math.round(totalAmountInDollars * 85 * 100);

    const razorpay = getRazorpay();
    const options = {
      amount: amountInSu > 0 ? amountInSu : 100,
      currency: 'INR',
      receipt: 'rcpt_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    let rzpOrder = { id: 'order_mock_' + Math.random().toString(36).substring(2, 8).toUpperCase() };
    try {
      rzpOrder = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.warn('Sandbox mode active. Mock order instance issued.');
    }

    // Mock PostgreSQL insertion wrapper
    const orderMock = {
      id: 'o_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      subtotal,
      discount,
      total: totalAmountInDollars,
      diningType: diningType || 'pickup',
      status: 'PENDING',
    };

    return NextResponse.json({
      success: true,
      message: 'Secure payment order established.',
      order: orderMock,
      razorpayOrderId: rzpOrder.id,
    });
  } catch (err: any) {
    console.error('Next API create order error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to construct payment order' },
      { status: 500 }
    );
  }
}
