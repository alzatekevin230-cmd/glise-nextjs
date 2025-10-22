// components/ArticulosBlog.jsx
"use client";

import { useEffect } from 'react';
import ArticuloBlogCard from './ArticuloBlogCard';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ArticulosBlog({ posts }) {
  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const blogSwiper = new Swiper('.blog-carousel', {
      modules: [Navigation, Autoplay],
      loop: posts.length > 3,
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: { 
        delay: 5500, 
        disableOnInteraction: false,
        pauseOnMouseEnter: true 
      },
      navigation: { 
        nextEl: '.blog-next', 
        prevEl: '.blog-prev' 
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 32 }
      },
      // Optimizaciones de performance
      watchOverflow: true,
      observer: false,
      observeParents: false,
      preventInteractionOnTransition: true,
    });

    return () => {
      if (blogSwiper && !blogSwiper.destroyed) {
        blogSwiper.destroy(true, true);
      }
    };
  }, [posts]);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="-mb-8 md:mb-8 py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Título de la sección */}
        <div className="text-center mb-10">
          <div className="inline-block mb-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              📝 Blog
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Artículos de nuestro Blog
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Consejos de expertos, guías prácticas y novedades para tu bienestar
          </p>
        </div>

        {/* Carousel */}
        <div className="relative group">
          <div className="swiper-container blog-carousel overflow-hidden rounded-2xl">
            <div className="swiper-wrapper pb-2">
              {posts.map(post => (
                <div key={post.id} className="swiper-slide h-auto">
                  <ArticuloBlogCard post={post} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Botones de navegación con efecto hover */}
          <div className="swiper-button-next blog-next opacity-0 group-hover:opacity-100 transition-opacity duration-300 after:text-blue-600"></div>
          <div className="swiper-button-prev blog-prev opacity-0 group-hover:opacity-100 transition-opacity duration-300 after:text-blue-600"></div>
        </div>
      </div>
    </section>
  );
}
