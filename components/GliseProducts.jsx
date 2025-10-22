// components/GliseProducts.jsx
"use client";

import { useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCardSimple from './ProductCardSimple'; // Usamos la versión sin animaciones

import 'swiper/css';
import 'swiper/css/navigation';

export default function GliseProducts({ products }) {
  // ✅ Optimización DOM: Limitar a 12 productos para reducir elementos DOM
  const limitedProducts = products.slice(0, 12);

  useEffect(() => {
    // Configuración del carrusel 'glise-carousel' de tu main.js
    new Swiper('.glise-carousel', {
      modules: [Navigation, Autoplay],
      loop: true,
      spaceBetween: 8,
      slidesPerView: 2,
      autoplay: { delay: 4500, disableOnInteraction: false },
      navigation: { nextEl: '.glise-next', prevEl: '.glise-prev' },
      breakpoints: {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 }
      }
    });
  }, []);

  return (
    <section className="mb-12">
      <div className="container mx-auto px-2 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Productos Glisé</h2>
          <a href="/categoria/Milenario" className="text-blue-600 font-semibold hover:underline">
            Ver todo
          </a>
        </div>

        <div className="relative">
          <div className="swiper-container glise-carousel overflow-hidden">
            <div className="swiper-wrapper">
              {limitedProducts.map(product => (
                <div key={product.id} className="swiper-slide h-full">
                  <ProductCardSimple product={product} />
                </div>
              ))}
            </div>
          </div>
          <div className="swiper-button-next glise-next"></div>
          <div className="swiper-button-prev glise-prev"></div>
        </div>
      </div>
    </section>
  );
}