// EN: components/ProductCarousel.jsx
"use client";

import { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductCarousel({ 
  products, 
  carouselClassName, 
  nextButtonClassName, 
  prevButtonClassName,
  isSmall = false 
}) {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiper = new Swiper(`.${carouselClassName}`, {
      modules: [Navigation],
      loop: products.length > 5,
      spaceBetween: 8,
      slidesPerView: 2,
      navigation: {
        nextEl: `.${nextButtonClassName}`,
        prevEl: `.${prevButtonClassName}`,
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 }
      }
    });
    swiperRef.current = swiper;

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, [products, carouselClassName, nextButtonClassName, prevButtonClassName]);

  if (!products || products.length === 0) {
    return <p>No hay productos para mostrar.</p>;
  }

  return (
    // 1. AÑADIMOS LA CLASE "group" AL CONTENEDOR PRINCIPAL
    <div className="container mx-auto px-2 sm:px-6 relative group">
      <div className={`swiper ${carouselClassName} overflow-hidden`}>
        <div className="swiper-wrapper">
          {products.map(product => (
            <div key={product.id} className="swiper-slide h-full">
              <ProductCard product={product} isSmall={isSmall} />
            </div>
          ))}
        </div>
      </div>
      {/* 2. AÑADIMOS CLASES PARA OCULTAR LAS FLECHAS Y MOSTRARLAS EN HOVER */}
      <div className={`swiper-button-next ${nextButtonClassName} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className={`swiper-button-prev ${prevButtonClassName} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
}