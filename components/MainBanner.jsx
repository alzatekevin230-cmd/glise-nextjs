"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
        {/* Agregamos pb-5 para que el carrusel no corte la sombra con una línea recta */}
        <div className="swiper-container main-banner-carousel relative overflow-hidden pb-5 pt-2">
          <div className="swiper-wrapper">
            {/* TARJETA 1 */}
            <div className="swiper-slide !w-auto">
              {/* Capa EXTERNA: Controla el tamaño y proyecta la sombra perfecta */}
              <div className="relative aspect-[2/3] md:aspect-[1440/380] w-[65vw] md:w-[80vw] rounded-2xl shadow-lg bg-white">
                {/* Capa INTERNA: Recorte limpio nativo sin hacks */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Link 
                    href="/categoria/Milenario" 
                    className="block md:hidden absolute inset-0 z-10 rounded-2xl overflow-hidden p-0 m-0 focus:outline-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Image 
                      src="/imagenespagina/banermovil5.webp"
                      alt="Oferta en Aceites Glise"
                      fill
                      className="object-cover rounded-2xl"
                      priority
                      fetchPriority="high"
                      quality={90}
                      sizes="100vw"
                    />
                  </Link>
                  <Image 
                    src="/imagenespagina/baner1.webp" 
                    alt="Oferta en Aceites Glise"
                    fill
                    className="object-cover hidden md:block rounded-2xl"
                    priority
                    fetchPriority="high"
                    quality={90}
                    sizes="100vw"
                  />
                </div>
              </div>
          </div>

          {/* TARJETA 2 */}
          <div className="swiper-slide !w-auto">
              <div className="relative aspect-[2/3] md:aspect-[1440/380] w-[65vw] md:w-[80vw] rounded-2xl shadow-lg bg-white">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Link 
                    href="/categoria/Cuidado Infantil" 
                    className="block md:hidden absolute inset-0 z-10 rounded-2xl overflow-hidden p-0 m-0 focus:outline-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Image 
                      src="/imagenespagina/banerbaby.webp" 
                      alt="Banner Cuidado de Bebé"
                      fill
                      className="object-cover rounded-2xl"
                      loading="lazy"
                      quality={75}
                      sizes="100vw"
                    />
                  </Link>
                  <Image 
                    src="/imagenespagina/baner2.webp" 
                    alt="Banner Cuidado de Bebé"
                    fill
                    className="object-cover hidden md:block rounded-2xl"
                    loading="lazy"
                    quality={75}
                    sizes="100vw"
                  />
                </div>
              </div>
          </div>

          {/* TARJETA 3 */}
          <div className="swiper-slide !w-auto">
              <div className="relative aspect-[2/3] md:aspect-[1440/380] w-[65vw] md:w-[80vw] rounded-2xl shadow-lg bg-white">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Link 
                    href="/categoria/Naturales y Homeopáticos" 
                    className="block md:hidden absolute inset-0 z-10 rounded-2xl overflow-hidden p-0 m-0 focus:outline-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Image 
                      src="/imagenespagina/banermovil3.webp" 
                      alt="Banner Productos Naturales"
                      fill
                      className="object-cover rounded-2xl"
                      loading="lazy"
                      quality={75}
                      sizes="100vw"
                    />
                  </Link>
                  <Image 
                    src="/imagenespagina/baner3.webp" 
                    alt="Banner Productos Naturales"
                    fill
                    className="object-cover hidden md:block rounded-2xl"
                    loading="lazy"
                    quality={75}
                    sizes="100vw"
                  />
                </div>
              </div>
          </div>

          {/* TARJETA 4 */}
          <div className="swiper-slide !w-auto">
              <div className="relative aspect-[2/3] md:aspect-[1440/380] w-[65vw] md:w-[80vw] rounded-2xl shadow-lg bg-white">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Link 
                    href="/categoria/Cuidado y Belleza" 
                    className="block md:hidden absolute inset-0 z-10 rounded-2xl overflow-hidden p-0 m-0 focus:outline-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Image 
                      src="/imagenespagina/banermovil4.webp" 
                      alt="Banner Adicional 1"
                      fill
                      className="object-cover rounded-2xl"
                      loading="lazy"
                      quality={75}
                      sizes="100vw"
                    />
                  </Link>
                  <Image 
                    src="/imagenespagina/baner4.webp" 
                    alt="Banner Adicional 1"
                    fill
                    className="object-cover hidden md:block rounded-2xl"
                    loading="lazy"
                    quality={75}
                    sizes="100vw"
                  />
                </div>
              </div>
          </div>

          {/* TARJETA 5 */}
          <div className="swiper-slide !w-auto">
              <div className="relative aspect-[2/3] md:aspect-[1440/380] w-[65vw] md:w-[80vw] rounded-2xl shadow-lg bg-white">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Link 
                    href="/categoria/Dermocosméticos" 
                    className="block md:hidden absolute inset-0 z-10 rounded-2xl overflow-hidden p-0 m-0 focus:outline-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Image 
                      src="/imagenespagina/banermovil1.webp" 
                      alt="Banner Adicional 2"
                      fill
                      className="object-cover rounded-2xl"
                      loading="lazy"
                      quality={75}
                      sizes="100vw"
                    />
                  </Link>
                  <Image 
                    src="/imagenespagina/baner5.webp" 
                    alt="Banner Adicional 2"
                    fill
                    className="object-cover hidden md:block rounded-2xl"
                    loading="lazy"
                    quality={75}
                    sizes="100vw"
                  />
                </div>
              </div>
          </div>

        </div>

        {/* Paginación y navegación */}
        {/* <div className="swiper-pagination main-banner-pagination mt-4"></div> */}
        {/* Flechas eliminadas */}
      </div>    </div>    </section>
  );
}