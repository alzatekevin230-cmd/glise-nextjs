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
        // Naturales y Homeopáticos
        'BEL COLAGMIN 300 G': { inflated: 75000, real: 60000 },
        'Red Krill 1000 mg 30 Perlas Healthy': { inflated: 95000, real:82000 }, 
        'Mega Cranberry 60 Perlas Healthy': { inflated: 78000, real: 68900 },
        
        // Dermocosméticos  
        'Serum Vitamina C': { inflated: 120000, real: 89000 },
        'Crema Hidratante': { inflated: 85000, real: 65000 },
        'Protector Solar': { inflated: 55000, real: 42000 },
        
        // Cuidado Infantil
        'Shampoo Bebé': { inflated: 35000, real: 25000 },
        'Crema Pañal': { inflated: 25000, real: 18000 },
        'Aceite Corporal': { inflated: 30000, real: 22000 },
        
        // Cuidado y Belleza
        'Mascarilla Facial': { inflated: 50000, real: 35000 },
        'Exfoliante Corporal': { inflated: 38000, real: 28000 },
        'Crema Antiedad': { inflated: 100000, real: 75000 },
        
        // Milenario
        'Aceite de Coco': { inflated: 20000, real: 15000 },
        'Miel Natural': { inflated: 16000, real: 12000 },
        'Aloe Vera': { inflated: 28000, real: 20000 }
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
      
      // Buscar productos que estén en la configuración y pertenezcan a la categoría
      Object.keys(config).forEach(productName => {
        const product = products.find(p => 
          p.category === category && 
          p.name === productName
        );
        if (product) {
          categoryProducts.push(product);
        }
      });
      
      // Si no encuentra productos específicos, usar los primeros 3
      if (categoryProducts.length === 0) {
        return products.filter(p => p.category === category).slice(0, 3);
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
        'default': {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          badge: 'bg-gray-500',
          button: 'bg-gray-600 hover:bg-gray-700'
        }
      };
      
      return colors[category] || colors['default'];
    };

    // Función para obtener productos en oferta por categoría
    const getProductsOnSale = (category) => {
      // Obtener productos seleccionados
      let categoryProducts = getSelectedProducts(category);
      
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
        ]
      };
      
      const bgColors = categoryColors[category] || [
        "bg-slate-800",
        "bg-gray-800", 
        "bg-zinc-800"
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
    'Milenario': getCategoryBanners('Milenario')
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
        640: { slidesPerView: 2, spaceBetween: 20 },
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
        <div className="swiper-container category-banners-swiper overflow-hidden rounded-2xl">
          <div className="swiper-wrapper">
            {banners.map((banner) => (
              <div key={banner.id} className="swiper-slide">
                <div className={`${categoryColor.bg} rounded-lg px-0 py-3 sm:px-6 sm:py-6 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[200px] sm:min-h-[180px] flex flex-col justify-between border ${categoryColor.border}`}>
                  {/* Contenido superior - producto e información */}
                  <div className="flex items-center gap-2 sm:gap-6">
                    {/* Imagen del producto - GRANDE a un lado */}
                    <div className="flex-shrink-0">
                      <div className="relative w-40 h-40 flex items-center justify-center">
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
                        <span className={`${categoryColor.badge} text-white px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-bold`}>
                          {banner.title}
                        </span>
                      </div>
                      
                      {/* Nombre del producto */}
                      <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight line-clamp-2">
                        {banner.subtitle}
                      </h3>
                      
                      {/* Precios */}
                      {banner.originalPrice && banner.discountedPrice && (
                        <div className="mb-2 sm:mb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sm sm:text-base text-gray-500 line-through">${Math.round(banner.originalPrice).toLocaleString('es-CO')}</span>
                            <span className="text-base sm:text-xl font-bold text-gray-900">${Math.round(banner.discountedPrice).toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botón centrado abajo */}
                  <div className="flex justify-center mt-3">
                    <a 
                      href={banner.link}
                      className={`${categoryColor.button} text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md font-semibold transition-colors duration-300 text-center text-xs sm:text-sm`}
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
