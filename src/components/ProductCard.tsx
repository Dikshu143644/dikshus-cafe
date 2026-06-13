import React, { useState } from 'react';
import { Star, Plus, RefreshCw, Leaf } from 'lucide-react';
import { MenuItem } from '../types';

interface ProductCardProps {
  key?: string;
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onOpenQuickView: (item: MenuItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function ProductCard({
  item,
  onAddToCart,
  onOpenQuickView,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      id={`product-${item.id}`}
      className="w-full h-[110vw] xs:h-[95vw] sm:h-[50vw] md:h-[45vw] lg:h-[35vw] xl:h-[400px] perspective-1000 font-sans group relative cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Target Container for 3D flip */}
      <div
        className={`w-full h-full duration-700 ease-out transform style-3d relative ${
          isFlipped ? '[transform:rotateY(180deg)]' : 'shadow-lg hover:shadow-2xl'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* ================= CARD FRONT FACE ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden flex flex-col backface-hidden glass-light"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translate3d(0,0,0)',
            WebkitTransform: 'translate3d(0,0,0)',
            isolation: 'isolate'
          }}
        >
          {/* Item Image with dynamic gradient overlay */}
          <div className="relative h-[48vw] xs:h-[42vw] sm:h-[22vw] md:h-[20vw] lg:h-[15vw] xl:h-[190px] overflow-hidden select-none shrink-0 bg-cafe-smoky [transform:translateZ(0)]">
            <img
              referrerPolicy="no-referrer"
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform"
            />
            
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1915]/60 via-[#1d1915]/10 to-transparent"></div>
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Quick Badges in Header */}
            <div className="absolute top-3 left-3 flex flex-col space-y-1">
              {item.isPopular && (
                <span className="px-2.5 py-1 bg-cafe-gold text-cafe-charcoal text-[9px] font-bold uppercase tracking-wider rounded-md shadow-md">
                  POPULAR CHOICE
                </span>
              )}
              {item.isVegan && (
                <span className="w-6 h-6 rounded-full bg-emerald-500/80 border border-emerald-400/20 text-white flex items-center justify-center shadow-lg" title="Vegan Option">
                  <Leaf className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* Favorite Star Index button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
              className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all duration-300 border ${
                isFavorite
                  ? 'bg-amber-400/20 border-amber-400 text-amber-550'
                  : 'bg-black/15 border-white/5 text-white/70 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Core Body Metadata */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cafe-bronze font-mono uppercase tracking-widest font-bold">
                  {item.category}
                </span>
                <span className="flex items-center text-[10px] text-cafe-smoky font-mono">
                  <Star className="w-3 h-3 text-cafe-gold fill-current mr-0.5" />
                  {item.rating}
                </span>
              </div>
              
              <h3 className="font-serif text-sm font-semibold text-cafe-charcoal uppercase tracking-wider mt-1 truncate group-hover:text-cafe-bronze transition-colors">
                {item.name}
              </h3>
              
              <p className="text-xs text-cafe-smoky/80 leading-relaxed mt-2 line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Cart & Flipping Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#A88665]/20 mt-auto">
              <div>
                <span className="text-[9px] text-cafe-smoky/50 block leading-none uppercase tracking-wider">Premium price</span>
                <span className="font-mono text-sm font-bold text-cafe-bronze mt-1 block">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* 3D Flip Quick Info Trigger */}
                <button
                  type="button"
                  onClick={handleFlipToggle}
                  className="p-2 mr-0.5 rounded-xl bg-white/50 hover:bg-[#A88665]/10 border border-[#A88665]/20 text-cafe-smoky hover:text-[#1C1814] transition-all xl:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 duration-200"
                  title="View Ingredients"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Quick Add with beautiful hover state */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                  className="px-4 py-2 bg-[#1C1814] hover:bg-[#A88665] text-white hover:text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center space-x-1 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ================= CARD BACK FACE ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col justify-between backface-hidden glass-light"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translate3d(0,0,0)',
            WebkitTransform: 'rotateY(180deg) translate3d(0,0,0)',
            isolation: 'isolate'
          }}
        >
          {/* Header block info */}
          <div>
            <div className="flex justify-between items-center border-b border-[#A88665]/20 pb-2.5 mb-3">
              <span className="text-[10px] uppercase font-bold text-cafe-bronze tracking-widest font-mono">
                Ingredients &amp; Nutrients
              </span>
              <span className="text-[10px] uppercase font-mono text-cafe-smoky/60">
                Cal: {item.calorieCount} kcal
              </span>
            </div>

            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-cafe-charcoal">
              {item.name}
            </h3>

            {/* Ingredients Lists */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] uppercase text-cafe-smoky/50 tracking-wider block">Raw composition:</span>
              <ul className="grid grid-cols-2 gap-2">
                {item.ingredients.map((ing, k) => (
                  <li key={k} className="text-xs text-cafe-smoky/90 flex items-center space-x-1.5 leading-relaxed truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-cafe-gold shrink-0"></span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro details metrics */}
            <div className="mt-4 space-y-1 bg-[#FAF6F0]/60 rounded-xl p-3 border border-[#A88665]/20 text-[10px] uppercase tracking-wider text-cafe-smoky/80">
              <div className="flex justify-between">
                <span>Vegan Friendly:</span>
                <span className="font-bold text-cafe-charcoal font-mono">{item.isVegan ? 'YES' : 'NO'}</span>
              </div>
              <div className="flex justify-between">
                <span>Gluten Free:</span>
                <span className="font-bold text-cafe-charcoal font-mono">{item.isGlutenFree ? 'YES' : 'NO'}</span>
              </div>
              <div className="flex justify-between">
                <span>Preparation time:</span>
                <span className="font-bold text-cafe-bronze font-mono">6 - 8 MINS</span>
              </div>
            </div>
          </div>

          {/* Flip back navigation trigger */}
          <div className="border-t border-[#A88665]/20 pt-3.5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleFlipToggle}
              className="px-3.5 py-2 rounded-xl bg-white/50 hover:bg-[#A88665]/10 border border-[#A88665]/20 text-cafe-smoky text-xs uppercase font-mono tracking-wider flex items-center space-x-1.5 transition-transform hover:scale-105 active:scale-95 duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip Front</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onOpenQuickView(item); }}
              className="text-[10px] uppercase tracking-wider text-cafe-bronze font-bold hover:underline"
            >
              View Bio
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
