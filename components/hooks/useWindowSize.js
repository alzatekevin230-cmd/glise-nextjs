// components/hooks/useWindowSize.js
"use client";

import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Llama al manejador de inmediato para establecer el estado inicial
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}