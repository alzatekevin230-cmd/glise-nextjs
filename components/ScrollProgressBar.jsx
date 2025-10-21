"use client";

import { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-pink-500 z-[100] transition-all duration-150 ease-out origin-left"
      style={{ 
        transform: `scaleX(${scrollProgress / 100})`,
        opacity: scrollProgress > 5 ? 1 : 0
      }}
    />
  );
}

