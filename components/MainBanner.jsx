"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function MainBanner() {
  useEffect(() => {
    const swiper = new Swiper('.main-banner-carousel', {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      speed: 600,
      autoplay: { 
        delay: 5000, 
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: { 
        el: '.main-banner-pagination', 
        clickable: true,
        dynamicBullets: false,
        type: 'bullets',
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        }
      },
      navigation: { 
        nextEl: '.main-banner-next', 
        prevEl: '.main-banner-prev' 
      },
      // Habilitar touch explícitamente
      touchEventsTarget: 'container',
      simulateTouch: true,
      touchRatio: 1,
      touchAngle: 45,
      grabCursor: true,
      allowTouchMove: true,
      // Prevenir conflictos con scroll vertical
      touchStartPreventDefault: false,
      resistanceRatio: 0.85,
      // Forzar actualización de paginación en cada cambio
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      // Event listeners para asegurar sincronización
      on: {
        slideChange: function () {
          // Forzar actualización de la paginación
          if (this.pagination && this.pagination.render) {
            this.pagination.render();
            this.pagination.update();
          }
        },
        touchEnd: function () {
          // Actualizar paginación después de touch
          if (this.pagination && this.pagination.update) {
            this.pagination.update();
          }
        }
      }
    });
    
    return () => {
      if (swiper) swiper.destroy();
    };
  }, []);

  return (
    <section className="mb-12">
      <div className="swiper-container main-banner-carousel rounded-lg overflow-hidden shadow-lg relative">
        <div className="swiper-wrapper">

          {/* --- SLIDE 1 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture className="relative block w-full h-full">
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner1.webp" />
              <Image 
                src="/imagenespagina/banermovil1.webp" 
                alt="Oferta en Aceites Glise"
                fill
                className="object-cover"
                priority
              />
            </picture>
          </div>

          {/* --- SLIDE 2 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture className="relative block w-full h-full">
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner2.webp" />
              <Image 
                src="/imagenespagina/banermovil2.webp" 
                alt="Banner Cuidado de Bebé"
                fill
                className="object-cover"
                loading="lazy"
                priority={false}
              />
            </picture>
          </div>
          
          {/* --- SLIDE 3 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture className="relative block w-full h-full">
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner3.webp" />
              <Image 
                src="/imagenespagina/banermovil3.webp" 
                alt="Banner Productos Naturales"
                fill
                className="object-cover"
                loading="lazy"
                priority={false}
              />
            </picture>
          </div>
          
          {/* --- SLIDE 4 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture className="relative block w-full h-full">
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner4.webp" />
              <Image 
                src="/imagenespagina/banermovil4 .webp" 
                alt="Banner Adicional 1"
                fill
                className="object-cover"
                loading="lazy"
                priority={false}
              />
            </picture>
          </div>

          {/* --- SLIDE 5 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture className="relative block w-full h-full">
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner5.webp" />
              <Image 
                src="/imagenespagina/banermovil5.webp" 
                alt="Banner Adicional 2"
                fill
                className="object-cover"
                loading="lazy"
                priority={false}
              />
            </picture>
          </div>

        </div>
        <div className="swiper-button-next main-banner-next"></div>
        <div className="swiper-button-prev main-banner-prev"></div>
        <div className="swiper-pagination main-banner-pagination"></div>
      </div>
    </section>
  );
}