"use client";

import { useIntersectionObserver } from './hooks/useIntersectionObserver';

export default function AnimatedSection({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  duration = 600,
  className = '',
  stagger = false,
  staggerDelay = 100
}) {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });

  const getAnimationClasses = () => {
    // Usando cubic-bezier moderno para animaciones más fluidas
    const baseClasses = 'transition-all ease-[cubic-bezier(0.4,0,0.2,1)]';
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-0`;
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-10`;
        case 'slideLeft':
          return `${baseClasses} opacity-0 -translate-x-10`;
        case 'slideRight':
          return `${baseClasses} opacity-0 translate-x-10`;
        case 'scaleUp':
          return `${baseClasses} opacity-0 scale-95`;
        case 'slideUpScale': // Nueva animación premium
          return `${baseClasses} opacity-0 translate-y-8 scale-95`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    // Estado final con animación suave
    switch (animation) {
      case 'fadeIn':
        return `${baseClasses} opacity-100`;
      case 'slideUp':
        return `${baseClasses} opacity-100 translate-y-0`;
      case 'slideLeft':
        return `${baseClasses} opacity-100 translate-x-0`;
      case 'slideRight':
        return `${baseClasses} opacity-100 translate-x-0`;
      case 'scaleUp':
        return `${baseClasses} opacity-100 scale-100`;
      case 'slideUpScale':
        return `${baseClasses} opacity-100 translate-y-0 scale-100`;
      default:
        return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        // Smooth rendering
        willChange: isVisible ? 'auto' : 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}
