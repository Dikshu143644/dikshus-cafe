import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import GlassCard from './GlassCard';

interface ContactViewProps {
  onSendMessage: (name: string, email: string, message: string) => Promise<any>;
}

export default function ContactView({ onSendMessage }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsLoading(true);
    try {
      await onSendMessage(name, email, message);
      setShowSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewsSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubbed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div id="contact-support-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Head Title */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-widest font-mono">
            / REACHING OUT
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-cafe-charcoal font-bold uppercase tracking-tight">
            Connect &amp; Converse
          </h1>
          <p className="text-xs sm:text-base text-cafe-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Have a private event enquiry, sourcing question, or editorial feedback? Write directly to our lounge desk team.
          </p>
        </div>

        {/* Master Details Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Column: specifications coordinates info */}
          <div className="lg:col-span-5 space-y-8">
            
            <h2 className="font-serif text-2xl font-bold uppercase text-cafe-charcoal tracking-wide">
              Lounge Coordinates
            </h2>

            <div className="space-y-6 text-xs text-cafe-charcoal/85">
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-cafe-smoky/5 border border-cafe-smoky/10 flex items-center justify-center text-cafe-bronze shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold uppercase tracking-wider text-cafe-charcoal">Botanical Location</h4>
                  <p className="mt-1 leading-relaxed">
                    The Botanical Glass Domes, Queen’s Gate Gardens, <br />
                    Kensington, London, SW7 5LY, United Kingdom
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-cafe-smoky/5 border border-cafe-smoky/10 flex items-center justify-center text-cafe-bronze shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold uppercase tracking-wider text-cafe-charcoal">Opening hours</h4>
                  <p className="mt-1 leading-relaxed">
                    Monday — Friday: 07:00 AM — 09:00 PM <br />
                    Saturday — Sunday: 08:00 AM — 10:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-cafe-smoky/5 border border-cafe-smoky/10 flex items-center justify-center text-cafe-bronze shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold uppercase tracking-wider text-cafe-charcoal">Customer line</h4>
                  <p className="mt-1 leading-relaxed font-mono">
                    hello@cafevista.com <br />
                    +44 20 7946 0192
                  </p>
                </div>
              </div>

            </div>

            {/* Newsletter card */}
            <div className="glass-light rounded-2xl p-6 space-y-4">
              <span className="text-[10px] tracking-widest uppercase font-bold text-cafe-bronze font-mono block">
                / JOuRNEY GAZETTE
              </span>
              <h4 className="font-serif text-base text-cafe-charcoal font-bold uppercase">Subscribe for Roast announcements</h4>
              <p className="text-xs text-cafe-charcoal/75 leading-relaxed">
                Be notified about new washed estate micro-lots, private tasting sessions, and weekend culinary recipes.
              </p>
              
              {!newsletterSubbed ? (
                <form onSubmit={handleNewsSub} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="ENTER EMAIL ADDRESS..."
                    className="flex-1 bg-white border border-[#deb887]/35 rounded-xl px-4 py-2 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky font-mono tracking-tight text-center uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-cafe-smoky text-white hover:bg-cafe-gold text-xs font-bold uppercase rounded-xl transition-all"
                  >
                    Join
                  </button>
                </form>
              ) : (
                <div className="text-xs text-emerald-600 font-bold flex items-center space-x-1 font-mono uppercase">
                  <Check className="w-4 h-4" />
                  <span>Success index loaded! You are on the list.</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: interactive contact submission form */}
          <div className="lg:col-span-7">
            <GlassCard theme="light" className="p-8" hoverEffect={false}>
              
              {!showSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <h2 className="font-serif text-xl font-bold uppercase text-cafe-charcoal border-b border-cafe-smoky/5 pb-2.5">
                    Write directly to lounge desk
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-cafe-charcoal font-sans">Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none"
                        placeholder="Elena Rostova"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none"
                        placeholder="elena@cafevista.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-cafe-charcoal">Descriptive inquiry details</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white border border-[#deb887]/30 rounded-xl px-4 py-3 text-xs text-cafe-smoky outline-none resize-none"
                      placeholder="WRITE YOUR SPECIFIC MESSAGE HERE..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky h-12 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Submitting in Desk log...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit inquiry details</span>
                      </>
                    )}
                  </button>

                </form>
              ) : (
                <div className="py-12 text-center space-y-6 animate-scaleUp">
                  <div className="w-14 h-14 bg-emerald-100 border border-emerald-400/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-600 font-bold block">
                      MESSAGE LOGGED IN DESK LOGS
                    </span>
                    <h3 className="font-serif text-xl font-bold text-cafe-charcoal uppercase block">
                      Thank you for connecting!
                    </h3>
                    <p className="text-xs text-cafe-charcoal/70 max-w-sm mx-auto leading-relaxed">
                      Your inquiry has been stored securely. Our lounge coordinator reviews entries daily and will answer back within 12 hours.
                    </p>
                  </div>
                  <span>
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="px-5 py-2 bg-cafe-smoky hover:bg-cafe-gold text-white hover:text-cafe-smoky text-xs uppercase font-bold rounded-full transition-colors font-mono cursor-pointer"
                    >
                      Write Another Message
                    </button>
                  </span>
                </div>
              )}

            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  );
}
