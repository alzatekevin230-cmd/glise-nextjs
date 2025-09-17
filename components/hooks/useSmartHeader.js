// hooks/useSmartHeader.js
"use client";

import { useState, useEffect, useRef } from 'react';

export function useSmartHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFullHeader, setIsFullHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 5; // Umbral para evitar parpadeos

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ignora movimientos pequeños para evitar activaciones accidentales
      if (Math.abs(currentScrollY - lastScrollY.current) < scrollThreshold) {
        return;
      }

      // 1. Si estamos en el tope de la página -> MUESTRA TODO
      if (currentScrollY <= 10) { // Usamos un pequeño margen por el "bounce" en móviles
        setIsVisible(true);
        setIsFullHeader(true);
      } 
      // 2. Si estamos subiendo (y no estamos en el tope) -> MUESTRA SOLO BUSCADOR
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);      // El contenedor debe ser visible
        setIsFullHeader(false);  // Pero solo la parte del buscador
      } 
      // 3. Si estamos bajando -> OCULTA TODO
      else {
        setIsVisible(false);
        setIsFullHeader(false); // Ocultamos todo al bajar
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Retornamos los nuevos estados más claros
  return { isVisible, isFullHeader };
}