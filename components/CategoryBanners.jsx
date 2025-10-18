// components/CategoryBanners.jsx
"use client";

import { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function CategoryBanners({ categoryName, products = [] }) {
  const swiperRef = useRef(null);

    // PRECIOS DE MARKETING - PRECIO INFLADO TACHADO Y PRECIO REAL
    const getProductConfig = () => {
      return {
        // Naturales y Homeopáticos (10 productos)
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
        
        // Dermocosméticos (10 productos)
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
        
        // Cuidado Infantil (5 productos)
        'Almipro Syndet 400 Ml': { inflated: 50000, real: 40300 },
        'Almipro Ungüento 500 g': { inflated: 85000, real: 69900 },
        'Almipro Emoliente 400g': { inflated: 42000, real: 34900 },
        'Acid Mantle Baby Crema 100 g': { inflated: 58000, real: 48300 },
        'Eucerin Baby Baño y Shampoo 250 Ml': { inflated: 85000, real: 71300 },
        
        // Cuidado y Belleza (10 productos)
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
        
        // Milenario (10 productos)
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
        
        // Tienda (20 productos - mezcla de todas las categorías)
        'BEL COLAGMIN 300 G': { inflated: 75000, real: 66900 },
        'Red Krill 1000 mg 30 Perlas Healthy': { inflated: 95000, real: 80200 },
        'Bloqueador Sol-or Family SPF50 120 g': { inflated: 70000, real: 57500 },
        'Eucerin Solar Oil Control Tinted Tono Medio 50 Ml': { inflated: 170000, real: 140800 },
        'Almipro Syndet 400 Ml': { inflated: 50000, real: 40300 },
        'Almipro Ungüento 500 g': { inflated: 85000, real: 69900 },
        'Vitybell 30 Capsulas': { inflated: 150000, real: 123200 },
        'Aceite Esencial de Lavanda 120 mL': { inflated: 80000, real: 63500 },
        'Genacol Colágeno Hidrolizado 90 Cápsulas': { inflated: 120000, real: 95500 },
        'Cerave Loción Hidratante para Piel Seca Sin Perfume 473 Ml': { inflated: 140000, real: 114200 },
        'Alitopic Leche Emoliente 500 Ml': { inflated: 150000, real: 121000 },
        'Aceite Esencial de Romero 120 mL': { inflated: 110000, real: 88400 },
        'Isdin Champu Nutradeica Anticaspa Grasa 200 Ml': { inflated: 135000, real: 110900 },
        'Aceite de Argán 120 mL': { inflated: 78000, real: 62400 },
        'Vitabiosa Natural 1000 mL': { inflated: 140000, real: 116400 },
        'Cetaphil Crema Hidratante 453 g': { inflated: 190000, real: 157300 },
        'Aceite Esencial de Menta 120 mL': { inflated: 62000, real: 49500 },
        'Folister Complex Hair Lotion 60 Ml': { inflated: 175000, real: 143000 },
        'Colágeno Hidrolizado Caja x 30 Sobres ICOM': { inflated: 140000, real: 117600 },
        'Eucerin Baby Baño y Shampoo 250 Ml': { inflated: 85000, real: 71300 }
      };
    };

    // Función para obtener descuento basado en precios de marketing
    const calculateDiscount = (product) => {
      const config = getProductConfig();
      const prices = config[product.name];
      
      if (prices) {
        const discount = Math.round(((prices.inflated - prices.real) / prices.inflated) * 100);
        return discount;
      }
      
      return 20; // 20% por defecto si no está definido
    };

    // Función para obtener productos seleccionados
    const getSelectedProducts = (category) => {
      const config = getProductConfig();
      const categoryProducts = [];
      
      if (category === 'all') {
        // Para la tienda, buscar productos de todas las categorías
        Object.keys(config).forEach(productName => {
          const product = products.find(p => p.name === productName);
          if (product) {
            categoryProducts.push(product);
          }
        });
      } else {
        // Para categorías específicas, buscar productos de esa categoría
      Object.keys(config).forEach(productName => {
        const product = products.find(p => 
          p.category === category && 
          p.name === productName
        );
        if (product) {
          categoryProducts.push(product);
        }
      });
      }
      
      // Si no encuentra productos específicos, usar los primeros productos de la categoría
      if (categoryProducts.length === 0) {
        if (category === 'all') {
          return products.filter(p => p.category !== 'all').slice(0, 20);
        } else {
        return products.filter(p => p.category === category).slice(0, 3);
        }
      }
      
      return categoryProducts;
    };

    // Función para obtener colores por categoría
    const getCategoryColor = (category) => {
      const colors = {
        'Naturales y Homeopáticos': {
          bg: 'bg-green-50',
          border: 'border-green-200',
          badge: 'bg-green-500',
          button: 'bg-green-600 hover:bg-green-700'
        },
        'Dermocosméticos': {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          badge: 'bg-purple-500',
          button: 'bg-purple-600 hover:bg-purple-700'
        },
        'Medicamentos': {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          badge: 'bg-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700'
        },
        'Cuidado Personal': {
          bg: 'bg-pink-50',
          border: 'border-pink-200',
          badge: 'bg-pink-500',
          button: 'bg-pink-600 hover:bg-pink-700'
        },
        'Suplementos': {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-500',
          button: 'bg-orange-600 hover:bg-orange-700'
        },
        'Milenario': {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          badge: 'bg-amber-500',
          button: 'bg-amber-600 hover:bg-amber-700'
        },
        'Cuidado Infantil': {
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          badge: 'bg-sky-500',
          button: 'bg-sky-600 hover:bg-sky-700'
        },
        'Cuidado y Belleza': {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          badge: 'bg-rose-500',
          button: 'bg-rose-600 hover:bg-rose-700'
        },
        'all': {
          bg: 'bg-gradient-to-br from-blue-50 to-purple-50',
          border: 'border-blue-200',
          badge: 'bg-gradient-to-r from-blue-500 to-purple-500',
          button: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        },
        'default': {
          bg: 'bg-gradient-to-br from-blue-50 to-purple-50',
          border: 'border-blue-200',
          badge: 'bg-gradient-to-r from-blue-500 to-purple-500',
          button: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }
      };
      
      return colors[category] || colors['default'];
    };

    // Función para obtener productos en oferta por categoría
    const getProductsOnSale = (category) => {
      // Obtener productos seleccionados
      let categoryProducts = getSelectedProducts(category);
      
      // Para la categoría "all" (tienda), limitar a 20 productos
      if (category === 'all') {
        categoryProducts = categoryProducts.slice(0, 20);
      }
      
      return categoryProducts.map(product => {
        const config = getProductConfig();
        const prices = config[product.name];
        
        let originalPrice, discountedPrice, discount;
        
        if (prices) {
          // Usar precios de marketing
          originalPrice = prices.inflated;  // Precio inflado tachado
          discountedPrice = prices.real;    // Precio real
          discount = calculateDiscount(product);
        } else {
          // Fallback: usar precio del producto con 20% OFF
          originalPrice = product.price;
          discountedPrice = product.price * 0.8;
          discount = 20;
        }
        
        return {
          ...product,
          originalPrice,
          discountedPrice,
          discount,
          discountText: `${discount}% OFF`
        };
      });
    };

    // Banners genéricos con productos en oferta
    const getGenericBanners = () => {
      const allProducts = products.filter(p => p.category !== 'all');
      const genericColors = [
        "bg-slate-800",
        "bg-indigo-800",
        "bg-emerald-800"
      ];
      
      const productsOnSale = allProducts.slice(0, 3).map((product, index) => {
        const config = getProductConfig();
        const prices = config[product.name];
        
        let originalPrice, discountedPrice, discount;
        
        if (prices) {
          // Usar precios de marketing
          originalPrice = prices.inflated;  // Precio inflado tachado
          discountedPrice = prices.real;    // Precio real
          discount = calculateDiscount(product);
        } else {
          // Fallback: usar precio del producto con 20% OFF
          originalPrice = product.price;
          discountedPrice = product.price * 0.8;
          discount = 20;
        }
        
        return {
          id: product.id,
          title: `¡${discount}% OFF!`,
          subtitle: product.name,
          originalPrice,
          discountedPrice,
          image: product.image || product.images?.[0] || '/imagenespagina/placeholder.jpg',
          link: `/producto/${product.slug}`,
          bgColor: genericColors[index] || genericColors[0]
        };
      });
      
      return productsOnSale;
    };

    // Función para crear banners específicos por categoría
    const getCategoryBanners = (category) => {
      const categoryProducts = getProductsOnSale(category);
      
      // Colores elegantes y profesionales por categoría
      const categoryColors = {
        'Naturales y Homeopáticos': [
          "bg-slate-800",
          "bg-gray-800", 
          "bg-zinc-800"
        ],
        'Dermocosméticos': [
          "bg-indigo-800",
          "bg-blue-800",
          "bg-sky-800"
        ],
        'Cuidado Infantil': [
          "bg-emerald-800",
          "bg-teal-800",
          "bg-cyan-800"
        ],
        'Cuidado y Belleza': [
          "bg-rose-800",
          "bg-pink-800",
          "bg-fuchsia-800"
        ],
        'Milenario': [
          "bg-purple-800",
          "bg-violet-800",
          "bg-indigo-800"
        ],
        'all': [
          "bg-gradient-to-r from-blue-600 to-purple-600",
          "bg-gradient-to-r from-emerald-600 to-teal-600",
          "bg-gradient-to-r from-orange-600 to-red-600",
          "bg-gradient-to-r from-pink-600 to-rose-600",
          "bg-gradient-to-r from-indigo-600 to-blue-600"
        ]
      };
      
      const bgColors = categoryColors[category] || [
        "bg-gradient-to-r from-blue-600 to-purple-600",
        "bg-gradient-to-r from-emerald-600 to-teal-600",
        "bg-gradient-to-r from-orange-600 to-red-600"
      ];
      
      return categoryProducts.map((product, index) => ({
        id: product.id,
        title: `¡${product.discount}% OFF!`,
        subtitle: product.name,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        image: product.image || product.images?.[0] || '/imagenespagina/placeholder.jpg',
        link: `/producto/${product.slug}`,
        bgColor: bgColors[index] || bgColors[0]
      }));
    };

  // Banners específicos por categoría
  const categoryBanners = {
    'Naturales y Homeopáticos': getCategoryBanners('Naturales y Homeopáticos'),
    'Dermocosméticos': getCategoryBanners('Dermocosméticos'),
    'Cuidado Infantil': getCategoryBanners('Cuidado Infantil'),
    'Cuidado y Belleza': getCategoryBanners('Cuidado y Belleza'),
    'Milenario': getCategoryBanners('Milenario'),
    'all': getCategoryBanners('all')
  };

  // Seleccionar banners según la categoría
  const banners = categoryBanners[categoryName] || getGenericBanners();
  const categoryColor = getCategoryColor(categoryName);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
    }

    swiperRef.current = new Swiper('.category-banners-swiper', {
      modules: [Navigation, Autoplay],
      loop: true,
      spaceBetween: 20,
      navigation: {
        nextEl: '.category-banners-next',
        prevEl: '.category-banners-prev',
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 50 },
        768: { slidesPerView: 2, spaceBetween: 60 },
        1024: { slidesPerView: 3, spaceBetween: 30 }
      }
    });

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, [categoryName]);

  return (
    <section className="mt-8 mb-12">
      <div className="container mx-auto px-1 sm:px-6 relative">
        <div className="swiper-container category-banners-swiper overflow-hidden rounded-2xl p-1">
          <div className="swiper-wrapper">
            {banners.map((banner) => (
              <div key={banner.id} className="swiper-slide">
                <div className={`${categoryColor.bg} rounded-lg px-0 py-3 sm:px-6 sm:py-6 md:px-4 md:py-4 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[200px] sm:min-h-[180px] md:min-h-[160px] flex flex-col justify-between border ${categoryColor.border}`}>
                  {/* Contenido superior - producto e información */}
                  <div className="flex items-center gap-2 sm:gap-6">
                    {/* Imagen del producto - GRANDE a un lado */}
                    <div className="flex-shrink-0">
                      <div className="relative w-40 h-40 md:w-32 md:h-32 flex items-center justify-center">
                        <img 
                          src={banner.image} 
                          alt={banner.subtitle}
                          className="max-w-full max-h-full object-contain drop-shadow-lg"
                        />
                      </div>
                    </div>
                    
                    {/* Contenido del banner - al lado del producto */}
                    <div className="flex-grow flex flex-col justify-start">
                      {/* Badge de descuento */}
                      <div className="mb-3 sm:mb-3">
                        <span className={`${categoryColor.badge} text-white px-3 py-2 sm:px-6 sm:py-3 md:px-4 md:py-2 rounded-full text-sm sm:text-lg md:text-sm font-bold`}>
                          {banner.title}
                        </span>
                      </div>
                      
                      {/* Nombre del producto */}
                      <h3 className="text-base sm:text-xl md:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-2 leading-tight line-clamp-2">
                        {banner.subtitle}
                      </h3>
                      
                      {/* Precios */}
                      {banner.originalPrice && banner.discountedPrice && (
                        <div className="mb-2 sm:mb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sm sm:text-base md:text-xs text-gray-500 line-through">${Math.round(banner.originalPrice).toLocaleString('es-CO')}</span>
                            <span className="text-base sm:text-xl md:text-sm font-bold text-gray-900">${Math.round(banner.discountedPrice).toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botón centrado abajo */}
                  <div className="flex justify-center mt-3">
                    <a 
                      href={banner.link}
                      className={`${categoryColor.button} text-white px-4 py-2 sm:px-6 sm:py-3 md:px-4 md:py-2 rounded-md font-semibold transition-colors duration-300 text-center text-xs sm:text-sm md:text-xs`}
                    >
                      Ver Producto
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="swiper-button-next category-banners-next text-gray-600"></div>
        <div className="swiper-button-prev category-banners-prev text-gray-600"></div>
      </div>
    </section>
  );
}
