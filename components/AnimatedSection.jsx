"use client";

import { useIntersectionObserver } from './hooks/useIntersectionObserver';

export default function AnimatedSection({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  duration = 600,
  className = ''
}) {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-600 ease-out';
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} opacity-0`;
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-8`;
        case 'slideLeft':
          return `${baseClasses} opacity-0 -translate-x-8`;
        case 'slideRight':
          return `${baseClasses} opacity-0 translate-x-8`;
        case 'scaleUp':
          return `${baseClasses} opacity-0 scale-95`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    // Una vez visible, mantener el estado final sin animaciones repetitivas
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
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
}
