// components/ShopByBrand.jsx
"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function ShopByBrand() {
  useEffect(() => {
    // Swiper initialization remains the same
    const brandSwiper = new Swiper('.brand-carousel', {
      modules: [Navigation, Autoplay],
      loop: true,
      spaceBetween: 20,
      autoplay: { delay: 3000, disableOnInteraction: false },
      navigation: { nextEl: '.brand-next', prevEl: '.brand-prev' },
      observer: true,
      observeParents: true,
      slidesPerView: 2.5,
      breakpoints: {
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 }
      }
    });
  }, []);

  const brands = [
    { name: 'NIVEA', logo: '/imagenespagina/logonivea.png', link: '/marca/NIVEA' },
    { name: 'EUCERIN', logo: '/imagenespagina/logoeucerin.png', link: '/marca/EUCERIN' },
    { name: 'ISDIN', logo: '/imagenespagina/logoisdin.png', link: '/marca/ISDIN' },
    { name: 'CERAVE', logo: '/imagenespagina/logocerave.png', link: '/marca/CERAVE' },
    { name: 'HEEL', logo: '/imagenespagina/logoheel.png', link: '/marca/HEEL' },
    { name: 'FUNAT', logo: '/imagenespagina/logofunat.png', link: '/marca/FUNAT' },
    { name: 'DERMANAT', logo: '/imagenespagina/logodermanat.png', link: '/marca/DERMANAT' },
    { name: 'ALMIPRO', logo: '/imagenespagina/logoalmipro.png', link: '/marca/ALMIPRO' },
    { name: 'GLISÉ', logo: '/imagenespagina/logodeglise.png', link: '/marca/GLISÉ' }
  ];

  return (
    // The main section container is correct
    <section className="container mx-auto px-4 sm:px-6 mb-16 md:mb-24">
      
      {/* --- CAMBIO: Hemos eliminado el <div> intermedio con fondo blanco --- */}
      
      {/* El título ahora es un hijo directo de la sección */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Compra por Marca</h2>
      
      {/* El contenedor del carrusel también es un hijo directo */}
      <div className="relative">
        <div className="swiper-container brand-carousel overflow-hidden py-0">
          <div className="swiper-wrapper items-center">
            
            {brands.map((brand) => (
              <Link href={brand.link} key={brand.name} className="swiper-slide brand-item flex justify-center">
                <Image 
                  src={brand.logo} 
                  alt={brand.name} 
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </Link>
            ))}

          </div>
        </div>
        <div className="swiper-button-next brand-next"></div>
        <div className="swiper-button-prev brand-prev"></div>
      </div>

    </section>
  );
}