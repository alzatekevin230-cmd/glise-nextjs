"use client";

import { Children } from 'react';
import AnimatedSection from './AnimatedSection';

/**
 * Grid que anima sus hijos en cascada (stagger effect)
 * Efecto premium como Notion, Apple, Linear
 */
export default function StaggerGrid({ 
  children, 
  className = '',
  animation = 'slideUpScale',
  staggerDelay = 80,
  columns = 4
}) {
  const childrenArray = Children.toArray(children);

  const getGridClasses = () => {
    const colsMap = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
    };
    return colsMap[columns] || 'grid-cols-4';
  };

  return (
    <div className={`grid ${getGridClasses()} gap-4 ${className}`}>
      {childrenArray.map((child, index) => (
        <AnimatedSection
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          duration={500}
        >
          {child}
        </AnimatedSection>
      ))}
    </div>
  );
}

