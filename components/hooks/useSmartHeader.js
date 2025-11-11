"use client";

import { useEffect, useRef, useState } from 'react';

export function useSmartHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Forzar header visible al montar y en cada cambio de ruta, si en top
  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollY <= 5) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [typeof window !== 'undefined' ? window.location.pathname : '']);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Solo mostrar cuando llegas al tope, SIN transición
        if (currentScrollY <= 5) {
          setIsVisible(true);
        } else {
          // Cualquier otra posición: ocultar instantáneamente
          setIsVisible(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isVisible };
}
