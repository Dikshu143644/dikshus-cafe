import React from 'react';
import { ChefHat, Compass, Heart, Award } from 'lucide-react';

export default function AboutView() {
  return (
    <div id="about-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      
      {/* Title Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-16">
        <span className="text-[10px] tracking-widest text-cafe-bronze uppercase font-bold font-mono">
          / CHRONICLES &amp; HERITAGE
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-cafe-charcoal font-bold tracking-tight uppercase">
          Our Journey &amp; Legacy
        </h1>
        <p className="text-xs sm:text-base text-cafe-charcoal/70 max-w-2xl mx-auto leading-relaxed">
          From a tiny single-roaster brick room to a glasshouse sanctuary of unhurried brewing. Meet the people, values, and slow-roasted science behind Cafe Vista.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 select-none">
        <div className="relative rounded-2xl overflow-hidden h-[32vh] min-h-[220px] max-h-[420px] shadow-2xl border border-[#deb887]/20">
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop"
            alt="Warm coffee house brewing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cafe-charcoal/80 to-transparent p-8 flex items-center justify-between">
            <span className="font-serif text-lg text-white font-semibold">Established 2022</span>
            <span className="font-mono text-xs text-cafe-gold">London, United Kingdom</span>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-4xl text-cafe-smoky font-bold uppercase tracking-tight">
            Our Central Guiding Pillars
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <ChefHat className="w-5 h-5 text-cafe-gold" />,
              title: "Artisanal Integrity",
              desc: "French laminations and double-shot extractions are hand-crafted daily. No shortcuts, no automated compromises."
            },
            {
              icon: <Compass className="w-5 h-5 text-cafe-gold" />,
              title: "Estates Sourcing",
              desc: "We exclusively purchase washed estates crops, establishing direct lines of premium trade with local family owners."
            },
            {
              icon: <Heart className="w-5 h-5 text-cafe-gold" />,
              title: "Empathetic Hospitality",
              desc: "We greet our guests with warmth and zero rush. Cafe Vista remains a calm harbor for long chats and unhurried thoughts."
            },
            {
              icon: <Award className="w-5 h-5 text-cafe-gold" />,
              title: "Aesthetic Rhythm",
              desc: "A meticulously curated environment of frosted glass curves, warm neutral palettes, and lush potted monsteras."
            }
          ].map((val, idx) => (
            <div key={idx} className="bg-white/45 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-cafe-smoky/5 flex items-center justify-center mb-4 border border-cafe-smoky/10">
                {val.icon}
              </div>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cafe-charcoal">{val.title}</h3>
              <p className="text-xs text-cafe-charcoal/70 leading-relaxed mt-2">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* timeline process section */}
      <div className="bg-cafe-smoky py-20 text-cafe-cream border-y border-white/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] text-cafe-gold uppercase tracking-widest font-mono">
              / THE HISTORIC LINE
            </span>
            <h2 className="font-serif text-3xl text-white font-bold uppercase">
              Our Milestones
            </h2>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-1/2 before:w-[1px] before:bg-white/10">
            
            {[
              {
                year: "2022",
                title: "Spark in London East",
                desc: "Our founder, a French-certified pastry maker, starts roasting limited lots of single-origin beans in an unheated garage, selling hot flat whites directly to passing neighbors."
              },
              {
                year: "2023",
                title: "The Glasshouse Genesis",
                desc: "We acquire an abandoned botanical glass sanctuary. Working with top acoustic and lighting designers, we rebuild it into our flagship glassmorphism café."
              },
              {
                year: "2024",
                title: "Loyalty Integration",
                desc: "We roll out direct-rewards reservations, and an interactive AI concierge chat model to answer guest questions instantly."
              },
              {
                year: "2026",
                title: "Looking To Tomorrow",
                desc: "With over 40 exclusive farms under trade pacts, we continue refining local food chains, holding workshops about slow-washed drip sciences."
              }
            ].map((item, index) => (
              <div key={index} className={`relative flex flex-col sm:flex-row ${index % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'}`}>
                {/* timeline circle point */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-[4.5px] w-2.5 h-2.5 rounded-full bg-cafe-gold border border-cafe-charcoal z-20"></div>

                <div className={`pl-10 sm:pl-0 sm:w-[45%] ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'}`}>
                  <span className="font-serif text-lg font-bold text-cafe-gold font-mono block mb-1">
                    {item.year}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-cafe-cream/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

    </div>
  );
}
