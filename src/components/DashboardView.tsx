import React, { useEffect, useState } from 'react';
import { Star, Sparkles, User, Gift, Clock, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { UserRole, Order, Booking, MenuItem } from '../types';
import GlassCard from './GlassCard';
import SecureCopyButton from './SecureCopyButton';

interface DashboardViewProps {
  user: { id: string; name: string; email: string; phone: string; loyaltyPoints: number; favorites: string[] } | null;
  orders: Order[];
  bookings: Booking[];
  menuItems: MenuItem[];
  onRemoveFavorite: (id: string) => void;
  onNavigate: (page: string) => void;
}

export default function DashboardView({
  user,
  orders,
  bookings,
  menuItems,
  onRemoveFavorite,
  onNavigate,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'bookings'>('profile');

  if (!user) {
    return (
      <div className="bg-transparent min-h-screen pt-40 px-4 text-center font-sans relative z-10">
        <GlassCard theme="light" className="max-w-md mx-auto space-y-4">
          <User className="w-12 h-12 text-cafe-cream/30 mx-auto" />
          <h2 className="font-serif text-lg font-bold text-cafe-charcoal uppercase">Access Denied</h2>
          <p className="text-xs text-cafe-charcoal/60 leading-relaxed">
            Please log in or register a new Cafe Vista account to view your customizable rewards dashboards.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-2.5 bg-cafe-smoky text-white text-xs uppercase font-bold tracking-wider rounded-full transition-colors cursor-pointer"
          >
            Go to Login
          </button>
        </GlassCard>
      </div>
    );
  }

  // Filter systems
  const userOrders = orders.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase());
  const userBookings = bookings.filter(b => b.customerEmail.toLowerCase() === user.email.toLowerCase());
  const userFavorites = menuItems.filter(m => user.favorites.includes(m.id));

  // Loyalty rewards calculations
  const nextTarget = 500;
  const progressPercent = Math.min((user.loyaltyPoints / nextTarget) * 100, 100);

  return (
    <div id="customer-dashboard" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-10">
          <div className="md:col-span-8 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#a38059] font-mono font-bold leading-none block">
              / CUSTOMER PORTAL
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-cafe-charcoal font-bold uppercase leading-tight">
              A Warm Welcome back,<br />
              <span className="text-cafe-bronze">{user.name}</span>
            </h1>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <span className="px-4.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-mono tracking-widest uppercase font-bold rounded-full flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity Verified (OTP OK)</span>
            </span>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: rewards and profile card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Rewards Card */}
            <div className="bg-gradient-to-br from-cafe-smoky to-cafe-charcoal text-cafe-cream p-6 rounded-2xl border border-cafe-gold/20 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Coffee glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cafe-gold/5 blur-[50px] rounded-full pointer-events-none"></div>

              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#d1b48c] font-mono font-bold block leading-none">
                    VIsta loyalty points ledger
                  </span>
                  <span className="font-serif text-2xl font-bold uppercase block mt-2 text-white">
                    Café Member Card
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-cafe-gold/15 flex items-center justify-center border border-cafe-gold/30">
                  <Gift className="w-5 h-5 text-cafe-gold" />
                </div>
              </div>

              {/* Points Readout */}
              <div className="text-center py-4 space-y-1">
                <span className="text-4xl sm:text-5xl font-mono text-cafe-gold font-bold block">
                  {user.loyaltyPoints}
                </span>
                <span className="text-[10px] text-cafe-cream/50 tracking-wider">
                  ACTIVATED REWARD BALANCE CREDITS
                </span>
              </div>

              {/* Progress target bar */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[10px] uppercase font-mono tracking-wide text-cafe-cream/60">
                  <span>Progress to free beverage</span>
                  <span>{user.loyaltyPoints}/{nextTarget} pts</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-cafe-gold rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="text-[9px] text-[#d1b48c] italic block mt-1">
                  Earn {nextTarget - user.loyaltyPoints} more points to claim your customized glazed pastry!
                </span>
              </div>
            </div>

            {/* Account Quick Specs */}
            <div className="glass-light rounded-2xl p-5 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-cafe-bronze font-bold block pb-1 border-b border-cafe-smoky/5">
                Biological summary
              </span>
              <div className="space-y-3.5 text-xs text-cafe-charcoal/70">
                <div>
                  <span className="text-cafe-charcoal/40 block leading-none uppercase text-[9px] font-bold">Email handle</span>
                  <span className="text-cafe-smoky font-medium block mt-1">{user.email}</span>
                </div>
                <div>
                  <span className="text-cafe-charcoal/40 block leading-none uppercase text-[9px] font-bold">Bio phone link</span>
                  <span className="text-cafe-smoky font-medium block mt-1">{user.phone}</span>
                </div>
                <div>
                  <span className="text-cafe-charcoal/40 block leading-none uppercase text-[9px] font-bold">Loyalty grade</span>
                  <span className="text-cafe-gold font-mono font-bold block mt-1">BRONZE REFUGIÉ VISTA</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: track placements and active order timers */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs navigations */}
            <div className="flex border-b border-cafe-smoky/10">
              {['profile', 'orders', 'bookings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 outline-none transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'border-cafe-smoky text-cafe-charcoal font-bold'
                      : 'border-transparent text-cafe-charcoal/40 hover:text-cafe-smoky'
                  }`}
                >
                  {tab === 'profile' ? 'My Favorites & Recommendations' : tab === 'orders' ? `My Placed Orders (${userOrders.length})` : `My Reservations (${userBookings.length})`}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS 1: FAVORITES & AI CONCIERGE LIST */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Active Favorites */}
                <div className="space-y-3">
                  <h3 className="font-serif text-sm font-semibold text-cafe-charcoal uppercase tracking-wider">
                    My Favorites Selections
                  </h3>
                  
                  {userFavorites.length === 0 ? (
                    <div className="p-8 text-center glass-light rounded-2xl text-xs text-cafe-charcoal/50">
                      You haven't favorited any café items yet. Flip standard card back panels during menu discovery to add favorites.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {userFavorites.map((fav) => (
                        <div
                          key={fav.id}
                          className="flex items-center space-x-3 p-3.5 glass-light border border-white hover:border-cafe-gold/30 rounded-xl transition-all"
                        >
                          <img
                            referrerPolicy="no-referrer"
                            src={fav.image}
                            alt={fav.name}
                            className="w-12 h-12 rounded-lg object-cover bg-cafe-smoky shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-cafe-charcoal text-xs block truncate">{fav.name}</span>
                            <span className="text-[10px] text-cafe-gold font-mono font-bold block mt-0.5">${fav.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => onRemoveFavorite(fav.id)}
                            className="text-[10px] text-red-400 hover:underline uppercase tracking-wider font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Concierge quick widget promo */}
                <div className="glass-light p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-wide block">PROACTIVE CONCIERGE HELP</span>
                    <h4 className="font-serif text-sm font-semibold text-cafe-charcoal uppercase leading-relaxed">Let AI plan your diet?</h4>
                    <p className="text-xs text-cafe-charcoal/60 leading-relaxed">Speak directly with our Digital Concierge Model regarding ingredients and timings.</p>
                  </div>
                  <button
                    onClick={() => onNavigate('assistant')}
                    className="px-5 py-2.5 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky text-xs uppercase font-bold tracking-widest rounded-full transition-all"
                  >
                    Open AI Chat Assistant
                  </button>
                </div>

              </div>
            )}

            {/* TAB CONTENTS 2: RECENT ORDERS WITH ACTIVE STATUS TIMERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-fadeIn">
                {userOrders.length === 0 ? (
                  <div className="p-12 text-center bg-white/35 rounded-2xl border border-[#deb887]/20 text-xs text-cafe-charcoal/50">
                    No order records found. Explore our hand-rolled pastries and submit a test signature payment checkout!
                  </div>
                ) : (
                  userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white border border-[#deb887]/25 rounded-2xl p-5 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cafe-smoky/5 pb-3">
                        <div className="flex items-start gap-2">
                          <SecureCopyButton value={ord.id} label={`order ${ord.id}`} />
                          <div>
                            <span className="font-mono text-xs font-bold text-cafe-charcoal">ID CODE: {ord.id}</span>
                          <span className="text-[10px] text-cafe-charcoal/40 block mt-0.5">PLACED: {new Date(ord.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-bold rounded bg-yellow-500/10 border border-yellow-500/25 text-yellow-600">
                            {ord.status}
                          </span>
                          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-bold rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-600">
                            PAID (${ord.total.toFixed(2)})
                          </span>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="space-y-1.5 text-xs text-cafe-charcoal/80">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.name} <strong className="font-mono text-cafe-charcoal/50">x{it.quantity}</strong></span>
                            <span className="font-mono font-bold">${(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Live visual status tracker diagram */}
                      <div className="pt-3 border-t border-cafe-smoky/5 text-[9px] uppercase font-mono tracking-wider grid grid-cols-4 gap-2 text-center">
                        <div className={`py-1.5 rounded ${ord.status === 'pending' ? 'bg-cafe-gold text-cafe-charcoal font-bold' : 'bg-cafe-smoky/5 text-cafe-charcoal/30'}`}>
                          Pending
                        </div>
                        <div className={`py-1.5 rounded ${ord.status === 'preparing' ? 'bg-cafe-gold text-cafe-charcoal font-bold' : 'bg-cafe-smoky/5 text-cafe-charcoal/30'}`}>
                          Preparing
                        </div>
                        <div className={`py-1.5 rounded ${ord.status === 'ready' ? 'bg-cafe-gold text-cafe-charcoal font-bold' : 'bg-cafe-smoky/5 text-cafe-charcoal/30'}`}>
                          Ready
                        </div>
                        <div className={`py-1.5 rounded ${ord.status === 'completed' ? 'bg-cafe-gold text-cafe-charcoal font-bold' : 'bg-cafe-smoky/5 text-cafe-charcoal/30'}`}>
                          Done
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENTS 3: BOOKINGS RESERVATIONS LISTINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-4 animate-fadeIn">
                {userBookings.length === 0 ? (
                  <div className="p-12 text-center bg-white/35 rounded-2xl border border-[#deb887]/20 text-xs text-cafe-charcoal/50">
                    No booked schedule slots found. Make a secure booking step table reserve request first!
                  </div>
                ) : (
                  userBookings.map((bk) => (
                    <div
                      key={bk.id}
                      className="bg-white border border-[#deb887]/25 rounded-2xl p-5 shadow-sm relative overflow-hidden"
                    >
                      {/* Ticket Notch Visuals */}
                      <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-cafe-cream border-r border-[#deb887]/25 rounded-full -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-cafe-cream border-l border-[#deb887]/25 rounded-full -translate-y-1/2"></div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cafe-smoky/5 pb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-cafe-gold shrink-0" />
                          <span className="font-serif text-sm font-semibold text-cafe-smoky uppercase">
                            {bk.tablePreference} Zone Reserve
                          </span>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 rounded">
                          {bk.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono uppercase tracking-tight py-2.5">
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none select-none">CODE ID</span>
                          <span className="mt-1 flex items-center gap-2">
                            <strong className="text-cafe-smoky text-xs font-bold block">{bk.id}</strong>
                            <SecureCopyButton value={bk.id} label={`booking ${bk.id}`} />
                          </span>
                        </div>
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none select-none">DATE</span>
                          <strong className="text-cafe-smoky text-xs font-bold block mt-1">{bk.date}</strong>
                        </div>
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none select-none">TIME</span>
                          <strong className="text-cafe-smoky text-xs font-bold block mt-1">{bk.time}</strong>
                        </div>
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none select-none">GUESTS</span>
                          <strong className="text-cafe-smoky text-xs font-bold block mt-1">{bk.guestsCount} PERSONS</strong>
                        </div>
                      </div>

                      {bk.calendarEventId && (
                        <div className="p-2.5 bg-cafe-smoky/5 rounded border border-cafe-smoky/10 text-[9px] uppercase font-mono tracking-widest text-[#a38059] flex items-center justify-between">
                          <span>Google Calendar sync: ACTIVE</span>
                          <span className="flex items-center gap-2 text-cafe-charcoal/50">
                            EVT CODE: {bk.calendarEventId}
                            <SecureCopyButton value={bk.calendarEventId} label={`calendar event ${bk.calendarEventId}`} />
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
