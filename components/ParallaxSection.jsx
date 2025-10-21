"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * Sección con efecto parallax sutil
 * Estilo Apple/Tesla/Airbnb
 */
export default function ParallaxSection({ 
  children, 
  className = '',
  speed = 0.5, // Velocidad del parallax (0.5 = mitad de velocidad del scroll)
  disabled = false // Deshabilitar en móvil si es necesario
}) {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Solo aplicar parallax si el elemento está visible en viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setOffsetY(window.scrollY * speed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, disabled]);

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translateY(${offsetY}px)`,
          transition: 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
}

