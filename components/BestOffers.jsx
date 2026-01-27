"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import CategoryCard from './CategoryCard';

export default function BestOffers({ products = [] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndexMobile, setCurrentIndexMobile] = useState(0);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Detectar screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!products || products.length === 0) {
    return null;
  }

  // Touch handlers para móvil
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (dx > threshold && currentIndexMobile < products.length - 1) {
      setCurrentIndexMobile(prev => prev + 1);
    } else if (dx < -threshold && currentIndexMobile > 0) {
      setCurrentIndexMobile(prev => prev - 1);
    }
  };

  // ========== RENDER MÓVIL ==========
  if (isMobile) {
    const currentCategory = products[currentIndexMobile];

    return (
      <section className="mb-12">
        <div className="container mx-auto px-2">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-[#000000]">Mejores Ofertas</h2>
            <Link 
              href="/categoria/all" 
              className="text-[#0071ce] font-medium text-sm underline"
            >
              Ver todo
            </Link>
          </div>

          {/* Carrusel Móvil - tarjeta tipo retrato (angosta) dejando ver la siguiente */}
          <div 
            ref={containerRef}
            className="overflow-x-auto pb-2 category-carousel-mobile"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex gap-4 pr-2">
              {products.map((category) => (
                <div
                  key={category.categoryName}
                  style={{
                    minWidth: '78vw',
                    maxWidth: '320px'
                  }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ========== RENDER DESKTOP ==========
  return (
    <section className="mb-16">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#000000]">Mejores Ofertas</h2>
          <Link 
            href="/categoria/all" 
            className="text-[#0071ce] font-medium text-base underline"
          >
            Ver todo
          </Link>
        </div>

        {/* Grid de todas las categorías (sin carrusel) */}
        <div className="grid gap-3 xl:gap-4" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
          {products.map((category) => (
            <div key={category.categoryName}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}