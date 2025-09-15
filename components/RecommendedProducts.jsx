// components/RecommendedProducts.jsx
"use client";

import { useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

export default function RecommendedProducts({ products }) {

  useEffect(() => {
    let swiperInstance = null;
    if (products && products.length > 0) {
      swiperInstance = new Swiper('.featured-carousel', {
        modules: [Navigation, Autoplay],
        loop: true,
        spaceBetween: 8,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.recommended-products-next',
          prevEl: '.recommended-products-prev',
        },
        slidesPerView: 2,
        breakpoints: {
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        },
      });
    }
    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  }, [products]);

  return (
    <section className="mb-12 mt-12">
      <div className="container mx-auto px-2 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex-1 mr-4 text-2xl sm:text-3xl font-bold text-gray-800">Recomendados</h2>
          <a href="/categoria/all" className="text-blue-600 font-semibold hover:underline">
            Ver todo
          </a>
        </div>

        {/* 👇 CORRECCIÓN FINAL: Usamos 'group' para controlar la visibilidad de las flechas 👇 */}
        <div className="relative group">
          <div className="swiper-container featured-carousel overflow-hidden">
            <div className="swiper-wrapper">
              {products.map(product => (
                <div key={product.id} className="swiper-slide h-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* 👇 AÑADIMOS clases de Tailwind para que aparezcan al pasar el ratón por el 'group' 👇 */}
          <div className="swiper-button-next recommended-products-next opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="swiper-button-prev recommended-products-prev opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </section>
  );
}
