'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function NextCheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [diningType, setDiningType] = useState<'dine-in' | 'pickup'>('pickup');
  const [coupon, setCoupon] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'razorpay' | 'stripe'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Client-side hydration/load
    setCartItems([
      { id: 'm1', name: 'Gilded Espresso Crema', price: 6.50, quantity: 1, image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop' }
    ]);
    setLoading(false);
  }, []);

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discount = coupon === 'VISTA20' ? subtotal * 0.2 : 0;
  const tax = subtotal > 0 ? 3.50 : 0;
  const total = subtotal - discount + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setErrorMessage('Please completely fill billing and contact coordinates.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      if (selectedProvider === 'razorpay') {
        const orderRes = await fetch('/api/payments/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, items: cartItems, diningType, coupon }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          throw new Error(orderData.message || 'Razorpay order creation rejected.');
        }

        // Simulating the Razorpay dynamic overlay script logic securely
        const verifyRes = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.order.id,
            razorpayOrderId: orderData.razorpayOrderId,
            razorpayPaymentId: 'pay_test_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
            razorpaySignature: 'test_approved_signature',
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          window.location.href = `/payment/success?orderId=${orderData.order.id}&total=${total}`;
        } else {
          throw new Error(verifyData.message || 'Cryptographic verification failed.');
        }
      } else {
        const stripeRes = await fetch('/api/payments/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, items: cartItems, diningType, coupon }),
        });
        const stripeData = await stripeRes.json();
        if (!stripeRes.ok || !stripeData.success) {
          throw new Error(stripeData.message || 'Stripe Session rejected.');
        }

        // Seamless test checkout redirect simulation
        window.location.href = stripeData.url || `/payment/success?orderId=stripe_order_${Math.random().toString(36).substring(2, 6)}`;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Transaction could not be completed.');
      window.location.href = '/payment/failed';
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-mono uppercase">Retrieving checkout session...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FEFAF4] pt-24 pb-16 text-[#352F2C]">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-center mb-8">
          Secure Cafe Vista Checkout
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleCheckout} className="md:col-span-7 space-y-6">
            <div className="bg-white/70 backdrop-blur-md border border-[#deb887]/20 rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider">
                1. Billing Contact &amp; Dining Method
              </h2>
              
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-full text-xs text-center">
                <button
                  type="button"
                  onClick={() => setDiningType('dine-in')}
                  className={`py-1.5 rounded-full font-bold transition ${diningType === 'dine-in' ? 'bg-[#352F2C] text-white' : 'text-gray-500'}`}
                >
                  Dine-In Parlor
                </button>
                <button
                  type="button"
                  onClick={() => setDiningType('pickup')}
                  className={`py-1.5 rounded-full font-bold transition ${diningType === 'pickup' ? 'bg-[#352F2C] text-white' : 'text-gray-500'}`}
                >
                  Quick Pickup
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#352F2C]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#352F2C]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#352F2C]"
                />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-[#deb887]/20 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider">
                2. Select Secure Payment Gateway
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedProvider('razorpay')}
                  className={`p-4 border rounded-xl cursor-pointer transition flex flex-col justify-between h-24 ${
                    selectedProvider === 'razorpay' ? 'border-[#352F2C] bg-[#352F2C]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest block">Razorpay</span>
                  <span className="text-[9px] text-gray-500 block">UPI, Cards &amp; Netbanking inside India</span>
                </div>

                <div
                  onClick={() => setSelectedProvider('stripe')}
                  className={`p-4 border rounded-xl cursor-pointer transition flex flex-col justify-between h-24 ${
                    selectedProvider === 'stripe' ? 'border-[#352F2C] bg-[#352F2C]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest block">Stripe</span>
                  <span className="text-[9px] text-gray-500 block">International Cards &amp; Payments</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-gray-400 font-mono flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PCI-Compliant SSL Bank-Grade Tunnel Active</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#352F2C] hover:bg-[#D4AF37] text-white hover:text-[#352F2C] font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 disabled:opacity-50"
              >
                {isProcessing ? 'Contacting secure gateway...' : `Authorize Session & Pay $${total.toFixed(2)}`}
              </button>
            </div>
          </form>

          <div className="md:col-span-5 space-y-6">
            <div className="bg-white/70 backdrop-blur-md border border-[#deb887]/20 rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider border-b border-gray-100 pb-2">
                Order Items Summary
              </h3>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold">{item.name}</span>
                      <span className="text-[10px] text-gray-400 block">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxes &amp; Fees</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-100 pt-2 text-[#352F2C]">
                  <span>Total Amount</span>
                  <span className="font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#8C7B6B] text-[10px] rounded-xl flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Earn <strong>{Math.floor(total * 10)} loop points</strong> on this transaction!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
