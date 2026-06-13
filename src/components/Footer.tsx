import React from 'react';
import { Coffee, MapPin, Phone, Mail, ChevronUp, Star } from 'lucide-react';
import { CafeVistaLogo } from './OpeningSlider';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-cafe-charcoal text-cafe-cream/80 pt-16 pb-8 border-t border-white/5 relative overflow-hidden">
      
      {/* Coffee steam ambient glow background effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-cafe-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { onNavigate('home'); window.scrollTo(0,0); }}>
              <div className="w-8 h-8 rounded-full bg-cafe-gold/20 flex items-center justify-center border border-cafe-gold/30 overflow-hidden">
                <CafeVistaLogo className="w-7 h-7 text-cafe-gold" gold={true} />
              </div>
              <span className="font-serif text-lg font-semibold tracking-wider text-cafe-cream uppercase font-sans tracking-tight">
                Cafe Vista
              </span>
            </div>
            <p className="text-xs text-cafe-cream/60 leading-relaxed font-sans mt-2">
              Where every single brew tells a human story. Celebrating the beauty of raw materials, slow-drip extraction, and warm, unhurried hospitality in our cozy glass sanctuary.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              {['instagram', 'twitter', 'facebook', 'pinterest'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-cafe-gold/20 flex items-center justify-center border border-white/5 hover:border-cafe-gold/30 text-cafe-cream hover:text-cafe-gold transition-all duration-300 text-xs uppercase font-mono tracking-tighter"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-4 pb-2 border-b border-white/5">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => { onNavigate('menu'); scrollToTop(); }} className="hover:text-cafe-gold transition-colors">
                  Browse Menu
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('booking'); scrollToTop(); }} className="hover:text-cafe-gold transition-colors">
                  Reserve Table
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('about'); scrollToTop(); }} className="hover:text-cafe-gold transition-colors">
                  Our Journey & Values
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate('assistant'); scrollToTop(); }} className="hover:text-cafe-gold transition-colors">
                  Digital Concierge AI
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-4 pb-2 border-b border-white/5">
              Contact us
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-cafe-gold shrink-0 mt-0.5" />
                <span className="text-cafe-cream/70 leading-relaxed">
                  128 Glasshouse Boulevard,<br />
                  Avenue Suite, London, UK
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-cafe-gold shrink-0" />
                <span className="text-cafe-cream/70">+44 20 7946 0192</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cafe-gold shrink-0" />
                <span className="text-cafe-cream/70">hello@cafevista.com</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-4 pb-2 border-b border-white/5">
              Opening hours
            </h4>
            <table className="w-full text-xs text-cafe-cream/70 border-collapse">
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 font-medium">Monday — Friday</td>
                  <td className="py-2 text-right font-mono text-cafe-gold">7 AM — 9 PM</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 font-medium">Saturday</td>
                  <td className="py-2 text-right font-mono text-cafe-gold">8 AM — 10 PM</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Sunday</td>
                  <td className="py-2 text-right font-mono text-cafe-gold">8 AM — 8 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Bottom Banner & Human signature */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-cafe-cream/40">
          
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <span className="block font-serif tracking-widest text-[#d1b48c] text-sm italic mb-1">
              Thank you for supporting Cafe Vista!
            </span>
            <span>&copy; {new Date().getFullYear()} Cafe Vista Inc. All rights reserved.</span>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-cafe-gold/20 border border-white/10 hover:border-cafe-gold/30 text-[10px] uppercase tracking-wider text-cafe-cream transition-all duration-300"
          >
            <span>Back To Top</span>
            <ChevronUp className="w-3 h-3" />
          </button>
          
        </div>

      </div>
    </footer>
  );
}
