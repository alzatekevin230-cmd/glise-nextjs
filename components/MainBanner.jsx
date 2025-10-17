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
      modules: [Navigation, Pagination, Autoplay, EffectFade],
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.main-banner-pagination', clickable: true },
      navigation: { nextEl: '.main-banner-next', prevEl: '.main-banner-prev' },
    });
  }, []);

  return (
    <section className="mb-12">
      <div className="swiper-container main-banner-carousel rounded-lg overflow-hidden shadow-lg relative">
        <div className="swiper-wrapper">

          {/* --- SLIDE 1 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture>
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
            <picture>
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner2.webp" />
              <Image 
                src="/imagenespagina/banermovil2.webp" 
                alt="Banner Cuidado de Bebé"
                fill
                className="object-cover"
                loading="lazy"
              />
            </picture>
          </div>
          
          {/* --- SLIDE 3 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture>
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner3.webp" />
              <Image 
                src="/imagenespagina/banermovil3.webp" 
                alt="Banner Productos Naturales"
                fill
                className="object-cover"
                loading="lazy"
              />
            </picture>
          </div>
          
          {/* --- SLIDE 4 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture>
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner4.webp" />
              <Image 
                src="/imagenespagina/banermovil4 .webp" 
                alt="Banner Adicional 1"
                fill
                className="object-cover"
                loading="lazy"
              />
            </picture>
          </div>

          {/* --- SLIDE 5 --- */}
          <div className="swiper-slide relative aspect-[800/600] md:aspect-[1440/380]">
            <picture>
              <source media="(min-width: 768px)" srcSet="/imagenespagina/baner5.webp" />
              <Image 
                src="/imagenespagina/banermovil5.webp" 
                alt="Banner Adicional 2"
                fill
                className="object-cover"
                loading="lazy"
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