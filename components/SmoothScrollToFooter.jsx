"use client";

import { useEffect } from 'react';

export default function SmoothScrollToFooter() {
  useEffect(() => {
    // Aplicar scroll suave a todos los enlaces internos
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Agregar listener para scroll suave
    document.addEventListener('click', handleSmoothScroll);

    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return null; // Este componente no renderiza nada
}
