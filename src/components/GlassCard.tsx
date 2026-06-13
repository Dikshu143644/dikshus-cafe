import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'dark' | 'light';
  id?: string;
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  theme = 'dark',
  id,
  hoverEffect = true,
}: GlassCardProps) {
  const baseStyle = theme === 'dark' ? 'glass-dark text-cafe-cream' : 'glass-light text-cafe-smoky';
  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-2xl hover:border-cafe-gold/30 transition-all duration-500 ease-out'
    : 'transition-all duration-300';

  const hasPadding = className.split(' ').some(c => c.startsWith('p-') || c.startsWith('px-') || c.startsWith('py-'));

  return (
    <div
      id={id}
      className={`${baseStyle} ${hoverStyle} rounded-2xl ${hasPadding ? '' : 'p-6'} overflow-hidden relative ${className}`}
    >
      {/* Visual background ambient accent for luxury coffee look */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cafe-gold/5 blur-2xl pointer-events-none"></div>
      
      <div className={`relative z-10 ${className.includes('h-') ? 'h-full flex flex-col' : ''} ${className.includes('justify-') ? className.split(' ').filter(c => c.startsWith('justify-')).join(' ') : ''}`}>{children}</div>
    </div>
  );
}
