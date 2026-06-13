import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, User, LayoutDashboard, MessageSquare, Menu, X, Star } from 'lucide-react';
import { UserRole } from '../types';
import { CafeVistaLogo } from './OpeningSlider';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount: number;
  user: { name: string; role: UserRole } | null;
  onLogout: () => void;
  onOpenCart: () => void;
}

export default function Navbar({
  currentPage,
  onNavigate,
  cartCount,
  user,
  onLogout,
  onOpenCart,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Browse Menu' },
    { id: 'booking', label: 'Reserve Table' },
    { id: 'about', label: 'Our Story' },
    { id: 'assistant', label: 'AI Assistant' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-cafe-cream/85 backdrop-blur-md border-b border-cafe-charcoal/10 shadow-md'
          : 'py-5 bg-cafe-cream/40 backdrop-blur-md border-b border-cafe-charcoal/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand/Logo */}
          <div
            id="navbar-brand"
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => handleLinkClick('home')}
          >
            <div className="w-9 h-9 rounded-full bg-cafe-charcoal flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CafeVistaLogo className="w-8 h-8 filter invert shrink-0" />
            </div>
            <div>
              <span className="font-serif text-xl tracking-tight font-bold italic text-cafe-charcoal block leading-none font-sans tracking-tight">
                Dikshu's Cafe
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-cafe-gold block mt-0.5 font-bold">
                Artisanal Sanctuary
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-4 py-2 font-sans text-xs uppercase tracking-widest rounded-full transition-all duration-300 font-bold ${
                  currentPage === link.id
                    ? 'bg-cafe-charcoal text-white font-extrabold'
                    : 'text-cafe-charcoal/70 hover:text-cafe-gold hover:bg-cafe-charcoal/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Area Control Buttons */}
          <div className="flex items-center space-x-3">
            {/* Quick Action: Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-cafe-charcoal hover:bg-cafe-gold/15 border border-cafe-charcoal/10 hover:border-cafe-gold/30 transition-all duration-300 group"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-cafe-charcoal group-hover:text-cafe-gold transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cafe-gold text-cafe-charcoal text-[9px] font-bold font-mono h-5 w-5 rounded-full flex items-center justify-center animate-pulse shadow-sm border border-cafe-cream">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dashboard or Login state */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'manager' ? (
                  <button
                    onClick={() => handleLinkClick('manager')}
                    className="flex items-center space-x-1 px-4 py-2 bg-cafe-charcoal text-white hover:bg-cafe-gold hover:text-cafe-charcoal text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Manager</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleLinkClick('dashboard')}
                    className="flex items-center space-x-1 px-3.5 py-2 bg-cafe-charcoal/5 hover:bg-cafe-charcoal/10 border border-cafe-charcoal/10 text-cafe-charcoal text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-cafe-gold" />
                    <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  </button>
                )}
                
                <button
                  onClick={onLogout}
                  className="hidden sm:block text-[10px] uppercase tracking-wider text-cafe-charcoal/40 hover:text-red-600 px-2 py-1 hover:bg-red-500/5 rounded-md transition-all duration-300"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLinkClick('login')}
                  className="text-xs uppercase tracking-widest font-bold border-b-2 border-cafe-charcoal pb-0.5 text-cafe-charcoal hover:text-cafe-gold hover:border-cafe-gold transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleLinkClick('booking')}
                  className="hidden sm:block px-6 py-2.5 bg-cafe-charcoal hover:bg-cafe-gold text-white hover:text-cafe-charcoal text-[10px] uppercase tracking-wider rounded-full font-bold transition-all duration-300"
                >
                  Reserve Table
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-cafe-charcoal hover:bg-cafe-charcoal/5 transition-all outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay Slider */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-cafe-cream border-b border-cafe-charcoal/10 shadow-2xl z-40 transition-all duration-300 ease-in overflow-hidden py-4 animate-fadeIn">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3 flex flex-col items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-4/5 text-center px-4 py-3 font-sans text-xs uppercase tracking-widest rounded-full transition-all ${
                  currentPage === link.id
                    ? 'bg-cafe-charcoal/15 text-cafe-charcoal font-bold'
                    : 'text-cafe-charcoal/70 hover:text-cafe-gold'
                }`}
              >
                {link.label}
              </button>
            ))}
            
            {user && (
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-4/5 text-center py-2.5 mt-3 text-red-600 hover:bg-red-500/5 rounded-full text-xs uppercase tracking-widest border border-red-500/10"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
