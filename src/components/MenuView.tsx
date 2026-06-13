import React, { useState } from 'react';
import { Search, RotateCcw, Compass, Droplet, Star, Leaf, Check, Plus, X } from 'lucide-react';
import { MenuItem } from '../types';
import ProductCard from './ProductCard';
import GlassCard from './GlassCard';
import ScrollReveal from './ScrollReveal';

interface MenuViewProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function MenuView({
  menuItems,
  onAddToCart,
  favorites,
  onToggleFavorite,
}: MenuViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);

  // Quick View Modal
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'espresso', label: 'Craft Espressos' },
    { id: 'signature', label: 'Signature Blends' },
    { id: 'brunch', label: 'Artisanal Brunch' },
    { id: 'pastries', label: 'Fresh Pastries' },
    { id: 'beverages', label: 'Silky Beverages' }
  ];

  // Filtering Logic
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesVegan = !filterVegan || item.isVegan;
    const matchesGlutenFree = !filterGlutenFree || item.isGlutenFree;

    return matchesSearch && matchesCategory && matchesVegan && matchesGlutenFree;
  });

  return (
    <div id="menu-browse-view" className="bg-transparent min-h-screen pt-32 pb-24 font-sans text-cafe-smoky relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Head Title */}
        <ScrollReveal direction="up" delay={50} className="w-full">
          <div className="text-center space-y-3 mb-10">
            <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-widest font-mono">
              / ARTISANAL CULINARY LISTS
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-cafe-charcoal font-bold uppercase tracking-tight">
              The Glasshouse Menu
            </h1>
            <p className="text-xs sm:text-base text-cafe-charcoal/70 max-w-xl mx-auto leading-relaxed">
              Browse our organic, washed single-origin coffee creations and buttery croissants baked daily by our culinary specialists.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter bar panels */}
        <ScrollReveal direction="up" delay={50} className="w-full">
          <div className="glass-light rounded-2xl p-6 space-y-4 mb-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-cafe-cream" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search caramel macchiato, croissants, sourdough..."
                className="w-full bg-white border border-[#deb887]/30 rounded-full py-2.5 pl-10 pr-4 text-xs text-cafe-smoky outline-none focus:border-cafe-smoky font-mono uppercase tracking-tight"
              />
            </div>

            {/* Category selection chips */}
            <div className="md:col-span-7 flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4.5 py-2 text-[10px] uppercase tracking-wider rounded-full transition-all duration-300 font-bold border cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-cafe-smoky text-white border-cafe-smoky'
                      : 'bg-white text-cafe-smoky hover:bg-cafe-gold/15 border-[#deb887]/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary filters selectors */}
          <div className="flex items-center space-x-6 text-xs pt-2 border-t border-cafe-smoky/5">
            <span className="font-bold text-cafe-charcoal font-sans uppercase text-[10px] tracking-wider">Dietary Preferences:</span>
            
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterVegan}
                onChange={(e) => setFilterVegan(e.target.checked)}
                className="rounded text-cafe-smoky border-[#deb887]/30 focus:ring-cafe-smoky cursor-pointer"
              />
              <span className="text-cafe-charcoal text-[11px] uppercase font-bold tracking-tight">Vegan Friendly Only</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterGlutenFree}
                onChange={(e) => setFilterGlutenFree(e.target.checked)}
                className="rounded text-cafe-smoky border-[#deb887]/30 focus:ring-cafe-smoky cursor-pointer"
              />
              <span className="text-cafe-charcoal text-[11px] uppercase font-bold tracking-tight">Gluten Free Only</span>
            </label>

            {(searchQuery || selectedCategory !== 'all' || filterVegan || filterGlutenFree) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilterVegan(false);
                  setFilterGlutenFree(false);
                }}
                className="text-[10px] uppercase font-bold tracking-wider text-cafe-bronze hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
          </div>
        </ScrollReveal>

        {/* Product Card grids lists */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center text-cafe-charcoal/50 max-w-md mx-auto space-y-3">
            <h3 className="font-serif text-lg font-bold text-cafe-charcoal uppercase leading-none">No menu matches found</h3>
            <p className="text-xs text-cafe-charcoal/65 leading-relaxed">
              No single origin espresso or croissants match your active preferences. Refine search strings or disable vegan checkboxes to find items.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <ScrollReveal
                key={item.id}
                direction="up"
                delay={(index % 4) * 60}
                duration={0.7}
              >
                <ProductCard
                  item={item}
                  onAddToCart={onAddToCart}
                  onOpenQuickView={(it) => setQuickViewItem(it)}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>

      {/* ================= QUICK VIEW DIALOG DIALOG OVERLAY ================= */}
      {quickViewItem && (
        <div id="quickview-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#12100e]/85 backdrop-blur-sm transition-opacity"
            onClick={() => setQuickViewItem(null)}
          />

          <div className="relative glass-dark max-w-2xl w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col sm:flex-row text-cafe-cream max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            {/* Left side Visual banner */}
            <div className="relative w-full sm:w-1/2 h-56 sm:h-auto overflow-hidden bg-cafe-smoky">
              <img
                src={quickViewItem.image}
                alt={quickViewItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-cafe-charcoal via-transparent to-transparent opacity-90"></div>
            </div>

            {/* Right side Detail blocks */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5 mb-4">
                  <span className="text-[10px] text-cafe-gold font-mono uppercase tracking-widest leading-none font-bold">
                    {quickViewItem.category} Category
                  </span>
                  
                  <button
                    onClick={() => setQuickViewItem(null)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-serif text-2xl font-bold uppercase tracking-wide text-white">
                  {quickViewItem.name}
                </h3>
                
                <p className="text-xs text-cafe-cream/80 leading-relaxed mt-3">
                  {quickViewItem.description}
                </p>

                {/* Sourcing background */}
                <div className="mt-4 p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1.5 text-[10px] uppercase font-mono tracking-tight text-cafe-cream/60">
                  <p className="font-bold text-cafe-gold">ROAST profile specifications:</p>
                  <div className="flex justify-between">
                    <span>Estate Elevation:</span>
                    <span className="text-white">1,650m ASL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extraction bar pressure:</span>
                    <span className="text-white">9 BAR ESPRESSO</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calorie counts:</span>
                    <span className="text-white">{quickViewItem.calorieCount} kcal</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-cafe-cream/40 block leading-none uppercase">Ticket price</span>
                  <span className="font-mono text-lg font-bold text-cafe-gold mt-1 block">
                    ${quickViewItem.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(quickViewItem);
                    setQuickViewItem(null);
                  }}
                  className="px-5 py-3 bg-cafe-gold text-cafe-charcoal hover:bg-white hover:text-cafe-smoky lg:text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  Add to order
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
