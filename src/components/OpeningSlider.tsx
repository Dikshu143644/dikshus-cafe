import React, { useEffect, useState } from 'react';

export function CafeVistaLogo({ className = "w-12 h-12", gold = false }: { className?: string, gold?: boolean }) {
  const primaryColor = gold ? "#C5A880" : "#82715F";
  const secondaryColor = gold ? "#D4AF37" : "#3A2F25";
  const cupOutline = gold ? "#BFA15C" : "#4A3C31";
  const cupFill = gold ? "rgba(255, 255, 255, 0.15)" : "#FCFAF7";
  const cupRim = gold ? "rgba(212, 175, 55, 0.2)" : "#EFECE6";

  return (
    <svg className={className} viewBox="15 -10 90 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crescent outer sweeping curl frame (logo body) */}
      <path 
        d="M 52 28 C 34 28, 20 44, 20 64 C 20 84, 38 94, 56 94 C 72 94, 85 83, 89 67 C 91 58, 89 51, 84 49 C 79 47, 75 51, 74 56 C 72 69, 62 78, 51 78 C 38 78, 28 68, 28 55 C 28 42, 39 31, 52 31 C 58 31, 64 33, 68 36 C 71 38, 75 35, 73 31 C 69 25, 61 28, 52 28 Z" 
        fill={primaryColor} 
      />

      {/* Elegant White Coffee Cup Layer */}
      <path 
        d="M 46 44 C 46 44, 48 66, 68 66 C 88 66, 90 44, 90 44 Z" 
        fill={cupFill} 
        stroke={cupOutline} 
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Cup base footing */}
      <path
        d="M 55 65 L 81 65"
        stroke={cupOutline}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Cup Rim top lip */}
      <ellipse cx="68" cy="44" rx="22" ry="4" fill={cupRim} stroke={cupOutline} strokeWidth="2" />
      
      {/* Cup handle on the right */}
      <path 
        d="M 87 47 C 95 47, 98 57, 88 61" 
        fill="none" 
        stroke={cupOutline} 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />

      {/* Elegant Steam/Smoke rising on top */}
      <path 
        d="M60 21 C58 17, 62 13, 60 7 C58 3, 61 0, 59 -3" 
        stroke={primaryColor} 
        strokeWidth="2" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Monogram "D" */}
      <text 
        x="36" 
        y="68" 
        fontFamily="'Playfair Display', Georgia, serif" 
        fontSize="26" 
        fontWeight="800" 
        fill={primaryColor}
        style={{ letterSpacing: "-0.05em", userSelect: "none" }}
      >
        D
      </text>

      {/* Monogram "S" with extra contrast */}
      <text 
        x="63" 
        y="72" 
        fontFamily="'Playfair Display', Georgia, serif" 
        fontSize="26" 
        fontWeight="800" 
        fill={secondaryColor}
        style={{ letterSpacing: "-0.05em", userSelect: "none" }}
      >
        S
      </text>
    </svg>
  );
}

export default function OpeningSlider() {
  const [stage, setStage] = useState<'intro' | 'parting' | 'hidden'>('intro');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Smooth loading progression that builds up anticipation
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Small, premium, realistic steps
        const step = Math.floor(Math.random() * 10) + 8;
        return Math.min(100, prev + step);
      });
    }, 140);

    // Part sliding glass doors after complete load matching premium aesthetic
    const partingTimeout = setTimeout(() => {
      setStage('parting');
    }, 1900);

    // Completely unmount loader to reveal main site after transitions finish
    const hideTimeout = setTimeout(() => {
      setStage('hidden');
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(partingTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (stage === 'hidden') return null;

  return (
    <div id="opening-glasshouse-slider" className="fixed inset-0 z-[9999] overflow-hidden select-none">
      
      {/* Warm Sunlit conservatory background panorama */}
      <div 
        className="absolute inset-0 bg-[#EFECE6] transition-all duration-[1400ms] ease-in-out pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(254, 243, 199, 0.4) 0%, rgba(239, 236, 230, 0.8) 70%),
            url('https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1600&auto=format&fit=crop')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: stage === 'parting' ? 'scale(1.05) blur(10px) opacity(0)' : 'blur(4px) opacity(1)',
          transform: stage === 'parting' ? 'scale(1.03)' : 'scale(1)',
        }}
      />

      {/* Gentle overlay light leak flare across background */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/10 to-transparent pointer-events-none mix-blend-screen transition-opacity duration-1000 ${stage === 'parting' ? 'opacity-0' : 'opacity-100'}`}></div>

      {/* ================= LEFT SLIDING GLASS PANEL ================= */}
      <div 
        className={`absolute inset-y-0 left-0 w-1/2 transition-all duration-[1400ms] pointer-events-auto flex justify-end items-center border-r border-[#edd6bc]/30 ${
          stage === 'parting' ? '-translate-x-[110%] opacity-0' : 'translate-x-0 opacity-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 245, 240, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'inset -20px 0 60px -10px rgba(253, 230, 138, 0.1)',
          transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
        }}
      >
        {/* Soft internal edge highlight glow */}
        <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-amber-300/40 to-transparent"></div>

        {/* Elegant etched plant branch on left glass panel */}
        <div className="absolute left-[8%] top-[20%] w-[35%] h-[60%] opacity-25 pointer-events-none">
          <svg className="w-full h-full text-[#5E513D]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 200 C30 150 40 90 20 10" strokeDasharray="1 2" />
            <path d="M22 130 C35 120 45 110 55 115" />
            <path d="M55 115 Q45 105 32 120 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M25 90 C38 80 50 75 62 82" />
            <path d="M62 82 Q50 72 35 85 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M18 55 C28 45 42 42 50 50" />
            <path d="M50 50 Q38 40 26 51 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M20 150 C5 140 -5 130 5 125" />
            <path d="M5 125 Q-5 135 10 145 Z" fill="currentColor" fillOpacity="0.1" />
          </svg>
        </div>

        {/* Glass Sliding Panel circular handle - Left Half */}
        <div className="mr-[-24px] w-12 h-12 rounded-l-full border-y border-l border-[#dfcaaf]/40 shadow-lg z-30 select-none bg-white/60 backdrop-blur-md cursor-pointer flex items-center justify-end overflow-hidden group hover:border-amber-400/60 transition-colors">
          <div className="w-12 h-12 relative flex-shrink-0">
            <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center">
              <CafeVistaLogo className="w-9 h-9 opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SLIDING GLASS PANEL ================= */}
      <div 
        className={`absolute inset-y-0 right-0 w-1/2 transition-all duration-[1400ms] pointer-events-auto flex justify-start items-center border-l border-[#edd6bc]/30 ${
          stage === 'parting' ? 'translate-x-[110%] opacity-0' : 'translate-x-0 opacity-100'
        }`}
        style={{
          background: 'linear-gradient(-135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 245, 240, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'inset 20px 0 60px -10px rgba(253, 230, 138, 0.1)',
          transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
        }}
      >
        {/* Soft internal edge highlight glow */}
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-amber-300/40 to-transparent"></div>

        {/* Elegant etched plant branch on right glass panel */}
        <div className="absolute right-[8%] top-[20%] w-[35%] h-[60%] opacity-25 pointer-events-none">
          <svg className="w-full h-full text-[#5E513D] transform scale-x-[-1]" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 200 C30 150 40 90 20 10" strokeDasharray="1 2" />
            <path d="M22 130 C35 120 45 110 55 115" />
            <path d="M55 115 Q45 105 32 120 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M25 90 C38 80 50 75 62 82" />
            <path d="M62 82 Q50 72 35 85 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M18 55 C28 45 42 42 50 50" />
            <path d="M50 50 Q38 40 26 51 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M20 150 C5 140 -5 130 5 125" />
            <path d="M5 125 Q-5 135 10 145 Z" fill="currentColor" fillOpacity="0.1" />
          </svg>
        </div>

        {/* Glass Sliding Panel circular handle - Right Half */}
        <div className="ml-[-24px] w-12 h-12 rounded-r-full border-y border-r border-[#dfcaaf]/40 shadow-lg z-30 select-none bg-white/60 backdrop-blur-md cursor-pointer flex items-center justify-start overflow-hidden group hover:border-amber-400/60 transition-colors">
          <div className="w-12 h-12 relative flex-shrink-0">
            <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center">
              <CafeVistaLogo className="w-9 h-9 opacity-90" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= GREETING LAYOUT (STAMP, TILES & TIMER) ================= */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1000ms] ${
          stage === 'parting' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)'
        }}
      >
        <div className="text-center space-y-7 z-20 max-w-sm px-6 flex flex-col items-center">
          
          {/* ================= HIGH-GLOSS GOLD ARCHED BRAND BADGE ================= */}
          <div className="relative animate-badgeBounce mb-1">
            {/* Soft Ambient Gold Back-Glow */}
            <div className="absolute inset-0 bg-amber-400/10 rounded-t-full filter blur-xl animate-pulse"></div>

            {/* Glowing sparkle glints */}
            <div className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 animate-spin [animation-duration:8s]">
              <svg className="w-full h-full text-amber-400/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v20M2 12h20M12 2l4 4-4-4-4 4 4-4z" />
              </svg>
            </div>

            {/* The Elegant Double Glasshouse Arch Frame */}
            <div 
              className="w-24 h-32 rounded-t-full border-[2.5px] border-[#D4AF37]/80 flex items-center justify-center p-[4.5px] relative"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(240, 235, 225, 0.25) 100%)',
                boxShadow: '0 12px 30px -8px rgba(94, 81, 61, 0.15), inset 0 2px 8px rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Inner high-gloss accent gold thin line */}
              <div className="absolute inset-[3px] rounded-t-full border border-[#EAC352]/40 pointer-events-none"></div>

              {/* Specular ribbon sweep sheen effect */}
              <div className="absolute inset-0 rounded-t-full overflow-hidden bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-y-full animate-sheenSweep"></div>

              {/* Gold brand logo icon (central focus) */}
              <div className="w-16 h-16 flex items-center justify-center relative">
              <CafeVistaLogo className="w-full h-full opacity-90 drop-shadow-[0_1px_2px_rgba(94,81,61,0.1)]" gold={true} />
              </div>
            </div>
          </div>

          {/* ================= TYPOGRAPHIC LUXURY GREETING ================= */}
          <div className="space-y-3.5">
            <h1 
              className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3a3229] tracking-[0.14em] leading-none drop-shadow-sm uppercase"
              style={{
                fontFamily: `'Playfair Display', Georgia, serif`,
                textRendering: 'optimizeLegibility',
              }}
            >
              DIKSHU'S CAFE
            </h1>
            
            <p className="font-serif italic text-sm text-[#82715F] tracking-wide font-normal max-w-xs animate-fadeInUp">
              London's Glasshouse Sanctuary
            </p>

            {/* Delicate visual divider flower symbol */}
            <div className="flex items-center justify-center gap-4 text-[#C4A484]/40 text-[9px] tracking-[0.25em] font-mono uppercase">
              <span className="h-[1px] w-6 bg-[#C4A484]/35"></span>
              <svg className="w-3.5 h-3.5 text-[#BBA382]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
                <path d="M12 2 C13 7 11 7 12 2 Z" />
                <path d="M12 22 C13 17 11 17 12 22 Z" />
                <path d="M2 12 C7 13 7 11 2 12 Z" />
                <path d="M22 12 C17 13 17 11 22 12 Z" />
              </svg>
              <span className="h-[1px] w-6 bg-[#C4A484]/35"></span>
            </div>

            <p className="text-[10px] tracking-[0.2em] font-mono uppercase text-[#9B8C7E]">
              Established MMXVI • London
            </p>
          </div>

          {/* ================= SLEEK HIGH-CONTRAST CHROME LOADER ================= */}
          <div className="w-56 space-y-2 mt-4 font-mono">
            <div className="w-full h-[5px] bg-[#dfd9ce]/60 rounded-full relative overflow-hidden border border-white/50 p-[1px] shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out flex items-center justify-end"
                style={{ 
                  width: `${loadingProgress}%`,
                  background: 'linear-gradient(90deg, #CEB795  0%, #9C825D 100%)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_5px_#FFE082] shrink-0 animate-ping"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-[#7E7063]">
              <span>Sourcing Sanctuary</span>
              <span className="font-bold">{loadingProgress}%</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes badgeBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes sheenSweep {
          0% { transform: translateY(110%) rotate(15deg); }
          45%, 100% { transform: translateY(-110%) rotate(15deg); }
        }
        .animate-badgeBounce { animation: badgeBounce 5s ease-in-out infinite; }
        .animate-sheenSweep { animation: sheenSweep 4.5s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUpProgress 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUpProgress {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
