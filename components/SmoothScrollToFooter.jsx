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

    // Detectar cuando el usuario llega al footer
    const handleScrollToFooter = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Cuando el footer es visible, agregar clase para transición suave
              document.body.classList.add('footer-visible');
            } else {
              document.body.classList.remove('footer-visible');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      observer.observe(footer);
    };

    // Aplicar estilos CSS dinámicamente
    const addSmoothScrollStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        html {
          scroll-behavior: smooth;
        }
        
        body {
          transition: background-color 0.3s ease;
        }
        
        body.footer-visible {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }
        
        footer {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          position: relative;
        }
        
        footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
        }
        
        /* Animación suave para el contenido del footer */
        footer > * {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Staggered animation para elementos del footer */
        footer > *:nth-child(1) { animation-delay: 0.1s; }
        footer > *:nth-child(2) { animation-delay: 0.2s; }
        footer > *:nth-child(3) { animation-delay: 0.3s; }
        footer > *:nth-child(4) { animation-delay: 0.4s; }
      `;
      document.head.appendChild(style);
    };

    // Inicializar
    addSmoothScrollStyles();
    handleScrollToFooter();
    
    // Agregar listener para scroll suave
    document.addEventListener('click', handleSmoothScroll);

    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return null; // Este componente no renderiza nada
}
