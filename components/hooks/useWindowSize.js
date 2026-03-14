// components/hooks/useWindowSize.js
"use client";

import { useState, useEffect, useRef } from 'react';

export function useWindowSize() {
  const isClient = typeof window !== 'undefined';

  const [windowSize, setWindowSize] = useState({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  });
  
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isClient) return;

    function handleResize() {
      // Cancelar cualquier animación o timeout pendiente
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce: usar requestAnimationFrame + timeout para evitar lecturas excesivas
      rafRef.current = requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(() => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }, 150); // 150ms de debounce
      });
    }
    
    // Estado inicial sin debounce
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    window.addEventListener("resize", handleResize, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return windowSize;
}