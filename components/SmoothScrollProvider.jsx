"use client";

import { useEffect } from 'react';

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    // Optimizar el rendimiento del scroll
    let ticking = false;
    
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Aquí se pueden añadir optimizaciones adicionales si es necesario
          ticking = false;
        });
        ticking = true;
      }
    };

    // Throttle scroll events para mejor rendimiento
    window.addEventListener('scroll', optimizeScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', optimizeScroll);
    };
  }, []);

  return <>{children}</>;
}
