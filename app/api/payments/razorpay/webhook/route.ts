import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ success: false, message: 'Lack webhook signature' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_placeholder';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Webhook signature check failed. Unauthorized action reported.');
      return NextResponse.json({ success: false, message: 'Unauthorized webhook content' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    
    console.log(`Processing Razorpay webhook event: ${event}`);

    if (event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      
      console.log(`Fulfillment trigger for webhook payment captured. Order ID: ${orderId}, Transaction Ref: ${paymentId}`);
      // Database transaction handler updates payments table and updates order status to PAID
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payload.payment.entity;
      console.error(`Transaction failure logged for Razorpay payout. Ref: ${paymentEntity.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Webhook payload parse error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
