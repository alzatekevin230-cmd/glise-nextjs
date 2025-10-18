// components/NaturalProductsSection.jsx
"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCardSimple from './ProductCardSimple';

import 'swiper/css';
import 'swiper/css/navigation';

export default function NaturalProductsSection({ products }) {
  useEffect(() => {
    new Swiper('.natural-products-carousel', {
      modules: [Navigation, Autoplay],
      loop: true,
      spaceBetween: 8,
      slidesPerView: 2,
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: { nextEl: '.natural-next', prevEl: '.natural-prev' },
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
        {/* Banners de la sección */}
        <Link href="/categoria/Naturales y Homeopáticos" className="block md:hidden mb-8">
          <Image 
            src="/imagenespagina/banernatural.webp" 
            alt="Ofertas Especiales en Naturales" 
            width={1000}
            height={750}
            className="w-full h-auto rounded-lg shadow-md" 
          />
        </Link>
        <div className="hidden md:grid grid-cols-2 gap-6 mb-8">
          <Link href="/categoria/Naturales y Homeopáticos" className="block">
            <Image 
              src="/imagenespagina/banernaturalescritorio1.webp" 
              alt="Ofertas en Cuidado Natural" 
              width={1000}
              height={750}
              className="w-full h-full object-cover rounded-lg shadow-md" 
            />
          </Link>
          <Link href="/categoria/Naturales y Homeopáticos" className="block">
            <Image 
              src="/imagenespagina/banernaturalescritorio.webp" 
              alt="Descubre Productos Naturales" 
              width={1000}
              height={750}
              className="w-full h-full object-cover rounded-lg shadow-md" 
            />
          </Link>
        </div>

        {/* Carrusel de la sección (ya estaba optimizado) */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex-1 mr-4 text-2xl sm:text-3xl font-bold text-gray-800">Naturales</h2>
          <Link href="/categoria/Naturales y Homeopáticos" className="text-blue-600 font-semibold hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="relative">
          <div className="swiper-container natural-products-carousel overflow-hidden">
            <div className="swiper-wrapper">
              {products.map(product => (
                <div key={product.id} className="swiper-slide h-full">
                  <ProductCardSimple product={product} />
                </div>
              ))}
            </div>
          </div>
          <div className="swiper-button-next natural-next"></div>
          <div className="swiper-button-prev natural-prev"></div>
        </div>
      </div>
    </section>
  );
}