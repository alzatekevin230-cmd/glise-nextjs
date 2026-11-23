"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BANNER_SLIDES = [
  {
    href: '/categoria/Milenario',
    mobileSrc: '/imagenespagina/banermovil5.webp',
    desktopSrc: '/imagenespagina/baner1.webp',
    alt: 'Oferta en Aceites Glise',
    priority: true,
    quality: 90,
  },
  {
    href: '/categoria/Cuidado Infantil',
    mobileSrc: '/imagenespagina/banerbaby.webp',
    desktopSrc: '/imagenespagina/baner2.webp',
    alt: 'Banner Cuidado de Bebé',
    priority: false,
    quality: 75,
  },
  {
    href: '/categoria/Naturales y Homeopáticos',
    mobileSrc: '/imagenespagina/banermovil3.webp',
    desktopSrc: '/imagenespagina/baner3.webp',
    alt: 'Banner Productos Naturales',
    priority: false,
    quality: 75,
  },
  {
    href: '/categoria/Cuidado y Belleza',
    mobileSrc: '/imagenespagina/banermovil4.webp',
    desktopSrc: '/imagenespagina/baner4.webp',
    alt: 'Banner Cuidado y Belleza',
    priority: false,
    quality: 75,
  },
  {
    href: '/categoria/Dermocosméticos',
    mobileSrc: '/imagenespagina/banermovil1.webp',
    desktopSrc: '/imagenespagina/baner5.webp',
    alt: 'Banner Dermocosméticos',
    priority: false,
    quality: 75,
  },
];

export default function MainBanner() {
  useEffect(() => {
    let swiper = null;

    const init = async () => {
      const [{ default: Swiper }, { Navigation, Pagination, Autoplay }] = await Promise.all([
        import('swiper'),
        import('swiper/modules'),
      ]);

      swiper = new Swiper('.main-banner-carousel', {
        modules: [Navigation, Pagination, Autoplay],
        loop: false,
        speed: 800,
        slidesPerView: 'auto',
        spaceBetween: 10,
        slidesOffsetAfter: 0,
        autoplay: false,
        pagination: {
          el: '.main-banner-pagination',
          enabled: false
        },
        centeredSlides: false,
        resistanceRatio: 0,
        touchEventsTarget: 'container',
        simulateTouch: true,
        touchRatio: 1,
        grabCursor: true,
        allowTouchMove: true
      });
    };

    init();
    
    return () => {
      if (swiper) swiper.destroy();
    };
  }, []);

  return (
    <section className="-mt-5 md:mt-0 mb-0 md:mb-12">
      <div className="px-2 sm:px-4">
        <div className="swiper-container main-banner-carousel relative overflow-hidden pb-5 pt-2">
          <div className="swiper-wrapper">
            {BANNER_SLIDES.map((slide) => (
              <div key={slide.href} className="swiper-slide !w-auto">
                <div className="relative aspect-[2/3] md:aspect-[1440/380] w-[75vw] md:w-[80vw] rounded-2xl shadow-lg bg-white">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Link
                      href={slide.href}
                      className="block absolute inset-0 z-10 rounded-2xl overflow-hidden p-0 m-0 focus:outline-none"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Image
                        src={slide.mobileSrc}
                        alt={slide.alt}
                        fill
                        className="object-cover block md:hidden rounded-2xl"
                        priority={slide.priority}
                        loading={slide.priority ? undefined : 'lazy'}
                        fetchPriority={slide.priority ? 'high' : undefined}
                        quality={slide.quality}
                        sizes="100vw"
                      />
                      <Image
                        src={slide.desktopSrc}
                        alt={slide.alt}
                        fill
                        className="object-cover hidden md:block rounded-2xl"
                        priority={slide.priority}
                        loading={slide.priority ? undefined : 'lazy'}
                        fetchPriority={slide.priority ? 'high' : undefined}
                        quality={slide.quality}
                        sizes="100vw"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}