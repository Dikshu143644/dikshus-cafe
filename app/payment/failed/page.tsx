'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NextPaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#FEFAF4] flex flex-col items-center justify-center p-6 text-[#352F2C]">
      <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />

        <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 text-red-500 flex items-center justify-center mx-auto shadow-md">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-red-600 block">
            Transaction Declined or Verification Failed
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight">
            Verification Refused
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            The cryptographic signature check might have failed, or the session expired. Fake payment updates are barred of standard controls.
          </p>
        </div>

        {/* Security context */}
        <div className="bg-red-50/50 border border-red-100/50 rounded-xl p-4 text-left flex items-start space-x-2.5 text-xs text-red-700">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block text-[10px]">Security Notice:</span>
            <span className="text-[10px] leading-relaxed block">
              We verify the razorpay_signature using SHA-256 HMAC. Modifying success coordinates directly will trigger signature rejection alerts.
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col space-y-2.5">
          <a
            href="/"
            className="w-full py-3 bg-[#352F2C] hover:bg-[#D4AF37] text-white hover:text-[#352F2C] text-xs font-bold uppercase tracking-widest rounded-xl transition duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Retry checkout payment</span>
          </a>
          <a
            href="/"
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-xl transition duration-300"
          >
            Cancel Order Ticket
          </a>
        </div>
      </div>
    </div>
  );
}
