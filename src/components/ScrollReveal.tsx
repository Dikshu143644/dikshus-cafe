import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  key?: React.Key;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  direction = 'up'
}: ScrollRevealProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const [elementRef, isVisible] = useIntersectionObserver({
    threshold: 0.02, // very low threshold to reveal earlier
    rootMargin: '0px 0px -20px 0px', // slight offset
    freezeOnceVisible: true // Freeze once visible to prevent washing out/blank screen issues on up or fast scroll
  });

  const getDirectionClass = () => {
    if (prefersReducedMotion) return 'translate-y-0';
    switch (direction) {
      case 'up': return 'translate-y-8';
      case 'down': return '-translate-y-8';
      case 'left': return 'translate-x-8';
      case 'right': return '-translate-x-8';
      default: return 'scale-98';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ${
        prefersReducedMotion 
          ? 'duration-0 transition-none opacity-100 translate-y-0 translate-x-0 scale-100'
          : `duration-[750ms] ${
              isVisible 
                ? 'opacity-100 translate-y-0 translate-x-0 scale-100' 
                : `opacity-0 ${getDirectionClass()}`
            }`
      } ${className}`}
      style={{ 
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}
