// components/ProductosRelacionados.jsx
"use client";

import { useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductosRelacionados({ products }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Si ya existe una instancia de Swiper, la destruimos primero.
    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
    }

    if (products && products.length > 0) {
      // Creamos la nueva instancia de Swiper.
      swiperRef.current = new Swiper('.related-products-carousel', {
        modules: [Navigation, Autoplay],
        loop: products.length > 5,
        spaceBetween: 8, // Espacio reducido entre tarjetas
        slidesPerView: 2,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        // Le indicamos las clases exactas para los botones
        navigation: { 
          nextEl: '.related-products-next', 
          prevEl: '.related-products-prev' 
        },
        breakpoints: { 
          768: { slidesPerView: 3 }, 
          1024: { slidesPerView: 4 }, 
          1280: { slidesPerView: 5 } 
        }
      });
    }
  }, [products]); // Se ejecuta cada vez que los productos cambian

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">También te puede interesar</h2>
      
      {/* --- ESTRUCTURA HTML CORREGIDA --- */}
      <div className="relative group">
        <div className="swiper-container related-products-carousel overflow-hidden">
          <div className="swiper-wrapper">
            {products.map(product => (
              <div key={product.id} className="swiper-slide h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Flechas con las clases correctas para que Swiper las encuentre y para el efecto hover */}
        <div className="swiper-button-next related-products-next opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="swiper-button-prev related-products-prev opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </section>
  );
}