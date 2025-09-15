// components/FeaturedCategories.jsx
"use client";

import { useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';

// NOTA: Las importaciones de CSS de Swiper ya deben estar en tu archivo layout.js principal
// import 'swiper/css';
// import 'swiper/css/navigation';

export default function FeaturedCategories() {
  const categoriesData = [
    { name: 'Todos', img: '/imagenespagina/catetodos.png', link: '/categoria/all' },
    { name: 'Natural', img: '/imagenespagina/catenatural.png', link: '/categoria/Naturales y Homeopáticos' },
    { name: 'Dermocosmética', img: '/imagenespagina/catedermocosmetica.png', link: '/categoria/Dermocosméticos' },
    { name: 'Milenario', img: '/imagenespagina/catemilenario.png', link: '/categoria/Milenario' },
    { name: 'Infantil', img: '/imagenespagina/cateinfantil.png', link: '/categoria/Cuidado Infantil' },
    { name: 'Belleza', img: '/imagenespagina/catebelleza.png', link: '/categoria/Cuidado y Belleza' }
  ];

  useEffect(() => {
    let swiperInstance = new Swiper('.category-discovery-carousel', {
      modules: [Navigation, Autoplay],
      loop: false,
      spaceBetween: 10,
      navigation: {
        nextEl: '.category-discovery-next',
        prevEl: '.category-discovery-prev',
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      slidesPerView: 2,
      breakpoints: {
        640: { slidesPerView: 4, spaceBetween: 20 },
        768: { slidesPerView: 5, spaceBetween: 20 },
        1024: { slidesPerView: 6, spaceBetween: 30 }
      }
    });

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  }, []);

  return (
    <section id="category-carousel-section" className="mb-16 md:mb-24">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
          Categorías Destacadas
        </h2>
        <div className="relative group">
          <div className="swiper-container category-discovery-carousel overflow-hidden">
            <div className="swiper-wrapper">
              {categoriesData.map((cat, index) => (
                <div key={index} className="swiper-slide">
                  <a href={cat.link} className="category-link text-center">
                    <div className="category-image-wrapper">
                      <img src={cat.img} alt={cat.name} className="category-image" loading="lazy" />
                    </div>
                    <span className="category-name font-semibold text-gray-800">{cat.name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="swiper-button-next category-discovery-next opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="swiper-button-prev category-discovery-prev opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </section>
  );
}
