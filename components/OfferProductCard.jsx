"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '@/hooks/useFavorites';

export default function OfferProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (product?.id) {
      setFavorite(isFavorite(product.id));
    }
  }, [isFavorite, product]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product?.id) {
      toggleFavorite(product.id);
      setFavorite(!favorite);
    }
  };

  if (!product) return null;

  // --- LÓGICA DE PRECIOS ---
  const precioActual = product.price || 0;
  const precioFixed = precioActual.toFixed(2);
  const [enteros, decimales] = precioFixed.split('.');

  // --- LÓGICA DE BADGES ---
  const precioAnterior = product.oldPrice || product.originalPrice || (precioActual * 1.35);
  const tieneDescuentoAlto = ((precioAnterior - precioActual) / precioAnterior) > 0.4;
  const isLiquidacion = product.tieneLiquidacion || product.isClearance || tieneDescuentoAlto;
  const isBadgeDorado = product.tieneBadgeDorado || product.isFeatured || (product.popularity > 80);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative flex flex-col h-[300px] bg-white border border-[#e0e0e0] rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      
      {/* --- SECCIÓN IMAGEN (160-180px) --- */}
      <div className="relative w-full h-[170px] bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
        
        {/* Badge Liquidación */}
        {isLiquidacion && (
          <div className="absolute top-3 left-3 z-20 bg-transparent border border-[#0071ce] text-[#0071ce] text-[11px] font-bold px-2 py-1 rounded-md">
            Precio reducido
          </div>
        )}

        {/* Botón Favoritos (esquina superior derecha) */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#d0d0d0] hover:border-[#0F7F0F] transition-colors"
          aria-label="Agregar a favoritos"
        >
          {favorite ? (
            <FaHeart className="w-4 h-4 text-red-600" />
          ) : (
            <FaRegHeart className="w-4 h-4 text-black" />
          )}
        </button>

        {/* Imagen del Producto */}
        <Image
          src={product.images?.[0] || product.image || '/placeholder.png'}
          alt={product.name || 'Producto'}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 90vw, 24vw"
        />
      </div>

      {/* --- SECCIÓN INFORMACIÓN (flex-grow) --- */}
      <div className="flex flex-col flex-grow px-4 py-3 bg-white">
        
        {/* PRECIO ACTUAL: $XX⁷⁶ (SIN "Ahora") */}
        <div className="flex items-baseline text-black font-bold leading-none mb-2">
          <span className="text-lg">$</span>
          <span className="text-2xl font-bold tracking-tight ml-1">
            {Number(enteros).toLocaleString('es-CO')}
          </span>
          <sup className="text-sm font-bold ml-0.5 align-super">{decimales}</sup>
        </div>

        {/* NOMBRE DEL PRODUCTO (máximo 2 líneas) */}
        <h3 className="text-[14px] text-[#2e2e2e] font-normal leading-[1.3] line-clamp-2 flex-grow">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}