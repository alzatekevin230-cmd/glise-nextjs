// components/BrandHero.jsx
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCrown, FaStar, FaGlobe, FaBoxOpen, FaTags, FaInfoCircle } from 'react-icons/fa';

export default function BrandHero({ brandName, productsCount, minPrice, maxPrice, bannerImages }) {
  // Información específica de cada marca
  const brandInfo = {
    'NIVEA': {
      logo: '/imagenespagina/logonivea.webp',
      description: 'Cuidado de la piel de calidad alemana desde 1911. Productos dermatológicamente probados y reconocidos mundialmente.',
      tagline: 'Más de 100 años cuidando tu piel',
      isPremium: true,
      isBestSeller: true,
      founded: '1911',
      country: 'Alemania',
      gradient: 'from-blue-600 to-blue-800'
    },
    'EUCERIN': {
      logo: '/imagenespagina/logoeucerin.webp',
      description: 'Marca líder en cuidado dermatológico respaldada por más de 100 años de experiencia en ciencia de la piel.',
      tagline: 'Ciencia dermatológica de confianza',
      isPremium: true,
      isBestSeller: true,
      founded: '1900',
      country: 'Alemania',
      gradient: 'from-cyan-600 to-blue-700'
    },
    'ISDIN': {
      logo: '/imagenespagina/logoisdin.webp',
      description: 'Innovación española en fotoprotección y dermocosmética. Líderes en protección solar con textura única.',
      tagline: 'Innovación para el cuidado de tu piel',
      isPremium: true,
      isBestSeller: true,
      founded: '1975',
      country: 'España',
      gradient: 'from-orange-500 to-red-600'
    },
    'CERAVE': {
      logo: '/imagenespagina/logocerave.webp',
      description: 'Desarrollado con dermatólogos. Fórmulas con ceramidas esenciales para restaurar y mantener la barrera natural de la piel.',
      tagline: 'Desarrollado con dermatólogos',
      isPremium: true,
      isBestSeller: true,
      founded: '2005',
      country: 'USA',
      gradient: 'from-blue-500 to-indigo-600'
    },
    'HEEL': {
      logo: '/imagenespagina/logoheel.webp',
      description: 'Medicina biorreguladora alemana. Más de 80 años de experiencia en salud natural y tratamientos homeopáticos.',
      tagline: 'Medicina natural de calidad',
      isPremium: true,
      isBestSeller: true,
      founded: '1936',
      country: 'Alemania',
      gradient: 'from-green-600 to-emerald-700'
    },
    'FUNAT': {
      logo: '/imagenespagina/logofunat.webp',
      description: 'Productos naturales colombianos de alta calidad. Tradición y naturaleza en cada fórmula.',
      tagline: 'Naturaleza colombiana para tu bienestar',
      isPremium: false,
      isBestSeller: true,
      founded: '1990',
      country: 'Colombia',
      gradient: 'from-green-500 to-teal-600'
    },
    'DERMANAT': {
      logo: '/imagenespagina/logodermanat.webp',
      description: 'Dermocosmética natural. Productos formulados con ingredientes naturales para el cuidado integral de tu piel.',
      tagline: 'Dermocosmética natural y efectiva',
      isPremium: false,
      isBestSeller: false,
      founded: '2000',
      country: 'Colombia',
      gradient: 'from-emerald-300 to-teal-400'
    },
    'ALMIPRO': {
      logo: '/imagenespagina/logoalmipro.webp',
      description: 'Cuidado especializado para bebés y niños. Productos hipoalergénicos y dermatológicamente probados.',
      tagline: 'Cuidado suave para los más pequeños',
      isPremium: false,
      isBestSeller: true,
      founded: '2010',
      country: 'Colombia',
      gradient: 'from-pink-500 to-rose-600'
    },
    'GLISÉ': {
      logo: '/imagenespagina/logodeglise.webp',
      description: 'Aceites esenciales y productos naturales de la más alta calidad. Tradición aromática colombiana.',
      tagline: 'Aromaterapia y naturaleza pura',
      isPremium: false,
      isBestSeller: true,
      founded: '1985',
      country: 'Colombia',
      gradient: 'from-purple-600 to-indigo-700'
    }
  };

  // Normalizar el nombre de la marca para buscar en brandInfo
  const normalizedBrandName = brandName.toUpperCase();
  
  const info = brandInfo[normalizedBrandName] || {
    logo: null,
    description: `Productos de calidad de ${brandName}`,
    tagline: 'Calidad y confianza',
    isPremium: false,
    isBestSeller: false,
    gradient: 'from-blue-600 to-indigo-700'
  };

  const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Tarjeta principal con gradient */}
      <div className={`relative bg-gradient-to-br ${info.gradient} rounded-2xl shadow-2xl overflow-hidden mb-6`}>
        
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative p-4 sm:p-6 md:p-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
            
            {/* Logo grande en tarjeta blanca - MÁS PEQUEÑO EN MÓVIL */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
              className="flex-shrink-0"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-[200px] sm:w-[240px] md:w-[280px] h-[140px] sm:h-[170px] md:h-[200px] flex items-center justify-center">
                {info.logo ? (
                  <Image
                    src={info.logo}
                    alt={`Logo ${brandName}`}
                    width={240}
                    height={140}
                    className="object-contain w-[160px] sm:w-[200px] md:w-[240px] h-auto"
                    priority
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{brandName}</h1>
                )}
              </div>
            </motion.div>

            {/* Información de la marca */}
            <div className="flex-1 text-center lg:text-left w-full">
              
              {/* Tagline - MÁS PEQUEÑO EN MÓVIL */}
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-semibold mb-3 sm:mb-4"
              >
                {info.tagline}
              </motion.p>

              {/* Badges - MÁS PEQUEÑOS EN MÓVIL */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 justify-center lg:justify-start"
              >
                {info.isPremium && (
                  <span className="bg-yellow-400 text-black px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg">
                    <FaCrown className="text-xs sm:text-sm" />
                    <span className="hidden xs:inline">Marca </span>Premium
                  </span>
                )}
                {info.isBestSeller && (
                  <span className="bg-white text-gray-900 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg">
                    <FaStar className="text-yellow-500 text-xs sm:text-sm" />
                    Más Vendida
                  </span>
                )}
                {info.founded && (
                  <span className="bg-white/20 backdrop-blur-sm text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold border-2 border-white/30">
                    <span className="hidden xs:inline">Desde </span>{info.founded}
                  </span>
                )}
                {info.country && (
                  <span className="bg-white/20 backdrop-blur-sm text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-2 border-white/30">
                    <FaGlobe className="text-xs sm:text-sm" />
                    {info.country}
                  </span>
                )}
              </motion.div>

              {/* Stats en tarjetas - OCULTAS EN MÓVIL */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6"
              >
                {/* Total productos */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaBoxOpen className="text-lg sm:text-2xl text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/80 text-xs sm:text-sm">Total Productos</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white">{productsCount}</p>
                    </div>
                  </div>
                </div>

                {/* Rango de precios */}
                {minPrice && maxPrice && (
                  <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaTags className="text-lg sm:text-2xl text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/80 text-xs sm:text-sm">Rango de Precios</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                          {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección "Sobre la marca" mejorada - MÁS COMPACTA EN MÓVIL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${info.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
            <FaInfoCircle className="text-lg sm:text-2xl text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Sobre {brandName}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              {info.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
