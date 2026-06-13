import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Coffee, Award } from 'lucide-react';

export default function CafeTableScene() {
  const prefersReducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const layers = [
    {
      id: "coffee",
      icon: <Coffee className="w-3.5 h-3.5" />,
      title: "Double Ristretto Cup",
      desc: "Rich espresso extractions in pre-warmed single-estate ceramic porcelain.",
      pos: "top-[22%] left-[28%]"
    },
    {
      id: "book",
      icon: <BookOpen className="w-3.5 h-3.5" />,
      title: "Philosophy & Vintage Binds",
      desc: "Curated paper volumes to unplug and quiet digital noise while drinking.",
      pos: "bottom-[28%] left-[24%]"
    },
    {
      id: "croissant",
      icon: <Award className="w-3.5 h-3.5" />,
      title: "French Pastry Plate",
      desc: "Slow-baked slow-fermented sugared cinnamon rolls and double-laminated butter croissants.",
      pos: "bottom-[24%] right-[22%]"
    }
  ];

  return (
    <div 
      className="w-full h-full min-h-[380px] lg:min-h-[480px] relative flex items-center justify-center overflow-hidden rounded-2xl p-4 sm:p-6 select-none cursor-grab group bg-gradient-to-b from-[#FAF8F5] to-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* 1. Cozy Glasshouse background glow */}
      <div 
        className="absolute w-[300px] h-[300px] bg-[#deb887]/15 rounded-full blur-[70px] -z-10 transition-transform duration-700 ease-out pointer-events-none"
        style={{
          transform: prefersReducedMotion ? 'none' : `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
        }}
      />

      {/* 2. Concentric blueprint guidelines for professional luxury architectural look */}
      <div className="absolute inset-0 border border-stone-100 rounded-2xl pointer-events-none flex items-center justify-center m-3">
        <div className="w-[85%] h-[85%] border border-[#9C7346]/5 rounded-xl border-dashed" />
      </div>

      {/* 3. Main Composition with Interactive Parallax */}
      <div 
        className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 ease-out border border-white/40"
        style={{
          transform: prefersReducedMotion 
            ? 'none' 
            : `translate(${mousePos.x * 28}px, ${mousePos.y * 28}px) scale(0.98)`
        }}
      >
        {/* High quality cozy espresso table setup image */}
        <img 
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop"
          alt="Slow morning setup of espresso cup and pastry"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
          referrerPolicy="no-referrer"
        />

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

        {/* Overlay Interactive Dots (Hotspots) */}
        {layers.map((layer) => (
          <div 
            key={layer.id} 
            className={`absolute ${layer.pos} z-20`}
          >
            <button
              onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#9C7346] hover:bg-[#9C7346] hover:text-white transition-all shadow-lg border border-[#deb887]/20 cursor-pointer animate-pulse"
              style={{ animationDuration: '3s' }}
            >
              {layer.icon}
              
              {/* Outer wave ring */}
              <span className="absolute inset-0 rounded-full border border-white opacity-40 scale-125 animate-ping" />
            </button>

            {/* Dynamic Card appearing adjacent to Hotspur */}
            {activeLayer === layer.id && (
              <div 
                className="absolute z-30 bottom-10 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#1C1814]/95 text-white shadow-2xl border border-white/10 text-left animate-fadeIn scale-95"
                style={{ contentVisibility: 'auto' }}
              >
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#deb887] font-mono mb-1">
                  {layer.title}
                </h4>
                <p className="text-[9px] text-[#FEFAF4]/80 leading-relaxed font-semibold">
                  {layer.desc}
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#1C1814]/95 rotate-45 border-r border-b border-white/10" />
              </div>
            )}
          </div>
        ))}

        {/* Small floating prompt at the bottom right */}
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md text-[8px] sm:text-[9px] text-white/90 px-2 py-1 rounded font-mono uppercase font-bold select-none tracking-widest uppercase pointer-events-none">
          Click elements to inspect
        </div>
      </div>

      {/* Static sidebar indicator when active layer info is visible */}
      {activeLayer && (
        <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-[#9C7346]/20 shadow-lg text-left hidden sm:block animate-fadeIn">
          {layers.filter(l => l.id === activeLayer).map(l => (
            <div key={l.id} className="space-y-0.5">
              <span className="text-[8px] font-extrabold text-[#9C7346] uppercase font-mono block">
                Highlighted Core Feature • {l.title}
              </span>
              <p className="text-[11px] text-[#2C2621] font-semibold">{l.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
