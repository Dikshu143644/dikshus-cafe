import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DeliveryBag3D() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#FEFAF4]/35">
      {/* Golden spotlight radial halo */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-[#EEDCC6]/40 blur-[50px] -z-10 pointer-events-none" />

      {/* Floating Sparkles decorative effects */}
      {!prefersReducedMotion && (
        <>
          <div className="absolute top-8 left-12 text-[#9C7346]/40 text-xl animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
          <div className="absolute bottom-10 right-14 text-[#9C7346]/40 text-lg animate-bounce" style={{ animationDuration: '5.5s' }}>✨</div>
        </>
      )}

      {/* Elegant 2.5D floating Kraft Paper Bag illustration container */}
      <div 
        className="relative flex flex-col items-center justify-center"
        style={{
          transform: prefersReducedMotion ? 'none' : 'translateY(0px)',
          animation: prefersReducedMotion ? 'none' : 'floatBag 4.2s infinite ease-in-out'
        }}
      >
        <style>{`
          @keyframes floatBag {
            0% { transform: translateY(3px) rotate(-0.5deg); }
            50% { transform: translateY(-7px) rotate(0.5deg); }
            100% { transform: translateY(3px) rotate(-0.5deg); }
          }
        `}</style>

        {/* 2.5D Shopping Bag Visual with custom gold borders */}
        <div className="relative w-28 h-36 bg-gradient-to-br from-[#ca9e75] via-[#bd9168] to-[#ab7f56] rounded-2xl shadow-xl flex flex-col items-center justify-between p-3.5 border border-[#deb887]/30">
          {/* Paper Bag crease lines */}
          <div className="absolute inset-y-0 left-4 w-px bg-black/5" />
          <div className="absolute inset-y-0 right-4 w-px bg-black/5" />

          {/* Premium Gold Luxury Handle loop */}
          <div className="absolute -top-4 w-12 h-6 border-4 border-[#9C7346] border-b-0 rounded-t-full opacity-90 shadow-sm" />

          {/* Golden Seal badge sticker on bag */}
          <div className="w-10 h-14 bg-[#1C1814] rounded-md shadow-md border border-[#9C7346]/35 flex flex-col items-center justify-center py-1.5 space-y-1 relative z-10 select-none">
            {/* Tiny green organic dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[5.5px] uppercase tracking-wider text-[#deb887] font-mono leading-none">Vista</span>
            <div className="border-t border-[#9C7346]/25 w-[75%] mt-0.5" />
            <ShoppingBag className="w-2.5 h-2.5 text-[#deb887]/80 shrink-0" />
          </div>

          <span className="text-[8px] font-mono font-extrabold uppercase tracking-widest text-[#FEFAF4]/90 select-none leading-none">
            HAND-CRAFTED
          </span>
        </div>

        {/* Elegant glassmorphic verified badge overlapping the bag */}
        <div className="absolute -bottom-2 -right-3 bg-white/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-500/20 shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[8.5px] font-extrabold text-[#1C1814] uppercase tracking-wide font-sans leading-none">
            Safe Delivery
          </span>
        </div>
      </div>

      {/* Footpad stand underneath to convey perspective structure */}
      <div className="w-24 h-1 bg-neutral-950/10 blur-[2px] rounded-full mt-3.5 opacity-80" />
    </div>
  );
}
