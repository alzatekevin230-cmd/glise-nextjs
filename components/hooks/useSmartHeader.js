"use client";

import { useEffect, useRef, useState } from 'react';

export function useSmartHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Forzar header visible al montar y en cada cambio de ruta, si en top
  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollY < 10) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY.current;

        // Si hacemos scroll hacia abajo (scrollDiff > 0), esconder
        if (scrollDiff > 5 && currentScrollY > 50) {
          setIsVisible(false);
        }
        // Si hacemos scroll hacia arriba (scrollDiff < 0), mostrar
        else if (scrollDiff < -5) {
          setIsVisible(true);
        }
        // Si estamos en el tope de la página, siempre mostrar
        else if (currentScrollY < 10) {
          setIsVisible(true);
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
