import React from 'react';
import CafeTableScene from './CafeTableScene';
import ScrollReveal from '../ScrollReveal';
import { BookOpen, Coffee, Award, ShieldCheck } from 'lucide-react';

export default function CafeExperience3D() {
  return (
    <section className="py-20 sm:py-28 bg-[#FCFAF7]/40 border-t border-cafe-charcoal/5 relative overflow-hidden">
      {/* Ambient glass blur glow */}
      <div className="absolute top-1/2 left-[-10%] w-[450px] h-[450px] bg-[#EEDCC6]/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14 md:mb-20">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] text-[#9C7346] font-extrabold uppercase font-mono block">
            / BRAND ARCHITECTURE SHOWCASE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-cafe-charcoal uppercase tracking-tight max-w-2xl mx-auto leading-tight">
            Our Interactive Glasshouse Table
          </h2>
          <p className="text-xs sm:text-base text-cafe-charcoal/60 max-w-xl mx-auto leading-relaxed">
            Inspect and explore the meticulous craftsmanship we place into every morning plate, leather-bound volume, and double-ristretto pull.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column - Concept Details */}
          <div className="col-span-12 lg:col-span-12 xl:col-span-5 space-y-8 text-left">
            <ScrollReveal direction="left" className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cafe-charcoal">
                  The Slow-Brewed Morning Setup
                </h3>
                <p className="text-xs sm:text-sm text-cafe-charcoal/75 leading-relaxed font-sans">
                  Crafting a truly unhurried experience requires intentional visual and sensory elements. On every window bistro table, you find selected literature and baked treats designed to pair uniquely with our estate coffee selections.
                </p>
              </div>

              {/* Bento styled feature list */}
              <div className="space-y-4">
                {[
                  {
                    icon: <Coffee className="w-4 h-4 text-white" />,
                    title: "Single-Estate Ceramics",
                    desc: "Hand-thrown ivory porcelain mugs that retain optimal thermal warmth for slow double-shot sips."
                  },
                  {
                    icon: <BookOpen className="w-4 h-4 text-white" />,
                    title: "Curated Philosophy Binders",
                    desc: "Sourced leather volumes on vintage art, nature, and classic literature to disconnect your brain from screen noise."
                  },
                  {
                    icon: <Award className="w-4 h-4 text-white" />,
                    title: "Glazed Sugared Pastries",
                    desc: "Double-laminated butter dough croissants and vanilla-icing cinnamon rollsbaked with strict French rigor."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/45 border border-white/40 hover:bg-white/70 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-[#9C7346] flex items-center justify-center shrink-0 shadow-sm">
                      {item.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-cafe-charcoal uppercase tracking-wide">{item.title}</h4>
                      <p className="text-[11px] text-cafe-charcoal/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#9C7346]/10 border border-[#9C7346]/20 flex items-start gap-3">
                <ShieldCheck className="w-4.5 h-4.5 text-[#9C7346] shrink-0 mt-0.5" />
                <span className="text-[10px] text-[#9C7346] uppercase font-mono font-bold tracking-wider leading-relaxed">
                  Interactive 2.5D Showcase • Discover morning treats and single-estate extraction brews smoothly.
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - 3D Showcase */}
          <div className="col-span-12 lg:col-span-12 xl:col-span-7 h-[450px] sm:h-[550px] relative w-full flex items-center justify-center">
            <ScrollReveal direction="right" className="w-full h-full p-4 rounded-3xl bg-gradient-to-br from-white/30 to-[#FEFAF4]/10 border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              {/* Corner accent vectors to feel like high-end blueprint */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#9C7346]/20"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#9C7346]/20"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#9C7346]/20"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#9C7346]/20"></div>

              {/* Live Canvas */}
              <div className="w-full h-full relative z-10">
                <CafeTableScene />
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
