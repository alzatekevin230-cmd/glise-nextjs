// hooks/useSmartHeader.js
"use client";

import { useState, useEffect, useRef } from 'react';

export function useSmartHeader() {
  const [headerState, setHeaderState] = useState('visible-full'); // 'visible-full', 'visible-search', 'hidden'
  const lastScrollY = useRef(0);
  const scrollThreshold = 5;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY.current) < scrollThreshold) {
        return;
      }

      if (currentScrollY <= 10) {
        setHeaderState('visible-full');
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderState('visible-search');
      } else {
        setHeaderState('hidden');
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { headerState };
}