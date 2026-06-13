import React, { useState } from 'react';
import { DollarSign, LayoutDashboard, Database, UserCheck, AlertOctagon, MailOpen, ClipboardList, BookOpen, Clock } from 'lucide-react';
import { UserRole, Booking, Order } from '../types';
import GlassCard from './GlassCard';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface ManagerViewProps {
  user: { name: string; role: UserRole } | null;
  bookings: Booking[];
  orders: Order[];
  messages: ContactMessage[];
  onUpdateBookingStatus: (id: string, status: 'approved' | 'cancelled') => void;
  onUpdateOrderStatus: (id: string, status: 'preparing' | 'ready' | 'completed') => void;
  onNavigate: (page: string) => void;
}

export default function ManagerView({
  user,
  bookings,
  orders,
  messages,
  onUpdateBookingStatus,
  onUpdateOrderStatus,
  onNavigate,
}: ManagerViewProps) {
  const [subTab, setSubTab] = useState<'bookings' | 'orders' | 'messages' | 'staff'>('orders');

  if (!user || user.role !== 'manager') {
    return (
      <div className="bg-transparent min-h-screen pt-40 px-4 text-center font-sans relative z-10">
        <GlassCard theme="light" className="max-w-md mx-auto space-y-4">
          <AlertOctagon className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="font-serif text-lg font-bold text-cafe-charcoal uppercase">Access Denied</h2>
          <p className="text-xs text-cafe-charcoal/60 leading-relaxed">
            Manager panel access is restricted to verified administrative personnel. Please log in with credentials: <br />
            <strong className="text-cafe-smoky font-mono font-bold block mt-1">manager@cafevista.com</strong>
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

  // Analytics Metrics calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0) + 15000; // static base + actual
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length + 120;
  const pendingOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pendingReservations = bookings.filter(b => b.status === 'pending');

  const staffSchedules = [
    { name: 'Chloe Laurent', role: 'Head Barista', shift: '06:30 — 14:30', tables: 'Espresso Bar' },
    { name: 'Jacques Martin', role: 'Pastry Chef', shift: '05:00 — 13:00', tables: 'Kitchen Deck A' },
    { name: 'Isabella Vance', role: 'Dine-In Lead Hosp.', shift: '12:00 — 20:00', tables: 'Garden Alcove' },
    { name: 'David Mercer', role: 'Evening Supervisor', shift: '14:30 — 22:30', tables: 'All Seating' }
  ];

  return (
    <div id="manager-dashboard" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center sm:text-left space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-cafe-bronze font-mono font-bold">
            / OFFICE DESK OPERATIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-cafe-charcoal font-bold uppercase">
            Operations Console Workspace
          </h1>
          <p className="text-xs text-cafe-charcoal/60">Live feed tracking orders and parlor table seating logistics.</p>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Revenue */}
          <div className="bg-white/60 p-5 rounded-2xl border border-[#deb887]/25 shadow-sm space-y-3">
            <span className="text-[10px] text-cafe-charcoal/40 uppercase font-mono block">Gross Revenue Sales</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono text-cafe-charcoal font-bold">${totalRevenue.toFixed(2)}</span>
              <DollarSign className="w-5 h-5 text-cafe-bronze" />
            </div>
            <span className="text-[9px] text-emerald-600 font-bold font-mono block">+12.4% vs last week</span>
          </div>

          {/* Table Seating occupancy */}
          <div className="bg-white/60 p-5 rounded-2xl border border-[#deb887]/25 shadow-sm space-y-3">
            <span className="text-[10px] text-cafe-charcoal/40 uppercase font-mono block">Parlor Table Occupancy</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono text-cafe-charcoal font-bold">85%</span>
              <Database className="w-5 h-5 text-cafe-bronze" />
            </div>
            <span className="text-[9px] font-bold text-cafe-bronze font-mono block">Window &amp; Garden fully reserved</span>
          </div>

          {/* Completed tickets */}
          <div className="bg-white/60 p-5 rounded-2xl border border-[#deb887]/25 shadow-sm space-y-3">
            <span className="text-[10px] text-cafe-charcoal/40 uppercase font-mono block">Completed Orders</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono text-cafe-charcoal font-bold">{completedOrdersCount} Tickets</span>
              <ClipboardList className="w-5 h-5 text-cafe-bronze" />
            </div>
            <span className="text-[9px] text-cafe-charcoal/50 font-mono block">Preparations standard duration: 7 mins</span>
          </div>

          {/* Action requirements */}
          <div className="bg-gradient-to-br from-[#a38059]/10 to-[#deb887]/15 p-5 rounded-2xl border border-[#a38059]/30 shadow-sm space-y-3">
            <span className="text-[10px] text-cafe-bronze uppercase font-bold tracking-wide block">Unresolved bookings</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono text-cafe-smoky font-bold">{pendingReservations.length} Pending</span>
              <UserCheck className="w-5 h-5 text-cafe-bronze animate-pulse" />
            </div>
            <span className="text-[9px] font-bold text-cafe-bronze font-mono block">Requires review below</span>
          </div>

        </div>

        {/* WORKSPACE ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sub Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-[10px] uppercase font-mono text-cafe-charcoal/40 font-bold block pb-2 border-b border-cafe-smoky/5 mb-3">
              Sections Filters
            </span>
            {[
              { id: 'orders', label: `Active Cooking orders (${pendingOrders.length})` },
              { id: 'bookings', label: `Reservations Lists (${bookings.length})` },
              { id: 'messages', label: `Contact Inbox messages (${messages.length})` },
              { id: 'staff', label: "Baristas & Staff Shifts (4)" }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSubTab(sub.id as any)}
                className={`w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                  subTab === sub.id
                    ? 'bg-cafe-smoky border-cafe-smoky text-white'
                    : 'bg-white/45 border-[#deb887]/20 text-cafe-charcoal/70 hover:border-cafe-smoky/45'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Dynamic Content Columns */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* SUB-TAB: COOKING ORDERS CARD LISTS */}
            {subTab === 'orders' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-cafe-smoky/5 pb-2">
                  <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cafe-charcoal">
                    Kitchen Preparation line
                  </h3>
                  <span className="text-[10px] font-mono text-cafe-charcoal/50">Simulated live feed updates</span>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center bg-white/35 rounded-2xl border border-[#deb887]/20 text-xs text-cafe-charcoal/50">
                    No active orders. Create user checkouts on the cart sidebar drawer to populate.
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white/70 border border-[#deb887]/25 rounded-2xl p-5 space-y-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center border-b border-cafe-smoky/5 pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-cafe-charcoal uppercase">TICKET ID: {ord.id}</span>
                          <span className="text-[10px] text-cafe-charcoal/50 block font-sans">
                            CUST: {ord.customerName} | {ord.customerPhone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-wider font-bold">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">PAID</span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-400/20">{ord.status}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <ul className="text-xs text-cafe-charcoal/80 space-y-1 bg-cafe-smoky/5 rounded-xl p-3 border border-cafe-smoky/5">
                        {ord.items.map((it, k) => (
                          <li key={k} className="flex justify-between font-mono">
                            <span>{it.name} <strong className="text-cafe-bronze">x{it.quantity}</strong></span>
                            <span>${(it.price * it.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Control buttons */}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] tracking-widest text-[#a38059] uppercase font-mono font-bold">
                          Dining category: {ord.diningType}
                        </span>

                        <div className="flex space-x-2">
                          {ord.status === 'pending' && (
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'preparing')}
                              className="px-4 py-2 bg-yellow-500/15 border border-yellow-500/30 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Mark: Preparing
                            </button>
                          )}
                          {(ord.status === 'pending' || ord.status === 'preparing') && (
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'ready')}
                              className="px-4 py-2 bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Mark: Ready for Pickup
                            </button>
                          )}
                          {ord.status === 'ready' && (
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'completed')}
                              className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Finalize ticket
                            </button>
                          )}
                          {ord.status === 'completed' && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1 font-mono">
                              <span>● COMPLETED</span>
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUB-TAB: BOOKING LIST LOGS */}
            {subTab === 'bookings' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-cafe-smoky/5 pb-2">
                  <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cafe-charcoal">
                    Parlor reservations tracker
                  </h3>
                  <span className="text-[10px] font-mono text-cafe-charcoal/50">Capacity threshold constraints</span>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-8 text-center bg-white/35 rounded-2xl border border-[#deb887]/20 text-xs text-cafe-charcoal/50">
                    No reservation bookings found. Make submissions in the table reserve page.
                  </div>
                ) : (
                  bookings.map((bk) => (
                    <div
                      key={bk.id}
                      className="bg-white/70 border border-[#deb887]/25 rounded-2xl p-5 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cafe-smoky/5 pb-2.5">
                        <div>
                          <strong className="font-serif text-sm font-bold text-cafe-smoky uppercase block">
                            {bk.customerName}
                          </strong>
                          <span className="text-[10px] text-cafe-charcoal/50 font-mono block mt-0.5">
                            CODE REF ID: {bk.id} | EMAIL: {bk.customerEmail}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-bold ${
                          bk.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : bk.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {bk.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono py-1.5 uppercase">
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none">DATE:</span>
                          <span className="font-bold text-cafe-smoky inline-block mt-1">{bk.date}</span>
                        </div>
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none">TIME SLOT:</span>
                          <span className="font-bold text-cafe-smoky inline-block mt-1">{bk.time} AM</span>
                        </div>
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none">GUESTS:</span>
                          <span className="font-bold text-cafe-smoky inline-block mt-1">{bk.guestsCount} PERSONS</span>
                        </div>
                        <div>
                          <span className="text-cafe-charcoal/40 block leading-none">ZONE PREF:</span>
                          <span className="font-bold text-cafe-gold inline-block mt-1">{bk.tablePreference}</span>
                        </div>
                      </div>

                      {bk.specialNotes && (
                        <p className="text-xs text-cafe-charcoal/70 bg-cafe-smoky/5 border border-cafe-smoky/5 rounded-lg p-2.5">
                          <strong>Staff instructions:</strong> {bk.specialNotes}
                        </p>
                      )}

                      {/* Controls */}
                      {bk.status === 'pending' && (
                        <div className="pt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => onUpdateBookingStatus(bk.id, 'cancelled')}
                            className="px-4 py-2 bg-red-500/15 border border-red-500/30 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Reject Reserve
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(bk.id, 'approved')}
                            className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Approve Schedule
                          </button>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUB-TAB: CUSTOMER MESSAGE INBOXES */}
            {subTab === 'messages' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-cafe-smoky/5 pb-2">
                  <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cafe-charcoal">
                    Support Messages Inbox
                  </h3>
                  <span className="text-[10px] font-mono text-cafe-charcoal/50">Total captured messages: {messages.length}</span>
                </div>

                {messages.length === 0 ? (
                  <div className="p-8 text-center bg-white/35 rounded-2xl border border-[#deb887]/20 text-xs text-cafe-charcoal/50">
                    Your customer service inbox is quiet. Submit support forms inside the contact subview to test.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white border border-[#deb887]/25 rounded-2xl p-5 space-y-2.5 shadow-sm"
                    >
                      <div className="flex justify-between items-start border-b border-cafe-smoky/5 pb-2">
                        <div>
                          <strong className="font-serif text-xs font-bold text-cafe-smoky uppercase block font-sans">
                            FROM: {msg.name} ({msg.email})
                          </strong>
                          <span className="text-[10px] font-mono text-[#a38059] block mt-0.5">CODE REF: {msg.id}</span>
                        </div>
                        <span className="text-[10px] text-cafe-charcoal/40 font-mono">{msg.date}</span>
                      </div>
                      <p className="text-xs text-cafe-charcoal/80 leading-relaxed font-sans">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUB-TAB: STAFF SHIFTING ROSTER */}
            {subTab === 'staff' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-cafe-smoky/5 pb-2">
                  <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cafe-charcoal">
                    Barista shift assignment schedule
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {staffSchedules.map((staff, i) => (
                    <div
                      key={i}
                      className="bg-white border border-[#deb887]/25 rounded-2xl p-5 flex items-start space-x-4 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-cafe-smoky/5 flex items-center justify-center font-serif text-sm font-bold border border-cafe-smoky/10">
                        {staff.name[0]}
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <strong className="font-serif text-sm font-bold text-cafe-smoky uppercase block">{staff.name}</strong>
                        <div className="space-y-1 text-[10px] text-cafe-charcoal/60 font-mono uppercase tracking-wider">
                          <p>Grade role: <span className="font-bold text-cafe-bronze">{staff.role}</span></p>
                          <p>Shift details: <span className="font-bold text-cafe-smoky">{staff.shift}</span></p>
                          <p>Zone assigned: <span className="font-bold text-cafe-smoky">{staff.tables}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
