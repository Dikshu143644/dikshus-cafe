import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Coffee, ChevronRight, Check, Star } from 'lucide-react';
import { MenuItem } from '../types';
import ScrollReveal from './ScrollReveal';
import SanctuaryCustomizer from './SanctuaryCustomizer';
import CoffeeCupScene from './3d/CoffeeCupScene';
import CafeExperience3D from './3d/CafeExperience3D';
import ScrollSequence from './ScrollSequence';

interface HomeViewProps {
  onNavigate: (page: string) => void;
  featuredItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function HomeView({ onNavigate, featuredItems, onAddToCart }: HomeViewProps) {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return (
    <div id="home-view" className="font-sans antialiased bg-transparent relative">
      {/* Cinematic scroll-driven footage: fixed backdrop for the whole page */}
      <ScrollSequence
        frameCount={149}
        pathFor={(i) => `/hero-frames/frame-${String(i).padStart(3, "0")}.jpg`}
      />
      <div className="relative z-10">
      
      {/* ================= HERO SECTION ================= */}
      <section
        id="hero-banner"
        className="relative min-h-screen flex items-center justify-center px-3 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-transparent"
      >
{/* Ambient Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EEDCC6]/55 rounded-full blur-[110px] pointer-events-none opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#D4C3B0]/45 rounded-full blur-[130px] pointer-events-none opacity-40"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Hero Left (Col-span-5) - Premium Copywriting CTA & Readability */}
            <div 
              className="col-span-12 lg:col-span-5 flex flex-col justify-center gap-5 sm:gap-6 text-left transform will-change-transform"
              style={{
                transform: prefersReducedMotion ? 'none' : `translateY(${-scrollY * 0.12}px)`,
                opacity: prefersReducedMotion 
                  ? 1 
                  : (scrollY > 300 ? Math.max(0, 1 - (scrollY - 300) / 400) : 1)
              }}
            >
              <div className="space-y-4">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-extrabold text-[#9C7346] block font-mono">
                  Experience the Perfect Brew
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.1] font-light text-[#1D1915] tracking-tight">
                  Sip Artisan Comfort, <br />
                  <span className="font-extrabold italic text-[#9C7346]">Crafted Fresh Daily.</span>
                </h1>
              </div>
              
              <p className="text-[#2C2621] text-sm sm:text-base md:text-lg leading-relaxed max-w-md font-medium">
                Welcome to Cafe Vista. A human-crafted glasshouse sanctuary of specialty single-origin roasts, unhurried hospitality, and slow-baked artisan French croissants.
              </p>
              
              <div className="flex flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2">
                <button
                  onClick={() => onNavigate('menu')}
                  className="h-12 sm:h-14 px-6 sm:px-8 bg-[#1C1814] text-white hover:bg-[#9C7346] rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.03] transition-all cursor-pointer text-xs sm:text-sm"
                >
                  Order Online
                  <svg className="w-4 h-4 text-[#C4A484]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onNavigate('booking')}
                  className="h-12 sm:h-14 px-5 sm:px-7 border-2 border-[#1C1814] text-[#1C1814] hover:bg-[#1C1814] hover:text-[#FEFAF4] rounded-xl font-extrabold flex items-center justify-center transition-all cursor-pointer text-xs sm:text-sm"
                >
                  Reserve Table
                </button>
              </div>

              {/* Loved by Overlapping User Avatars Badge */}
              <div className="flex items-center gap-3 pt-4">
                <div className="flex -space-x-3 select-none shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#FDFBF7] bg-stone-300 overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#FDFBF7] bg-stone-400 overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#FDFBF7] bg-stone-500 overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#FDFBF7] bg-[#C4A484] text-[9px] sm:text-[10px] text-white font-extrabold shadow-sm">
                    +2k
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs">
                  <span className="font-extrabold block text-[#1C1814] uppercase text-[9px] sm:text-[10px] tracking-wider leading-tight">Loved by 2,000+ patrons</span>
                  <span className="text-[#3B332D] font-semibold text-[9px] sm:text-[11px]">Across our glasshouse sanctuary branches</span>
                </div>
              </div>
            </div>

            {/* Premium 3D Interactive Right Side Column (Col-span-7) */}
            <div 
              className="col-span-12 lg:col-span-7 relative h-[450px] lg:h-[600px] w-full transform will-change-transform"
              style={{
                transform: prefersReducedMotion ? 'none' : `translateY(${-scrollY * 0.04}px) scale(${1 - Math.min(0.08, scrollY * 0.0001)})`,
                opacity: prefersReducedMotion ? 1 : (scrollY > 350 ? Math.max(0, 1 - (scrollY - 350) / 350) : 1)
              }}
            >
              {/* Floating review count tag */}
              <div className="absolute top-0 right-4 w-36 h-36 rounded-full border border-cafe-charcoal/10 hidden xl:flex flex-col items-center justify-center space-y-0.5 opacity-80 scale-90 bg-white/30 backdrop-blur-md z-20">
                <span className="text-3xl font-serif font-light text-cafe-charcoal">4.9</span>
                <div className="flex gap-0.5 text-cafe-gold text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#1C1814]/80">Trustpilot</span>
              </div>

              {/* R3F Canvas Container */}
              <div className="w-full h-full relative z-10">
                <CoffeeCupScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK TRAITS BANNER ================= */}
      <section className="bg-transparent border-y border-[#deb887]/25 py-8 sm:py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <ScrollReveal direction="up" delay={50} className="w-full">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-[#1C1814]/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#A88665]/10 flex items-center justify-center text-[#A88665] border border-[#A88665]/20 shrink-0">
                  <Coffee className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-extrabold text-[#1C1814] uppercase tracking-wider">Premium Extraction</h3>
                  <p className="text-xs sm:text-sm text-[#2C2621] font-medium leading-relaxed mt-1.5">Slow-drips and espressos pulled strictly from 100% Arabica washed estate specialty beans.</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={120} className="w-full">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-[#1C1814]/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#A88665]/10 flex items-center justify-center text-[#A88665] border border-[#A88665]/20 shrink-0">
                  <Sparkles className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-extrabold text-[#1C1814] uppercase tracking-wider">Glass Oasis Design</h3>
                  <p className="text-xs sm:text-sm text-[#2C2621] font-medium leading-relaxed mt-1.5">Sip peacefully under modern, open-space glass structures nestled with lush green foliage.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200} className="w-full">
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-[#1C1814]/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#A88665]/10 flex items-center justify-center text-[#A88665] border border-[#A88665]/20 shrink-0">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-extrabold text-[#1C1814] uppercase tracking-wider">Rewards Integrated</h3>
                  <p className="text-xs sm:text-sm text-[#2C2621] font-medium leading-relaxed mt-1.5">Earn 50 loyalty points per table booking and automatic multipliers on secure checkouts.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE ATMOSPHERE SYNTHESIZER ================= */}
      <section className="bg-transparent py-12 sm:py-16 border-b border-[#deb887]/25 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={50}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-4 text-left">
                <span className="text-[10px] uppercase font-extrabold text-[#9C7346] tracking-widest font-mono block">
                  / LUXURY AMBIENT INTERACTIVITY
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#1D1915] font-extrabold uppercase tracking-tight leading-tight">
                  Design Your <br />
                  <span className="italic font-light">Sanctuary Vibe</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-[#2C2621] font-medium leading-relaxed max-w-md">
                  Crafting a beautiful physical visit requires attention to sensory precision. Utilize our organic scent-to-sound synthesizer to experience the dynamic moisture levels, coffee steam thickness, and peaceful breeze melodies that exist inside our glasshouse domes in real-time. Unmute to listen to the live-generated synthesized sanctuary hum!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('booking')}
                    className="h-12 px-6 bg-[#1C1814] hover:bg-[#A88665] text-white hover:text-[#1C1814] text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <span>Pre-Book Your Table Seat</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              <div>
                <SanctuaryCustomizer />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= BRAND STORY TEASER ================= */}
      <section id="about-teaser" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
          
          <ScrollReveal direction="left" delay={50} className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 select-none">
              <img
                src="https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop"
                alt="Café interior"
                className="w-full h-[320px] sm:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1814]/50 to-transparent"></div>
            </div>
            {/* Overlay statistics sticker */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 glass-dark p-4 sm:p-6 rounded-2xl border border-white/15 shadow-2xl max-w-[150px] sm:max-w-[190px]">
              <span className="text-3xl sm:text-4xl font-serif text-[#C4A484] font-extrabold block">100%</span>
              <span className="text-[9px] sm:text-[10px] text-white/90 uppercase tracking-widest font-mono mt-1 block leading-relaxed font-bold">
                Organic washed specialty estates
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150} className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <span className="text-[10px] tracking-widest text-[#9C7346] uppercase font-extrabold block font-mono">
              / ARTISANAL PATH
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1D1915] leading-tight">
              Crafting Safe Refuges for the Slow-Washed Generation
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#2C2621] font-medium leading-relaxed font-sans">
              Founded in 2022 on a simple belief: the world moves too quickly, but coffee should never be rushed. At Cafe Vista, we pair classic French lamination methods with meticulously measured double-shot espresso extractions. 
            </p>
            <p className="text-xs sm:text-sm md:text-base text-[#2C2621] font-medium leading-relaxed font-sans">
              Under our soaring glasshouse architectures, we invite you to disconnect from digital clutter, watch the natural daylight shift across raw concrete wood tables, and experience authentic human craftsmanship in progress.
            </p>
            
            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center space-x-1.5 px-6 py-3 border-2 border-[#A88665] text-[#A88665] hover:bg-[#A88665] hover:text-[#FEFAF4] text-xs font-extrabold uppercase tracking-wider rounded-full transition-all duration-300"
              >
                <span>Read Our Journey</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ================= 3D INTERACTIVE TABLE EXPERIENCE SHOWCASE ================= */}
      <CafeExperience3D />

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-[#241C16] text-[#FEFAF4] py-16 sm:py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
          <div className="text-center space-y-3 mb-12 sm:mb-16">
            <span className="text-[10px] text-[#C4A484] uppercase tracking-widest font-mono font-extrabold">
              / COMMUNITY PRAISE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-extrabold tracking-tight uppercase">
              Heard in our Glass Parlours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                text: "The Velvet Lavender Honey Latte is sheer sensory magic. Watching the steam drift up toward the glass ceiling of the cafe makes this my favorite morning ritual.",
                author: "Aurelia Sterling",
                role: "Brand Director"
              },
              {
                text: "Cafe Vista is an architectural masterclass! The 3D folding pastry options are out of this world, and my table booking is synced with Google Calendar instantly. Exceptional service.",
                author: "Marcus Vance",
                role: "Editorial Architect"
              },
              {
                text: "Their smart AI assistant answered every dietary question about the truffle mushrooms precisely. The order was ready for dynamic pickup. I'm a customer forever.",
                author: "Dr. Elena Rostova",
                role: "Senior Biologist"
              }
            ].map((test, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 150} className="h-full">
                <div className="glass-dark p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between h-full hover:border-[#C4A484]/50 hover:scale-[1.02] transition-all duration-300 text-left">
                  <div>
                    <div className="flex items-center space-x-1 mb-4 text-[#C4A484]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 font-semibold italic leading-relaxed font-serif">
                      "{test.text}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{test.author}</span>
                    <span className="text-[10px] text-[#C4A484] font-mono font-extrabold uppercase tracking-widest">{test.role}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ORDER PROMO BANNER ================= */}
      <section className="py-16 sm:py-20 bg-transparent relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-[#161210] uppercase">
            Sip on Premium Comfort Today
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#2C2621] font-semibold max-w-xl mx-auto leading-relaxed">
            Order ahead for a quick pickup, collect reward points on your digital loyalty card, and secure your afternoon window seating in seconds.
          </p>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 pt-3">
            <button
               onClick={() => onNavigate('menu')}
               className="h-12 px-6 sm:px-8 bg-[#1C1814] text-[#FEFAF4] hover:bg-[#A88665] hover:text-[#1C1814] text-xs font-extrabold uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl"
            >
              Order Online
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className="h-12 px-5 sm:px-8 bg-[#FEFAF4] hover:bg-stone-100 text-[#1C1814] border border-[#1C1814]/15 text-xs font-extrabold uppercase tracking-widest rounded-full transition-all duration-300"
            >
              Reserve Table
            </button>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
}
