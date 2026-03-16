"use client";

import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import { getImageUrl } from '@/lib/imageUtils';

export default function CategoryBanners({ categoryName, products = [] }) {
  const swiperRef = useRef(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [swiperInitialized, setSwiperInitialized] = useState(false);

  // Mapeo de Títulos de Categoría
  const categoryTitles = {
    'Milenario': 'Aceites Esenciales',
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

  // Configuración de Colores de Fondo (Pasteles)
  const categoryBackgrounds = {
    'Milenario': '#c8e6a0', // Verde pastel (ejemplo usuario)
    'Naturales y Homeopáticos': '#d4edda', // Verde muy claro
    'Dermocosméticos': '#e2e3ff', // Azul lavanda suave
    'Cuidado Infantil': '#e0f2fe', // Azul bebé
    'Cuidado y Belleza': '#f8d7da', // Rosa suave
    'Medicamentos': '#cce5ff', // Azul suave
    'Suplementos': '#ffe5d0', // Naranja suave
    'Cuidado Personal': '#e0cffc', // Violeta suave
    // Para "Tienda" usamos un amarillo muy claro diferente a las demás
    'all': '#fef3c7'
  };

  const bgColor = categoryBackgrounds[categoryName] || '#f0f0f0';

  // Configuración de precios (Manteniendo lógica de negocio existente)
  const getProductConfig = () => {
     return {
        // Naturales y Homeopáticos
        'BEL COLAGMIN 300 G': { inflated: 75000, real: 66900 },
        'Red Krill 1000 mg 30 Perlas Healthy': { inflated: 95000, real: 80200 }, 
        'Mega Cranberry 60 Perlas Healthy': { inflated: 78000, real: 68900 },
        'Genacol Colágeno Hidrolizado 90 Cápsulas': { inflated: 120000, real: 95500 },
        'Colágeno Hidrolizado Caja x 30 Sobres ICOM': { inflated: 140000, real: 117600 },
        'Vitabiosa Natural 1000 mL': { inflated: 140000, real: 116400 },
        'Omega 3 + Vitamina E Botanitas Cápsulas Blandas Frasco X 100': { inflated: 75000, real: 62000 },
        'Vitamina D3 2000ui 90 Tabletas Medick': { inflated: 32000, real: 26500 },
        'Climaterix 60 Perlas Healthy America': { inflated: 95000, real: 80200 },
        'Collagen Biotin Complex 60 Perlas Healthy America': { inflated: 80000, real: 66600 },
        
        // Dermocosméticos
        'Bloqueador Sol-or Family SPF50 120 g': { inflated: 70000, real: 57500 },
        'Eucerin Solar Oil Control Tinted Tono Medio 50 Ml': { inflated: 170000, real: 140800 },
        'Eucerin Ph5 Loción 400 Ml': { inflated: 150000, real: 124300 },
        'Cerave Loción Hidratante para Piel Seca Sin Perfume 473 Ml': { inflated: 140000, real: 114200 },
        'Alitopic Leche Emoliente 500 Ml': { inflated: 150000, real: 121000 },
        'Isdin Champu Nutradeica Anticaspa Grasa 200 Ml': { inflated: 135000, real: 110900 },
        'Si Nails Varnish 2.5 mL Isdin': { inflated: 140000, real: 114000 },
        'Acuanova Care Crema 220 g': { inflated: 170000, real: 137000 },
        'Finura Antioxidantech 60 Tabletas Recubiertas': { inflated: 180000, real: 150700 },
        'Cetaphil Crema Hidratante 453 g': { inflated: 190000, real: 157300 },
        
        // Cuidado Infantil
        'Almipro Syndet 400 Ml': { inflated: 50000, real: 40300 },
        'Almipro Ungüento 500 g': { inflated: 85000, real: 69900 },
        'Almipro Emoliente 400g': { inflated: 42000, real: 34900 },
        'Acid Mantle Baby Crema 100 g': { inflated: 58000, real: 48300 },
        'Eucerin Baby Baño y Shampoo 250 Ml': { inflated: 85000, real: 71300 },
        
        // Cuidado y Belleza
        'Vitybell 30 Capsulas': { inflated: 150000, real: 123200 },
        'Biocicar Crema 60 g': { inflated: 45000, real: 37200 },
        'Folister Complex Hair Lotion 60 Ml': { inflated: 175000, real: 143000 },
        'Alitopic Crema Emoliente 250 g': { inflated: 145000, real: 119400 },
        'Salilex Barra Limpiadora 120 g': { inflated: 85000, real: 71200 },
        'Alitopic Desodorante Roll-On para Axilas Sensibles 90 Ml': { inflated: 80000, real: 67000 },
        'Champu Alitopic con Extracto de Avena 150 Ml': { inflated: 105000, real: 87600 },
        'Repitel Crema 50 Ml': { inflated: 87000, real: 72600 },
        'Hydroclor Unguento Emoliente 500 g': { inflated: 130000, real: 105700 },
        'Eucerin Ph5 Aceite para Ducha 200 mL': { inflated: 115000, real: 95500 },
        
        // Milenario
        'Aceite Esencial de Naranja 120 mL': { inflated: 45000, real: 36000 },
        'Aceite Árbol de Te 120 mL': { inflated: 70000, real: 55900 },
        'Aceite Esencial de Lavanda 120 mL': { inflated: 80000, real: 63500 },
        'Aceite Esencial de Romero 120 mL': { inflated: 110000, real: 88400 },
        'Aceite Esencial de Menta 120 mL': { inflated: 62000, real: 49500 },
        'Aceite de Almendras 500 mL': { inflated: 24000, real: 19200 },
        'Aceite de Pata 500 mL': { inflated: 22000, real: 17200 },
        'Aceite de Rosa Mosqueta 18 mL': { inflated: 26000, real: 21300 },
        'Aceite de Argán 120 mL': { inflated: 78000, real: 62400 },
        'Aceite de Coco Refinado Desodorizado 500 mL': { inflated: 30000, real: 24450 },
      };
  };

  const featuredProducts = (() => {
    if (!products || products.length === 0) return [];

    const config = getProductConfig();

    // Normalizar productos con precio e imagen calculados
    const normalized = products
      .filter(p => p && p.stock > 0)
      .map(product => {
        const prices = config[product.name];
        const price = prices ? prices.real : product.price;

        return {
          ...product,
          displayPrice: price,
          image: getImageUrl(product.image || product.images?.[0] || '/imagenespagina/placeholder.jpg')
        };
      });

    // Caso especial: categoría "all" (Tienda)
    if (categoryName === 'all') {
      // Agrupar por categoría y tomar hasta 3 productos de cada una
      const byCategory = normalized.reduce((acc, p) => {
        const cat = p.category || 'Otros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
      }, {});

      let mixed = [];
      Object.values(byCategory).forEach(list => {
        // Ordenar por precio (o popularidad si la tienes) y tomar hasta 3
        const sorted = [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        mixed.push(...sorted.slice(0, 3));
      });

      // Mezclar el array resultante para que queden "revueltos"
      for (let i = mixed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
      }

      // Limitar a un máximo de 15 productos para el carrusel
      return mixed.slice(0, 15);
    }

    // Resto de categorías: comportamiento original (filtrar por categoría y ordenar por precio)
    const filtered = normalized.filter(p => p.category === categoryName);

    return filtered
      .sort((a, b) => a.displayPrice - b.displayPrice)
      .slice(0, 12);
  })();
  
  // Si no hay productos, no mostramos nada
  if (featuredProducts.length === 0) return null;

  useEffect(() => {
    if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
    }

    const init = async () => {
      if (featuredProducts.length === 0) return;

      const [{ default: Swiper }, { Navigation, Autoplay }] = await Promise.all([
        import('swiper'),
        import('swiper/modules'),
      ]);

      swiperRef.current = new Swiper('.category-banners-swiper', {
        modules: [Navigation, Autoplay],
        spaceBetween: 16,
        slidesPerView: 2.5, // Mobile: 2.5 cards visible
        slidesOffsetBefore: 20, // Mobile: Padding for first card
        slidesOffsetAfter: 20,
        navigation: {
          nextEl: navigationNextRef.current,
          prevEl: navigationPrevRef.current,
        },
        breakpoints: {
          640: { slidesPerView: 2.2, spaceBetween: 20, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
          768: { slidesPerView: 3.2, spaceBetween: 20, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
          1024: { slidesPerView: 4, spaceBetween: 24, slidesOffsetBefore: 0, slidesOffsetAfter: 0 }, // Desktop Grid look (4 items)
          1280: { slidesPerView: 5, spaceBetween: 24, slidesOffsetBefore: 0, slidesOffsetAfter: 0 }
        }
      });

      setSwiperInitialized(true);
    };

    init();

    return () => {
        if (swiperRef.current) {
            swiperRef.current.destroy(true, true);
        }
    };
  }, [categoryName, featuredProducts]);

  return (
    <section className="mt-6 mb-10">
      <div className="">
        
        {/* Contenedor Principal con Fondo y Bordes Redondeados */}
        <div 
          className="-mx-2 sm:-mx-6 md:mx-0 rounded-none md:rounded-[16px] py-2 px-0 md:p-6 relative"
          style={{ backgroundColor: bgColor }}
        >
          {/* Header: Título y Ver Todo (Ahora dentro del contenedor) */}
          <div className="flex justify-between items-center mb-2 px-5 md:px-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
              {displayTitle}
            </h2>
          </div>

          <div className="swiper-container category-banners-swiper overflow-hidden">
            <div className="swiper-wrapper">
              {featuredProducts.map((product) => (
                <div key={product.id} className="swiper-slide h-auto">
                   {/* Tarjeta Blanca */}
                   <Link href={`/producto/${product.slug}`} className="block h-full">
                      {/* Tarjeta con estilos originales, pero producto ligeramente más grande */}
                      <div className="bg-white rounded-xl h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
                        
                        {/* Badge de Descuento */}
                        <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full shadow-md">
                            -5%
                        </div>

                        {/* Imagen Arriba con Fondo Gris (mismo alto original, producto un poco más grande) */}
                        <div className="w-full h-44 sm:h-48 flex items-center justify-center bg-gray-100 p-1">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="max-w-full max-h-full object-contain scale-105 hover:scale-110 transition-transform duration-300 mix-blend-multiply"
                            />
                        </div>

                        {/* Contenido Texto (Fondo Blanco) */}
                        <div className="flex flex-col flex-grow p-3">
                            {/* Nombre del Producto */}
                            <h3 className="text-xs sm:text-base font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5em]">
                                {product.name}
                            </h3>
                            
                            {/* Precio Abajo */}
                            <div className="mt-auto">
                                <span className="text-lg sm:text-xl font-extrabold text-gray-900 block">
                                    ${Math.round(product.displayPrice).toLocaleString('es-CO')}
                                </span>
                            </div>
                        </div>
                      </div>
                   </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Botón Navegación Personalizado (Derecha) */}
          <button 
             ref={navigationNextRef}
             className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none transition-all hidden md:flex items-center justify-center border border-gray-100 hover:scale-110"
             aria-label="Siguiente"
          >
             <FaChevronRight className="w-4 h-4" />
          </button>
          
          {/* Botón Anterior (Opcional, oculto por defecto según diseño pedido pero útil) */}
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