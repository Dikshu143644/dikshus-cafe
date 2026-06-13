'use client';

import React from 'react';
import { Check, Sparkles, MapPin, Compass } from 'lucide-react';

export default function NextPaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FEFAF4] flex flex-col items-center justify-center p-6 text-[#352F2C]">
      <div className="max-w-md w-full bg-white border border-[#deb887]/20 rounded-2xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Abstract Gold Background Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-emerald-500" />

        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-400/20 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <Check className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-emerald-600 block">
            Cryptographic Verification Successful
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight">
            Order Dispatched!
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Your transaction was successfully verified on our server using private HSM signature validation.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left font-mono text-xs uppercase space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Merchant:</span>
            <span className="font-bold">Cafe Vista London</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Order Method:</span>
            <span className="font-bold">Express Pickup</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Debited Total:</span>
            <span className="font-bold text-[#352F2C]">$17.15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Queue Wait:</span>
            <span className="font-bold text-yellow-600">12-15 Minutes</span>
          </div>
        </div>

        {/* Loyalty credits */}
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center space-x-2.5 text-left text-[11px] text-[#352F2C]">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Earned <strong>170 Vista Credits</strong>. Applied directly to your loyalty point reserves.
          </span>
        </div>

        <div className="pt-2 flex flex-col space-y-2">
          <a
            href="/"
            className="w-full py-3 bg-[#352F2C] hover:bg-[#D4AF37] text-white hover:text-[#352F2C] text-xs font-bold uppercase tracking-widest rounded-xl transition duration-300 flex items-center justify-center"
          >
            Return to Store
          </a>
        </div>
      </div>
    </div>
  );
}
