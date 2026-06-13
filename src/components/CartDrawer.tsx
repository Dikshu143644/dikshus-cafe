import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingCart, Tag } from 'lucide-react';
import { MenuItem, DiningType } from '../types';
import { COUPONS } from '../data/mockData';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigateToCheckout: (diningType: DiningType, couponCode: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateToCheckout,
}: CartDrawerProps) {
  const [diningType, setDiningType] = useState<DiningType>('dine-in');
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const discountAmount = activeCoupon ? subtotal * (activeCoupon.discount / 100) : 0;
  const deliveryOrTax = subtotal > 0 ? 3.50 : 0; // standard setup charges
  const total = subtotal - discountAmount + deliveryOrTax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    
    if (!code) return;

    const coupon = COUPONS.find(c => c.code === code);
    if (!coupon) {
      setCouponError('Invalid coupon code');
      setActiveCoupon(null);
      return;
    }

    if (subtotal < coupon.minSpend) {
      setCouponError(`Min spend for this coupon is $${coupon.minSpend}`);
      setActiveCoupon(null);
      return;
    }

    setActiveCoupon({ code: coupon.code, discount: coupon.discountPercentage });
    setCouponCode('');
  };

  const handleCheckoutClick = () => {
    onNavigateToCheckout(diningType, activeCoupon?.code || '');
    onClose();
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark backdrop blur blur-sm */}
      <div
        className="absolute inset-0 bg-[#12100e]/80 transition-opacity backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-dark flex flex-col h-full border-l border-white/10 text-cafe-cream">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-cafe-gold" />
              <h2 className="font-serif text-lg font-semibold uppercase tracking-wider text-white">Your Cart</h2>
              <span className="bg-cafe-gold/20 text-cafe-gold text-xs font-mono h-5 px-1.5 rounded-full flex items-center justify-center border border-cafe-gold/30">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-cafe-cream/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-4/5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-cafe-cream/30" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-white uppercase tracking-wider">Your cart is empty</h3>
                  <p className="text-xs text-cafe-cream/50 mt-1 max-w-[240px] leading-relaxed mx-auto">
                    Take a browse through our artisanal brews and chef-crafted brunch pastries.
                  </p>
                </div>
              </div>
            ) : (
              cartItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 bg-white/5 border border-white/5 hover:border-cafe-gold/20 rounded-xl transition-all duration-300"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-cafe-charcoal shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate leading-relaxed">{item.name}</h4>
                    <p className="text-xs text-cafe-gold font-mono tracking-tight mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-medium">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-cafe-cream/40 hover:text-red-400 bg-white/0 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Subtotal / Checkouts */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-cafe-charcoal/45 space-y-4">
              
              {/* Pickup / Dine-in Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-full border border-white/5 text-center">
                <button
                  onClick={() => setDiningType('dine-in')}
                  className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-full transition-all duration-300 ${
                    diningType === 'dine-in'
                      ? 'bg-cafe-gold text-cafe-charcoal'
                      : 'text-cafe-cream/60 hover:text-white'
                  }`}
                >
                  Dine-In Table
                </button>
                <button
                  onClick={() => setDiningType('pickup')}
                  className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-full transition-all duration-300 ${
                    diningType === 'pickup'
                      ? 'bg-cafe-gold text-cafe-charcoal'
                      : 'text-cafe-cream/60 hover:text-white'
                  }`}
                >
                  Quick Pickup
                </button>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="w-3.5 h-3.5 text-cafe-cream/40" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="ENTER COUPON..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-xs uppercase bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-cafe-cream/30 focus:outline-none focus:border-cafe-gold font-mono uppercase tracking-wider"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs uppercase font-bold tracking-wider rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[10px] text-red-400 font-medium">{couponError}</p>}
              {activeCoupon && (
                <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                  <span className="font-semibold">Applied: {activeCoupon.code}</span>
                  <span>{activeCoupon.discount}% Off</span>
                </div>
              )}

              {/* Price Calculation details */}
              <div className="space-y-2 text-xs text-cafe-cream/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Discount ({activeCoupon.discount}%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax &amp; Service Fee</span>
                  <span className="font-mono text-white">${deliveryOrTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif text-sm font-semibold text-white pt-2 border-t border-white/5">
                  <span className="uppercase tracking-wider">Estimated Total</span>
                  <span className="font-mono text-cafe-gold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 bg-cafe-gold text-cafe-charcoal hover:bg-cafe-cream hover:text-cafe-smoky text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
