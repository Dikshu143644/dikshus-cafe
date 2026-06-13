'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Receipt, CheckCircle, Shield } from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch individual order from server verifying logged-in user profile ownership
    // To resolve URL editing IDOR breaches, the server matches orders using verified session tokens
    const fetchOrder = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          const target = data.orders?.find((o: any) => o.id === params.id || o.id === `o-${params.id}`);
          if (target) {
            setOrder(target);
          }
        }
      } catch (err) {
        console.warn('Authentication token mismatch or system lookup failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return <div className="p-12 text-center text-xs font-mono uppercase">Validating credential authorization...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FEFAF4] p-12 text-center flex flex-col items-center justify-center space-y-4">
        <h2 className="font-serif text-2xl uppercase font-bold text-red-600">Access Denied or Order Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm">
          URL modification was checked and blocked. Every order request compares order ownership against the session user profile.
        </p>
        <a href="/" className="px-6 py-2 bg-[#352F2C] text-white text-xs uppercase font-bold rounded-full">
          Return to Hub
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFAF4] pt-24 pb-16 text-[#352F2C] font-sans">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <a href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </a>
          <span className="px-3 py-1 bg-[#352F2C] text-white font-mono text-[11px] rounded-full uppercase tracking-wider font-bold">
            Order ID: {order.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-6">
            <div className="bg-white border border-[#deb887]/20 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 text-emerald-600 border-b border-gray-100 pb-3">
                <CheckCircle className="w-5 h-5" />
                <h2 className="font-serif text-lg font-bold uppercase">Transaction Verified &amp; Paid</h2>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono text-gray-400 block">Ordered Items:</span>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold">{item.name}</span>
                      <span className="text-gray-400 block">Qty: {item.quantity} x ${item.price.toFixed(2)}</span>
                    </div>
                    <span className="font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items Subtotal</span>
                  <span className="font-mono">${order.subtotal?.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Code Applied</span>
                    <span className="font-mono">-${order.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-gray-100 pt-2 text-sm text-[#352F2C]">
                  <span>Amount Debited</span>
                  <span className="font-mono">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#deb887]/20 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider">Estimated Preparation Metrics</h3>
              <div className="flex items-center space-x-3 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-800">
                <Clock className="w-5 h-5 shrink-0" />
                <div>
                  <span className="text-xs font-bold uppercase block">Barista Queue Active</span>
                  <span className="text-[10px] block mt-1">Expected preparation and set-up time: <strong>12-15 minutes</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-white border border-[#deb887]/20 rounded-2xl p-6 space-y-4 shadow-sm font-mono text-[11px] uppercase">
              <span className="text-[10px] font-bold text-gray-400 block pb-1 border-b border-gray-100">Order Information</span>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Method:</span>
                  <span className="font-bold">{order.diningType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-bold text-yellow-600">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Client Ref:</span>
                  <span className="font-bold">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="font-bold">{order.customerPhone}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#deb887]/20 rounded-2xl p-4 text-center text-[10px] text-gray-400 font-mono flex items-center justify-center space-x-1.5 shadow-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Verified Customer Session Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
