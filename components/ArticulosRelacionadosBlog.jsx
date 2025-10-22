// components/ArticulosRelacionadosBlog.jsx
"use client";

import { useEffect, useRef } from 'react';
import ArticuloBlogCard from './ArticuloBlogCard';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ArticulosRelacionadosBlog({ posts }) {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!posts || posts.length === 0) return;
    
    if (swiperRef.current) swiperRef.current.destroy(true, true);

    swiperRef.current = new Swiper('.related-blog-carousel', {
      modules: [Navigation, Autoplay],
      loop: posts.length > 3,
      spaceBetween: 20,
      slidesPerView: 1,
      autoplay: { 
        delay: 5000, 
        disableOnInteraction: false,
        pauseOnMouseEnter: true 
      },
      navigation: { 
        nextEl: '.related-blog-button-next', 
        prevEl: '.related-blog-button-prev' 
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 32 },
      },
      // Optimizaciones de performance
      watchOverflow: true,
      observer: false,
      observeParents: false,
      preventInteractionOnTransition: true,
    });

    return () => { 
      if (swiperRef.current) swiperRef.current.destroy(true, true); 
    };
  }, [posts]);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mb-0 md:mb-12 mt-16 pt-12 border-t-2 border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Título de la sección */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Artículos Relacionados
          </h2>
          <p className="text-gray-600">
            Continúa leyendo sobre este tema
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group">
          <div className="swiper-container related-blog-carousel overflow-hidden rounded-2xl">
            <div className="swiper-wrapper pb-2">
              {posts.map(post => (
                <div key={post.id} className="swiper-slide h-auto">
                  <ArticuloBlogCard post={post} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Botones de navegación */}
          <div className="swiper-button-next related-blog-button-next opacity-0 group-hover:opacity-100 transition-opacity duration-300 after:text-blue-600"></div>
          <div className="swiper-button-prev related-blog-button-prev opacity-0 group-hover:opacity-100 transition-opacity duration-300 after:text-blue-600"></div>
        </div>
      </div>
    </section>
  );
}
