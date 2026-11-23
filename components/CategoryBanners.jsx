"use client";

import { useEffect, useRef, useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
import { FaChevronRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import { getImageUrl } from '@/lib/imageUtils';
import { useFavorites } from '@/hooks/useFavorites';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';

export default function CategoryBanners({ categoryName, products = [] }) {
  const swiperRef = useRef(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const categoryTitles = {
    'Milenario': 'Aceites',
    'Naturales y Homeopáticos': 'Salud Natural',
    'Dermocosméticos': 'Cuidado de la Piel',
    'Cuidado Infantil': 'Mundo Bebé',
    'Cuidado y Belleza': 'Rutina de Belleza',
    'Medicamentos': 'Farmacia',
    'Suplementos': 'Vitalidad',
    'Cuidado Personal': 'Higiene Personal',
    'all': 'Destacados'
  };

  const displayTitle = categoryTitles[categoryName] || categoryName;

  const categoryBackgrounds = {
    'Milenario': '#c8e6a0',
    'Naturales y Homeopáticos': '#d4edda',
    'Dermocosméticos': '#e2e3ff',
    'Cuidado Infantil': '#e0f2fe',
    'Cuidado y Belleza': '#f8d7da',
    'Medicamentos': '#cce5ff',
    'Suplementos': '#ffe5d0',
    'Cuidado Personal': '#e0cffc',
    'all': '#fef3c7'
  };

  const bgColor = categoryBackgrounds[categoryName] || '#f0f0f0';

  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const normalized = products
      .filter(p => p && p.stock > 0)
      .map(product => {
        const displayPrice = Number(product.price) || 0;
        const oldPrice = Number(product.oldPrice || product.originalPrice) || Math.round(displayPrice * 1.3);
        const discount = oldPrice > displayPrice
          ? Math.round(((oldPrice - displayPrice) / oldPrice) * 100)
          : 0;

        return {
          ...product,
          displayPrice,
          oldPrice,
          discount,
          image: getImageUrl(product.image || product.images?.[0] || '/imagenespagina/placeholder.jpg')
        };
      });

    if (categoryName === 'all') {
      const byCategory = normalized.reduce((acc, p) => {
        const cat = p.category || 'Otros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
      }, {});

      const categoryLists = Object.values(byCategory).map(list =>
        [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 3)
      );

      // Intercalar categorías de forma estable (evita diferencias SSR/cliente)
      const mixed = [];
      for (let i = 0; i < 3; i++) {
        for (const list of categoryLists) {
          if (list[i]) mixed.push(list[i]);
        }
      }

      return mixed.slice(0, 15);
    }

    const filtered = normalized.filter(p => p.category === categoryName);
    return filtered
      .sort((a, b) => a.displayPrice - b.displayPrice)
      .slice(0, 12);
  }, [products, categoryName]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
      swiperRef.current = null;
    }

    if (featuredProducts.length === 0) return;

    swiperRef.current = new Swiper('.category-banners-swiper', {
      modules: [Navigation, Autoplay],
      slidesPerView: 'auto',
      spaceBetween: 16,
      slidesOffsetBefore: 20,
      slidesOffsetAfter: 20,
      resistance: true,
      resistanceRatio: 0,
      navigation: {
        nextEl: navigationNextRef.current,
        prevEl: navigationPrevRef.current,
      },
      breakpoints: {
        640: { spaceBetween: 20, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
        768: { spaceBetween: 20, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
        1024: { spaceBetween: 24, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
        1280: { spaceBetween: 24, slidesOffsetBefore: 0, slidesOffsetAfter: 0 }
      }
    });

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [categoryName, featuredProducts]);

  if (featuredProducts.length === 0) return null;

  const isMilenario = categoryName === 'Milenario';

  const containerStyle = isMilenario
    ? {
        background: 'linear-gradient(135deg, #B8C7A8 0%, #7F966F 50%, #617A55 100%)',
      }
    : { backgroundColor: bgColor };

  const titleClasses = isMilenario
    ? 'text-3xl sm:text-4xl font-bold text-white capitalize tracking-wide'
    : 'text-xl sm:text-2xl font-bold text-gray-800 capitalize';

  return (
    <section className="mt-6 mb-10">
      <div className="">
        <div
          className="-mx-2 sm:-mx-6 md:mx-0 rounded-none md:rounded-[16px] py-2 px-0 md:p-6 relative"
          style={containerStyle}
        >
          <div className="flex justify-between items-center mb-2 px-5 md:px-0">
            <div>
              <h2 className={titleClasses}>
                {displayTitle}
              </h2>
              {isMilenario && (
                <p className="mt-1 text-sm text-white/90 sm:text-base">
                  Ingredientes naturales para tu cuidado
                </p>
              )}
            </div>
          </div>

          <div className="swiper-container category-banners-swiper overflow-hidden min-h-[280px] sm:min-h-[320px]">
            <div className="swiper-wrapper">
              {featuredProducts.map((product) => {
                const favorite = isFavorite(product.id);
                return (
                  <div key={product.id} className="swiper-slide !w-[42%] sm:!w-[42%] md:!w-[30%] lg:!w-[23%] xl:!w-[18%] h-auto">
                    <Link href={`/producto/${product.slug}`} className="block h-full">
                      <div className="bg-white rounded-xl h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className="absolute top-2 left-2 z-10 p-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                          aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                          {favorite ? (
                            <FaHeart className="w-6 h-6 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-6 h-6" />
                          )}
                        </button>

                        {product.discount > 0 && (
                          <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md">
                            -{product.discount}%
                          </div>
                        )}

                        <div className="w-full h-44 sm:h-48 flex items-center justify-center bg-gray-100 p-1">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain scale-105 hover:scale-110 transition-transform duration-300 mix-blend-multiply"
                          />
                        </div>

                        <div className="flex flex-col flex-grow p-3">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5em]">
                            {product.name}
                          </h3>

                          <div className="mt-auto">
                            {product.oldPrice > product.displayPrice && (
                              <p className="text-sm text-gray-400 font-medium">
                                Antes: <span className="line-through">${Math.round(product.oldPrice).toLocaleString('es-CO')}</span>
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
                                ${Math.round(product.displayPrice).toLocaleString('es-CO')}
                              </span>
                              <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm transform -rotate-2">
                                AHORA
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            ref={navigationNextRef}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none transition-all hidden md:flex items-center justify-center border border-gray-100 hover:scale-110"
            aria-label="Siguiente"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>

          <button
            ref={navigationPrevRef}
            className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none transition-all hidden md:flex items-center justify-center border border-gray-100 hover:scale-110 disabled:opacity-0"
            aria-label="Anterior"
          >
            <FaChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}