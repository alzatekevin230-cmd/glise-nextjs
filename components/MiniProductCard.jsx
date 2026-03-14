"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imageUtils';

export default function MiniProductCard({ product }) {
  if (!product) return null;

  // Formateo de precio (sin decimales)
  const precioActual = product.price || 0;
  const precioEntero = Math.round(precioActual);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative flex flex-col bg-white border border-[#e5e5e5] rounded-md overflow-hidden"
    >
      
      {/* Imagen (más grande para que sea protagonista) */}
      <div className="relative w-full h-[150px] md:h-[210px] bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
        {/* Imagen */}
        <Image
          src={getImageUrl(product.images?.[0] || product.image || '/placeholder.png')}
          alt={product.name || 'Producto'}
          fill
          className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 150px"
        />
      </div>

      {/* Información compacta */}
      <div className="flex flex-col flex-grow px-2 py-1 md:py-2 bg-white items-center text-center">
        
        {/* Precio centrado y más grande */}
        <div className="flex items-baseline justify-center text-black font-bold leading-none gap-0.5">
          <span className="text-base">$</span>
          <span className="text-xl font-bold">
            {Number(precioEntero).toLocaleString('es-CO')}
          </span>
        </div>

        {/* Nombre (máx 1 línea en mini, texto pequeño) */}
        <h4 className="text-[10px] text-[#2e2e2e] font-normal leading-[1.2] line-clamp-1 flex-grow mt-1.5">
          {product.name}
        </h4>
      </div>
    </Link>
  );
}
