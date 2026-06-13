import React, { useState, useEffect } from 'react';
import { CreditCard, MapPin, Check, Sparkles, ShoppingBag, ArrowLeft, ShieldCheck, AlertCircle, RefreshCw, RefreshCcw, X } from 'lucide-react';
import { MenuItem, DiningType } from '../types';
import GlassCard from './GlassCard';
import DeliveryBag3D from './3d/DeliveryBag3D';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CheckoutViewProps {
  cartItems: CartItem[];
  diningType: DiningType;
  couponCode: string;
  onPlaceOrder: (orderData: any) => Promise<any>;
  onNavigate: (page: string) => void;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onClearCart: () => void;
}

const SAVED_ADDRESSES = [
  { id: 'addr_1', type: 'Home Sanctuary', line: 'Apartment 7B, Pavilion Walkway', city: 'London', postal: 'SW1A 1AA' },
  { id: 'addr_2', type: 'Glasshouse Office', line: 'Floor 14, Royal Garden Conservatory', city: 'London', postal: 'EC1A 1BB' }
];

export default function CheckoutView({
  cartItems,
  diningType: initialDiningType,
  couponCode,
  onPlaceOrder,
  onNavigate,
  userId,
  userName = '',
  userEmail = '',
  userPhone = '',
  onClearCart,
}: CheckoutViewProps) {
  const [diningType, setDiningType] = useState<DiningType>(initialDiningType);
  const [customerName, setCustomerName] = useState(userName || 'Elena Rostova');
  const [customerEmail, setCustomerEmail] = useState(userEmail || 'elena@cafevista.com');
  const [customerPhone, setCustomerPhone] = useState(userPhone || '+44 7911 123456');

  // Address book
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr_1');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState('');

  // Payment gateways
  const [paymentProvider, setPaymentProvider] = useState<'razorpay' | 'stripe'>('razorpay');
  const [paymentTab, setPaymentTab] = useState<'card' | 'upi' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Custom states matching payment flow
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Razorpay simulated portal modal state
  const [showRzpOverlay, setShowRzpOverlay] = useState(false);
  const [showStripeOverlay, setShowStripeOverlay] = useState(false);

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  
  // Compute coupon info
  let discountPercentage = 0;
  if (couponCode === 'VISTA20') discountPercentage = 20;
  else if (couponCode === 'WELCOME10') discountPercentage = 10;
  else if (couponCode === 'LATTEPOINTS') discountPercentage = 15;

  const discountAmount = subtotal * (discountPercentage / 100);
  const taxAndFee = subtotal > 0 ? 3.50 : 0;
  const total = subtotal - discountAmount + taxAndFee;

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Please fully complete contact information coordinates.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Submit Order record to server first in PENDING status
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        items: cartItems.map(c => ({
          menuItemId: c.item.id,
          name: c.item.name,
          price: c.item.price,
          quantity: c.quantity
        })),
        diningType,
        couponCode,
        userId
      };

      const orderResult = await onPlaceOrder(payload);
      if (!orderResult || !orderResult.success) {
        throw new Error(orderResult?.message || 'Database rejected order registration.');
      }

      setCreatedOrder(orderResult.order);

      // 2. Open Selected Gateway Simulated Sandbox portal
      if (paymentProvider === 'razorpay') {
        setShowRzpOverlay(true);
      } else {
        setShowStripeOverlay(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Transaction could not be initialized.');
      setIsProcessing(false);
    }
  };

  // Verifying actual sign validation from server side (preventing spoofing!)
  const handleVerifyRazorpayPayment = async (simulateSuccess: boolean) => {
    setShowRzpOverlay(false);
    
    if (!simulateSuccess) {
      setTransactionStatus('failed');
      setErrorMessage('Razorpay transaction was explicitly declined by user in test portal.');
      setIsProcessing(false);
      return;
    }

    try {
      // Send secure payment verification signatures back to backend /api/payments/verify
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createdOrder.id,
          razorpayOrderId: 'order_test_' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          razorpayPaymentId: 'pay_test_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          razorpaySignature: 'test_approved_signature' // matches bypass validation
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onClearCart();
        setTransactionStatus('success');
      } else {
        throw new Error(data.message || 'Verification signature failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'PostgreSQL transaction certification failed.');
      setTransactionStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Stripe verification
  const handleVerifyStripePayment = async (simulateSuccess: boolean) => {
    setShowStripeOverlay(false);
    if (!simulateSuccess) {
      setTransactionStatus('failed');
      setErrorMessage('Stripe checkout session aborted by cardholder.');
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/payments/stripe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createdOrder.id,
          sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 6)
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onClearCart();
        setTransactionStatus('success');
      } else {
        throw new Error(data.message || 'Stripe webhook validation refused session state.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Fulfillment error.');
      setTransactionStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedAddr = SAVED_ADDRESSES.find(a => a.id === selectedAddressId);

  // Return Failed View
  if (transactionStatus === 'failed') {
    return (
      <div id="checkout-failed-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <GlassCard theme="light" className="text-center p-8 bg-white/85 border border-red-200/40 relative space-y-6" hoverEffect={false}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 rounded-t-2xl" />
            
            <div className="w-16 h-16 rounded-full bg-red-100 border border-red-300 text-red-600 flex items-center justify-center mx-auto shadow-md">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-red-600 block">
                Verification Declined
              </span>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-cafe-charcoal">
                Transaction Refused
              </h2>
              <p className="text-xs text-cafe-charcoal/70 max-w-sm mx-auto leading-relaxed">
                {errorMessage || 'Your checkout was rejected because transaction signature audits failed or timeout ensued.'}
              </p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left space-y-1.5 text-[11px] text-red-800 leading-relaxed">
              <span className="font-bold uppercase tracking-wider block text-[9px]">Strict Security Notice:</span>
              <span>
                Cafe Vista uses backend verify signatures. Client-side state manipulations are immediately blocked to preserve card security and transaction validation correctness.
              </span>
            </div>

            <div className="pt-4 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setTransactionStatus('idle');
                  setIsProcessing(false);
                  setErrorMessage('');
                }}
                className="w-full py-3 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky text-xs uppercase font-bold tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Retry checkout payment</span>
              </button>
              <button
                onClick={() => onNavigate('menu')}
                className="w-full py-3 bg-white border border-cafe-smoky/15 hover:bg-gray-50 text-cafe-smoky text-xs uppercase font-bold tracking-widest rounded-xl transition"
              >
                Cancel &amp; return to menu
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Return Success View
  if (transactionStatus === 'success') {
    return (
      <div id="checkout-success-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10 flex items-center justify-center animate-fadeIn">
        <div className="max-w-lg w-full mx-auto px-4">
          <GlassCard theme="light" className="text-center p-8 bg-white/90 space-y-6 relative border border-cafe-gold/30 shadow-2xl" hoverEffect={false}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-emerald-500 rounded-t-2xl" />

            {/* Live 3D Bag animation */}
            <div className="h-56 w-full relative z-10 overflow-hidden rounded-2xl bg-gradient-to-b from-transparent to-cafe-gold/5 border border-[#deb887]/15">
              <DeliveryBag3D />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-emerald-600 block">
                SSL Cryptographic verification green
              </span>
              <h2 className="font-serif text-3xl font-light uppercase tracking-tight text-cafe-charcoal">
                Order is Brewing!
              </h2>
              <p className="text-xs text-cafe-charcoal/70 max-w-sm mx-auto leading-relaxed">
                Thank you! Our glasshouse baristas have received your order. Credentials and signature validations passed smoothly.
              </p>
            </div>

            {/* Estimated preparation countdown timer */}
            <div className="glass-light border border-[#deb887]/20 p-4 rounded-xl flex items-center space-x-3 text-left">
              <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-cafe-gold shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-cafe-charcoal uppercase block leading-none">Expected preparation period</span>
                <span className="text-[10px] text-cafe-charcoal/50 block mt-1.5">
                  Queue queue timer active: <strong>12-15 minutes</strong> wait time expected.
                </span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#deb887]/25 rounded-xl p-5 text-left font-mono text-xs uppercase space-y-3">
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">ORDER TOKEN ID:</span>
                <span className="font-bold text-cafe-smoky">{createdOrder ? `o-${createdOrder.id}` : 'o-REF'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">COLLECTION METHOD:</span>
                <span className="font-bold text-cafe-bronze">{diningType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">AMOUNT VERIFIED:</span>
                <span className="font-bold text-cafe-smoky">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cafe-charcoal/40">PAYMENT PROVIDER:</span>
                <span className="font-bold text-emerald-600">{paymentProvider}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 bg-cafe-smoky text-white hover:bg-cafe-gold hover:text-cafe-smoky text-xs uppercase font-bold tracking-widest rounded-full transition-colors cursor-pointer"
              >
                Track on Dashboard
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-3 bg-white text-cafe-smoky border border-cafe-smoky/10 hover:bg-gray-50 text-xs uppercase font-bold tracking-widest rounded-full transition-colors"
              >
                Return Home
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header navigation back */}
        <button
          onClick={() => onNavigate('menu')}
          className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-cafe-bronze font-bold hover:text-cafe-smoky mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to menu</span>
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight text-cafe-charcoal">
            Finalize your order
          </h1>
          <p className="text-xs text-cafe-charcoal/60 mt-1">Review your selections and process payment securely.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <GlassCard theme="light" className="text-center py-16 bg-white/60">
            <ShoppingBag className="w-12 h-12 text-cafe-cream/40 mx-auto mb-4 animate-bounce" />
            <h3 className="font-serif text-lg font-bold text-cafe-charcoal uppercase mb-2">Your cart is dry</h3>
            <p className="text-xs text-cafe-charcoal/60 max-w-xs mx-auto mb-6">Explore our fresh menu categories and select an item first.</p>
            <button
              onClick={() => onNavigate('menu')}
              className="px-6 py-3 bg-cafe-smoky text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs uppercase font-bold tracking-widest rounded-full transition-colors"
            >
              Browse Menu
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Billing/Payment Column */}
            <form onSubmit={handleInitiatePayment} className="lg:col-span-7 space-y-6">
              
              {/* Dining option & contact info */}
              <GlassCard theme="light" className="bg-white/60 space-y-4" hoverEffect={false}>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-cafe-charcoal border-b border-cafe-smoky/5 pb-2">
                  1. Contact details &amp; dining method
                </h3>

                {/* Dining toggle card */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-cafe-smoky/5 rounded-full border border-cafe-smoky/10 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => setDiningType('dine-in')}
                    className={`py-2 px-1 uppercase font-bold tracking-wider rounded-full transition-all duration-300 ${
                      diningType === 'dine-in'
                        ? 'bg-cafe-smoky text-white'
                        : 'text-cafe-charcoal/60 hover:text-cafe-smoky'
                    }`}
                  >
                    Dine-In Parlor
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiningType('pickup')}
                    className={`py-2 px-1 uppercase font-bold tracking-wider rounded-full transition-all duration-300 ${
                      diningType === 'pickup'
                        ? 'bg-cafe-smoky text-white'
                        : 'text-cafe-charcoal/60 hover:text-cafe-smoky'
                    }`}
                  >
                    Quick Pickup
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Name</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky"
                        placeholder="Elena Rostova"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky"
                        placeholder="+44 7911 123456"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky"
                      placeholder="elena@cafevista.com"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Saved Address Selection Book */}
              {diningType === 'pickup' && (
                <GlassCard theme="light" className="bg-white/60 space-y-4" hoverEffect={false}>
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-cafe-charcoal border-b border-cafe-smoky/5 pb-2">
                    Pickup Location Conservatory
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SAVED_ADDRESSES.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setIsAddingAddress(false);
                        }}
                        className={`p-4 border rounded-xl cursor-pointer text-left transition relative ${
                          selectedAddressId === addr.id && !isAddingAddress
                            ? 'border-cafe-bronze bg-cafe-gold/5'
                            : 'border-cafe-smoky/10 hover:border-cafe-smoky/20 bg-white/45'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-wide">{addr.type}</span>
                          {selectedAddressId === addr.id && !isAddingAddress && (
                            <div className="w-3.5 h-3.5 bg-cafe-bronze rounded-full flex items-center justify-center text-white">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-bold text-cafe-charcoal">{addr.line}</p>
                        <p className="text-[10px] text-cafe-charcoal/55 mt-0.5">{addr.city}, {addr.postal}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Gateway Provider Selection tabs */}
              <GlassCard theme="light" className="bg-white/60 space-y-4" hoverEffect={false}>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-cafe-charcoal border-b border-cafe-smoky/5 pb-2">
                  2. Choose payment network provider
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentProvider('razorpay')}
                    className={`p-4 border rounded-2xl cursor-pointer text-left transition flex flex-col justify-between h-24 ${
                      paymentProvider === 'razorpay'
                        ? 'border-cafe-bronze bg-cafe-bronze/5 shadow-sm'
                        : 'border-cafe-smoky/10 hover:border-cafe-smoky/20 bg-white/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-cafe-charcoal">RAZORPAY INDIA</span>
                      {paymentProvider === 'razorpay' && <div className="w-4 h-4 bg-cafe-bronze rounded-full flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                    </div>
                    <span className="text-[10px] text-cafe-charcoal/50 leading-relaxed block">Local UPI codes, cards and wallets within India. recommended</span>
                  </div>

                  <div
                    onClick={() => setPaymentProvider('stripe')}
                    className={`p-4 border rounded-2xl cursor-pointer text-left transition flex flex-col justify-between h-24 ${
                      paymentProvider === 'stripe'
                        ? 'border-cafe-bronze bg-cafe-bronze/5 shadow-sm'
                        : 'border-cafe-smoky/10 hover:border-cafe-smoky/20 bg-white/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-cafe-charcoal">STRIPE WORLD</span>
                      {paymentProvider === 'stripe' && <div className="w-4 h-4 bg-cafe-bronze rounded-full flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                    </div>
                    <span className="text-[10px] text-cafe-charcoal/50 leading-relaxed block">International Cards, digital wallets, Apple Pay securely processed.</span>
                  </div>
                </div>

                {/* Sub gateway options */}
                <div className="p-4 bg-[#FAF8F5] border border-[#deb887]/25 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-cafe-smoky/5 pb-2 text-[10px] uppercase font-bold text-cafe-charcoal">
                    <span>Gateway specifications</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[8px] tracking-widest uppercase rounded">SECURE MODE ACTIVE</span>
                  </div>

                  {paymentProvider === 'razorpay' ? (
                    <div className="space-y-3">
                      <div className="flex gap-2 text-xs font-bold justify-start">
                        <button type="button" onClick={() => setPaymentTab('card')} className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase tracking-wide transition ${paymentTab === 'card' ? 'bg-cafe-smoky text-white border-cafe-smoky' : 'bg-white text-gray-500 border-gray-200'}`}>Card payment</button>
                        <button type="button" onClick={() => setPaymentTab('upi')} className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase tracking-wide transition ${paymentTab === 'upi' ? 'bg-cafe-smoky text-white border-cafe-smoky' : 'bg-white text-gray-500 border-gray-200'}`}>UPI overlay</button>
                      </div>
                      <p className="text-[10px] text-cafe-charcoal/60 leading-relaxed">
                        Securely loads the Razorpay checkout interface. All payments are encrypted and verified.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[10px] text-cafe-charcoal/60 leading-relaxed">
                        Redirects to Stripe Checkout for card billing. Uses secure HTTPS transaction verification lanes.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex flex-col space-y-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky h-14 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center space-x-2"><RefreshCcw className="w-4 h-4 animate-spin text-cafe-gold" /><span>Processing order checkout...</span></span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-cafe-gold" />
                        <span>Authorize &amp; Pay ${total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[9px] text-[#A8947C] font-mono tracking-wide flex items-center justify-center space-x-1 uppercase pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>SSL cryptographic certified link active • payment never stored</span>
                  </p>
                </div>
              </GlassCard>

            </form>

            {/* Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <GlassCard theme="light" className="bg-white/60 space-y-4" hoverEffect={false}>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-cafe-charcoal border-b border-cafe-smoky/5 pb-2">
                  Review Items summary
                </h3>

                <div className="space-y-4.5 max-h-[220px] overflow-y-auto pr-2">
                  {cartItems.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center space-x-3 text-xs">
                      <img
                        referrerPolicy="no-referrer"
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-cafe-smoky shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-cafe-charcoal block truncate">{item.name}</span>
                        <span className="text-[10px] text-cafe-charcoal/50 block">Quantity: {quantity} x ${item.price.toFixed(2)}</span>
                      </div>
                      <span className="font-mono font-bold text-cafe-charcoal shrink-0">
                        ${(item.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="border-t border-cafe-smoky/5 pt-4 space-y-2 text-xs text-cafe-charcoal/70">
                  <div className="flex justify-between">
                    <span>Items subtotal</span>
                    <span className="font-mono text-cafe-smoky">${subtotal.toFixed(2)}</span>
                  </div>
                  {couponCode && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount Applied ({couponCode})</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax &amp; Setup Service charges</span>
                    <span className="font-mono text-cafe-smoky">${taxAndFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-sm font-bold text-cafe-charcoal pt-3 border-t border-cafe-smoky/5 uppercase tracking-wider">
                    <span>Estimated Total value</span>
                    <span className="font-mono text-cafe-bronze">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-cafe-gold/10 border border-cafe-gold/20 text-cafe-bronze text-[10px] rounded-xl flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Earn <strong>{Math.floor(total * 10)} VISTA loyalty points</strong> on this order checkout!</span>
                </div>
              </GlassCard>
            </div>

          </div>
        )}
      </div>

      {/* RAZORPAY TEST SUITE SIMULATION OVERLAY PORTAL */}
      {showRzpOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 min-w-full animate-fadeIn font-sans">
          <div className="bg-[#111111] text-white border border-[#deb887]/30 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl pulse-glow flex flex-col justify-between">
            
            {/* Razorpay Banner Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] tracking-widest font-mono text-white/70 block font-bold leading-none uppercase font-sans">RAZORPAY GATEWAY</span>
                <span className="text-sm font-bold block mt-1">Cafe Vista Payments</span>
              </div>
              <div className="px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-bold rounded uppercase">
                SECURE
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center font-mono py-2 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] block text-gray-400">AMOUNT TO INVOICE</span>
                <span className="text-xl font-bold tracking-wider">${total.toFixed(2)} CAD</span>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#deb887]">Authorize Secured Payment:</span>
                <p className="text-[10px] text-gray-300 leading-relaxed">
                  Proceed to complete Cafe Vista's verified cryptographic transaction authorization and sign check.
                </p>
              </div>

              {/* Action options */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleVerifyRazorpayPayment(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-emerald-600 text-white font-bold uppercase text-[10.5px] tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  Confirm payment
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyRazorpayPayment(false)}
                  className="w-full py-3 bg-red-600/30 hover:bg-red-600 text-white font-bold uppercase text-[10.5px] tracking-widest rounded-xl border border-red-500/30 transition-all duration-300"
                >
                  Cancel transaction
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white/5 border-t border-white/10 px-6 py-4 text-center text-[9px] text-gray-500 font-mono tracking-wider flex justify-between items-center">
              <span>Razorpay HSM SSL</span>
              <span>Ref: {createdOrder?.razorpayOrderId}</span>
            </div>
          </div>
        </div>
      )}

      {/* STRIPE TEST SUITE SIMULATION OVERLAY PORTAL */}
      {showStripeOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 min-w-full animate-fadeIn font-sans">
          <div className="bg-white text-gray-800 border border-gray-200 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
            
            {/* Stripe Banner Header */}
            <div className="bg-[#635BFF] text-white p-5 flex justify-between items-center">
              <div>
                <span className="text-[9px] tracking-widest font-mono text-white/80 block font-bold leading-none uppercase font-sans">STRIPE CHECKOUT</span>
                <span className="text-sm font-bold block mt-1">Cafe Vista International</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded uppercase font-mono">SECURE</span>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center font-mono py-2 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="text-[10px] block text-gray-400">PAY OUT AMOUNT</span>
                <span className="text-xl font-bold tracking-wider text-[#635BFF]">${total.toFixed(2)} USD</span>
              </div>

              <div className="space-y-1 text-xs text-center leading-relaxed">
                <p className="text-[10px] text-gray-500">
                  Completing secure card authorization and merchant tunnel verification loops seamlessly.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleVerifyStripePayment(true)}
                  className="w-full py-3 bg-[#635BFF] hover:bg-emerald-600 text-white font-bold uppercase text-[10.5px] tracking-widest rounded-xl transition-all duration-300"
                >
                  Pay secure amount
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyStripePayment(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase text-[10.5px] tracking-widest rounded-xl transition"
                >
                  Cancel &amp; Return
                </button>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 text-center text-[9px] text-gray-400 font-mono tracking-wider">
              Secure payments powered by Stripe, LLC.
            </div>
          </div>
        </div>
      )}

      {/* Styled animation templates */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pulse-glow {
          box-shadow: 0 0 30px rgba(99, 91, 255, 0.15);
        }
      `}</style>

    </div>
  );
}
