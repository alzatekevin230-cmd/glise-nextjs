// app/components/ProductosRelacionadosBlog.jsx
"use client";

import { useEffect, useRef } from 'react';
import ProductCard from './ProductCard'; // Reutilizamos tu tarjeta de producto
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductosRelacionadosBlog({ products }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.destroy(true, true);

    swiperRef.current = new Swiper('.blog-related-products-carousel', {
      modules: [Navigation, Autoplay],
      loop: products.length > 5,
      spaceBetween: 20,
      slidesPerView: 2,
      autoplay: { delay: 4000, disableOnInteraction: false },
      navigation: { nextEl: '.blog-related-products-next', prevEl: '.blog-related-products-prev' },
      breakpoints: {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }
    });

    return () => { if (swiperRef.current) swiperRef.current.destroy(true, true); };
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 mt-16 pt-8 border-t">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Productos que te pueden interesar</h2>
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="swiper-container blog-related-products-carousel overflow-hidden py-4">
          <div className="swiper-wrapper">
            {products.map(product => (
              <div key={product.id} className="swiper-slide h-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="swiper-button-next blog-related-products-next"></div>
        <div className="swiper-button-prev blog-related-products-prev"></div>
      </div>
    </section>
  );
}