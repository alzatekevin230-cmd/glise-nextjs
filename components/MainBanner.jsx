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
      speed: 1000, // Velocidad de transición más lenta, igual que móvil
      autoplay: { 
        delay: 5000, 
        disableOnInteraction: false,
        pauseOnMouseEnter: false // No pausar en desktop, igual que móvil
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
      // Optimizaciones de rendimiento - evitar forced reflows
      watchSlidesProgress: false, // ✅ Desactivar para mejor rendimiento
      watchSlidesVisibility: false, // ✅ Desactivar para mejor rendimiento
      observer: false, // ✅ No observar cambios DOM innecesarios
      observeParents: false, // ✅ Mejora rendimiento
      observeSlideChildren: false, // ✅ Mejora rendimiento
      resizeObserver: false, // ✅ Usar resize event simple
      updateOnWindowResize: true,
      preventInteractionOnTransition: true,
      // Event listeners optimizados
      on: {
        slideChange: function () {
          // Usar requestAnimationFrame para evitar forced reflow
          requestAnimationFrame(() => {
            if (this.pagination && this.pagination.render) {
              this.pagination.render();
              this.pagination.update();
            }
          });
        },
        touchEnd: function () {
          // Usar requestAnimationFrame para evitar forced reflow
          requestAnimationFrame(() => {
            if (this.pagination && this.pagination.update) {
              this.pagination.update();
            }
          });
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
            {/* Imagen Mobile - LCP optimizado */}
            <Image 
              src="/imagenespagina/banermovil1.webp" 
              alt="Oferta en Aceites Glise"
              fill
              className="object-cover md:hidden"
              priority
              fetchPriority="high"
              quality={90}
              sizes="100vw"
            />
            {/* Imagen Desktop - LCP optimizado */}
            <Image 
              src="/imagenespagina/baner1.webp" 
              alt="Oferta en Aceites Glise"
              fill
              className="object-cover hidden md:block"
              priority
              fetchPriority="high"
              quality={90}
              sizes="100vw"
            />
          </div>

          {/* --- SLIDE 2 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            {/* Imagen Mobile */}
            <Image 
              src="/imagenespagina/banermovil2.webp" 
              alt="Banner Cuidado de Bebé"
              fill
              className="object-cover md:hidden"
              loading="lazy"
              quality={75}
              sizes="(max-width: 768px) 100vw, 0vw"
            />
            {/* Imagen Desktop */}
            <Image 
              src="/imagenespagina/baner2.webp" 
              alt="Banner Cuidado de Bebé"
              fill
              className="object-cover hidden md:block"
              loading="lazy"
              quality={75}
              sizes="(min-width: 768px) 100vw, 0vw"
            />
          </div>
          
          {/* --- SLIDE 3 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <Image 
              src="/imagenespagina/banermovil3.webp" 
              alt="Banner Productos Naturales"
              fill
              className="object-cover md:hidden"
              loading="lazy"
              quality={75}
              sizes="(max-width: 768px) 100vw, 0vw"
            />
            <Image 
              src="/imagenespagina/baner3.webp" 
              alt="Banner Productos Naturales"
              fill
              className="object-cover hidden md:block"
              loading="lazy"
              quality={75}
              sizes="(min-width: 768px) 100vw, 0vw"
            />
          </div>
          
          {/* --- SLIDE 4 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <Image 
              src="/imagenespagina/banermovil4 .webp" 
              alt="Banner Adicional 1"
              fill
              className="object-cover md:hidden"
              loading="lazy"
              quality={75}
              sizes="(max-width: 768px) 100vw, 0vw"
            />
            <Image 
              src="/imagenespagina/baner4.webp" 
              alt="Banner Adicional 1"
              fill
              className="object-cover hidden md:block"
              loading="lazy"
              quality={75}
              sizes="(min-width: 768px) 100vw, 0vw"
            />
          </div>

          {/* --- SLIDE 5 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <Image 
              src="/imagenespagina/banermovil5.webp" 
              alt="Banner Adicional 2"
              fill
              className="object-cover md:hidden"
              loading="lazy"
              quality={75}
              sizes="(max-width: 768px) 100vw, 0vw"
            />
            <Image 
              src="/imagenespagina/baner5.webp" 
              alt="Banner Adicional 2"
              fill
              className="object-cover hidden md:block"
              loading="lazy"
              quality={75}
              sizes="(min-width: 768px) 100vw, 0vw"
            />
          </div>

        </div>
        <div className="swiper-button-next main-banner-next"></div>
        <div className="swiper-button-prev main-banner-prev"></div>
        <div className="swiper-pagination main-banner-pagination"></div>
      </div>
    </section>
  );
}