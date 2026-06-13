import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function CoffeeCupScene() {
  const prefersReducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse move parallax offsets
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      className="w-full h-full min-h-[400px] lg:min-h-[550px] relative flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing group p-4 sm:p-8"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* CSS injected for realistic glass reflection & steam drifting */}
      <style>{`
        @keyframes steamAnimation {
          0% { transform: translateY(10px) translateX(0) scale(0.9); opacity: 0; filter: blur(4px); }
          20% { opacity: 0.35; filter: blur(5px); }
          50% { transform: translateY(-30px) translateX(5px) scale(1.1); opacity: 0.25; filter: blur(7px); }
          80% { opacity: 0.1; }
          100% { transform: translateY(-75px) translateX(-4px) scale(1.4); opacity: 0; filter: blur(9px); }
        }
        .steam-particle-1 { animation: steamAnimation 5s infinite ease-in-out; }
        .steam-particle-2 { animation: steamAnimation 6.5s infinite ease-in-out 1.2s; }
        .steam-particle-3 { animation: steamAnimation 4s infinite ease-in-out 2.5s; }
      `}</style>

      {/* 1. Backdrop Glow of Glasshouse Sun rays */}
      <div 
        className="absolute w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] bg-gradient-to-tr from-[#9C7346]/20 via-[#EEDCC6]/25 to-transparent rounded-full blur-[70px] -z-10 transition-transform duration-500 ease-out pointer-events-none"
        style={{
          transform: prefersReducedMotion 
            ? 'none' 
            : `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`
        }}
      />

      {/* 2. Concentric Golden Ring - Architectural Dial */}
      <div 
        className="absolute border border-[#deb887]/20 w-[280px] h-[280px] sm:w-[410px] sm:h-[410px] rounded-full flex items-center justify-center transition-transform duration-[1000ms] ease-out pointer-events-none"
        style={{
          transform: prefersReducedMotion 
            ? 'none' 
            : `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px) rotate(${mousePos.x * 15}deg)`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span className="absolute bottom-5 text-[8px] uppercase tracking-[0.4em] text-[#9C7346]/40 font-mono font-bold">
          Cafe Vista Glasshouse
        </span>
        <div className="border border-dashed border-[#deb887]/10 w-[240px] h-[240px] sm:w-[350px] sm:h-[350px] rounded-full" />
      </div>

      {/* 3. Luxury Stacked Main Mug Elements Container */}
      <div 
        className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] flex items-center justify-center transition-transform duration-[800ms]"
        style={{
          transform: prefersReducedMotion 
            ? 'none' 
            : `translate(${mousePos.x * 35}px, ${mousePos.y * 35}px) rotateX(${-mousePos.y * 10}deg) rotateY(${mousePos.x * 10}deg)`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Layer A: Golden shadow underneath saucer */}
        <div className="absolute w-[220px] h-[20px] bg-stone-900/10 blur-[14px] rounded-full bottom-2 transition-opacity duration-300 pointer-events-none" />

        {/* Layer B: The Saucer & Cup combined high-fidelity mockup */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop"
            alt="Hand-thrown Porcelain Cup with Artisan Rosetta Latte Art"
            className="w-[220px] h-[220px] sm:w-[290px] sm:h-[290px] object-cover rounded-full shadow-2xl border-4 border-white/60 group-hover:scale-[1.03] transition-all duration-[600ms]"
            referrerPolicy="no-referrer"
            style={{
              boxShadow: '0 25px 60px -15px rgba(28, 24, 20, 0.25)'
            }}
          />

          {/* Golden frame accent matching raw concrete layout */}
          <div className="absolute inset-x-0 inset-y-0 w-[230px] h-[230px] sm:w-[302px] sm:h-[302px] border border-[#9C7346]/15 rounded-full pointer-events-none -m-1.5 sm:-m-2" />

          {/* Realistic Steam Layer drifting from latte center */}
          {!prefersReducedMotion && (
            <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-16 h-20 flex justify-center pointer-events-none z-30">
              <div className="absolute w-2 h-14 bg-white/40 rounded-full steam-particle-1 -left-2" />
              <div className="absolute w-2.5 h-16 bg-white/30 rounded-full steam-particle-2 left-1" />
              <div className="absolute w-1.5 h-12 bg-white/45 rounded-full steam-particle-3 left-4" />
            </div>
          )}

          {/* High-quality Gloss reflection layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 rounded-full pointer-events-none mix-blend-overlay" />
        </div>
      </div>

      {/* 4. Elegant Interactive Menu Overlay hovering in 2.5D depth */}
      <div 
        className="absolute right-2 sm:right-6 bottom-4 sm:bottom-12 w-48 sm:w-56 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-[#deb887]/20 shadow-xl text-left transition-all duration-[900ms] pointer-events-auto"
        style={{
          transform: prefersReducedMotion 
            ? 'none' 
            : `translate(${mousePos.x * 55}px, ${mousePos.y * 22}px) rotate(${mousePos.x * 3}deg)`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="flex justify-between items-start border-b border-[#241C16]/10 pb-2 mb-2">
          <div>
            <span className="text-[7.5px] uppercase tracking-widest font-extrabold text-[#9C7346] block font-mono">
              Today's Selection
            </span>
            <h4 className="font-serif text-xs font-extrabold text-[#1C1814] mt-0.5">
              Smoked Velvet Latte
            </h4>
          </div>
          <span className="text-xs font-bold text-[#9C7346] font-mono">$6.50</span>
        </div>
        <p className="text-[9.5px] text-[#2C2621]/80 leading-relaxed font-semibold mb-2.5">
          House double-shot single-origin espresso wash, smoked with cherry wood and organic lavender mist.
        </p>
        <div className="flex justify-between items-center text-[8px] font-mono font-bold text-[#9C7346]">
          <span className="flex items-center gap-0.5">★ 4.9 <span className="text-stone-400 font-sans font-normal">(184 reviews)</span></span>
          <span className="px-1.5 py-0.5 bg-[#9C7346]/10 text-[#9C7346] rounded uppercase text-[6.5px] tracking-wider font-extrabold">
            Popular
          </span>
        </div>
      </div>

      {/* 5. Floating Parallax Coffee Beans with realistic shadows & movement */}
      {!prefersReducedMotion && (
        <>
          {/* Bean Left (Deep, Close focus) */}
          <div 
            className="absolute left-4 sm:left-12 top-10 sm:top-20 transition-all duration-[700ms] pointer-events-none drop-shadow-md z-20"
            style={{
              transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px) rotate(${12 + mousePos.x * 20}deg) scale(0.95)`
            }}
          >
            <div className="text-2xl filter saturate-[0.8] select-none">🫘</div>
          </div>

          {/* Bean Bottom Left */}
          <div 
            className="absolute left-[20%] bottom-8 sm:bottom-16 transition-all duration-[850ms] pointer-events-none drop-shadow-md z-20"
            style={{
              transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px) rotate(${-30 + mousePos.y * 30}deg) scale(0.75)`
            }}
          >
            <div className="text-xl filter sepia-[0.35] select-none">🫘</div>
          </div>

          {/* Bean Top Right */}
          <div 
            className="absolute right-[25%] top-6 sm:top-14 transition-all duration-[600ms] pointer-events-none drop-shadow-md z-20"
            style={{
              transform: `translate(${mousePos.x * -35}px, ${mousePos.y * -35}px) rotate(${45 + mousePos.x * 45}deg) scale(0.85)`
            }}
          >
            <div className="text-xl filter opacity-90 select-none">🫘</div>
          </div>
        </>
      )}
    </div>
  );
}
