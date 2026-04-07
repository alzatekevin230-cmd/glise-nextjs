// components/FeaturedCategories.jsx
"use client";

import { useEffect } from 'react';
import AnimatedSection from './AnimatedSection';
import { FiGrid, FiFeather, FiDroplet, FiSmile, FiStar, FiHeart } from 'react-icons/fi';

// NOTA: Las importaciones de CSS de Swiper ya deben estar en tu archivo layout.js principal
// import 'swiper/css';
// import 'swiper/css/navigation';

export default function FeaturedCategories() {
  const categoriesData = [
    { 
      name: 'Todo', 
      img: '/imagenespagina/catetodos.webp', 
      link: '/categoria/all', 
      icon: FiGrid,
      circleClass: 'bg-slate-50 border-slate-200',
      iconClass: 'text-slate-700'
    },
    { 
      name: 'Natural', 
      img: '/imagenespagina/catenatural.webp', 
      link: '/categoria/Naturales y Homeopáticos', 
      icon: FiFeather,
      circleClass: 'bg-emerald-50 border-emerald-200',
      iconClass: 'text-emerald-600'
    },
    { 
      name: 'Dermocosmética', 
      img: '/imagenespagina/catedermocosmetica.webp', 
      link: '/categoria/Dermocosméticos', 
      icon: FiDroplet,
      circleClass: 'bg-sky-50 border-sky-200',
      iconClass: 'text-sky-600'
    },
    { 
      name: 'Milenario', 
      img: '/imagenespagina/catemilenario.webp', 
      link: '/categoria/Milenario', 
      icon: FiHeart,
      circleClass: 'bg-amber-50 border-amber-200',
      iconClass: 'text-amber-600'
    },
    { 
      name: 'Infantil', 
      img: '/imagenespagina/cateinfantil.webp', 
      link: '/categoria/Cuidado Infantil', 
      icon: FiSmile,
      circleClass: 'bg-pink-50 border-pink-200',
      iconClass: 'text-pink-500'
    },
    { 
      name: 'Belleza', 
      img: '/imagenespagina/catebelleza.webp', 
      link: '/categoria/Cuidado y Belleza', 
      icon: FiStar,
      circleClass: 'bg-violet-50 border-violet-200',
      iconClass: 'text-violet-600'
    }
  ];

  useEffect(() => {
    // Solo inicializamos Swiper para tablet/escritorio
    let swiperInstance = null;

    const init = async () => {
      if (typeof window === 'undefined' || window.innerWidth < 768) return;

      const [{ default: Swiper }, { Navigation, Autoplay }] = await Promise.all([
        import('swiper'),
        import('swiper/modules'),
      ]);

      swiperInstance = new Swiper('.category-discovery-carousel', {
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
    };

    init();

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  }, []);

  return (
    <>
      {/* Versión móvil: contenedor blanco con círculos de categoría (sin animación para que aparezca de una) */}
      {/* En móvil: pegado al banner arriba y un poco más de espacio hacia las tarjetas abajo */}
      <section className="-mt-1 mb-5 md:hidden">
        <div className="container mx-auto px-2 sm:px-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              ¿Qué quieres comprar hoy?
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {categoriesData.map((cat, index) => (
                <a
                  key={index}
                  href={cat.link}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`w-20 h-20 rounded-full overflow-hidden mb-1 border ${cat.circleClass}`}>
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                    {cat.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Versión escritorio/tablet: carrusel original de categorías destacadas (mantiene animación suave) */}
      <section id="category-carousel-section" className="mt-6 mb-16 hidden md:block md:mb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="slideUp" delay={200}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
              Categorías Destacadas
            </h2>
          </AnimatedSection>
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
    </>
  );
}
