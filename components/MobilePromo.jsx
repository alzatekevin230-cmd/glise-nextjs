// components/MobilePromo.jsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imageUtils';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

function ProductPromoCard({ product, label, bgColor }) {
  if (!product) return null;

  const imageSrc = getImageUrl((product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/300x300'));
  const hasDiscount = product.oldPrice || product.originalPrice;
  const discountPercentage = hasDiscount ? Math.round(((hasDiscount - product.price) / hasDiscount) * 100) : 0;

  return (
    <Link href={`/producto/${product.slug || product.id}`} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 relative" style={{ aspectRatio: '1 / 1.3', backgroundColor: bgColor }}>
      {/* Imagen del producto - ocupa todo el espacio */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 0vw" 
          className="object-cover"
          style={{ objectPosition: 'left bottom' }}
          quality={80}
          loading="lazy"
        />
      </div>

      {/* Encabezado con label, descuento y botón - posicionado absoluto */}
      <div className="absolute top-0 left-0 right-0 p-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col -space-y-2">
            <p className="font-bold text-sm text-gray-800 m-0 p-0 leading-none">{label}</p>
            <button className="text-gray-800 font-bold text-xs underline m-0 p-0 text-left leading-none">
              Comprar
            </button>
          </div>
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </div>

      {/* Descuento de Marketing en el lado izquierdo a la mitad */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-green-500 text-white p-2 rounded shadow-sm text-center">
        <p className="text-xs font-bold m-0">5% OFF</p>
      </div>
    </Link>
  );
}

export default function MobilePromo({ milenarioProduct, naturalesProduct }) {
  return (
    // Esta sección solo se mostrará en pantallas pequeñas (md:hidden)
    <section className="container mx-auto px-2 sm:px-6 -mt-6 md:hidden">
      <div className="grid grid-cols-2 gap-4">
        
        {/* Tarjeta de Aceites */}
        <ProductPromoCard product={milenarioProduct} label="Aceites" bgColor="#f0f9ff" />

        {/* Tarjeta de Natural */}
        <ProductPromoCard product={naturalesProduct} label="Natural" bgColor="#f0fdf4" />

        <Link href="/marca/EUCERIN" className="promo-card-mobile promo-card--wide col-span-2">
          <div className="promo-card-content">
            <h3 className="promo-card-title">Eucerin</h3>
            <p className="promo-card-cta">Comprar</p>
          </div>
          <div className="absolute inset-0">
            <Image 
              src="/imagenespagina/banereucerin.webp" 
              alt="Lo Mejor de Glisé" 
              fill
              sizes="(max-width: 768px) 100vw, 0vw"
              className="promo-card-image-full" 
              quality={80}
              loading="lazy"
            />
          </div>
        </Link>

        <Link href="/marca/NIVEA" className="promo-card-mobile promo-card--wide col-span-2">
          <div className="promo-card-content">
            <h3 className="promo-card-title">Nivea</h3>
            <p className="promo-card-cta">Comprar todo</p>
          </div>
          <div className="absolute inset-0">
            <Image 
              src="/imagenespagina/banerdenivea.webp" 
              alt="Lo Mejor de Glisé" 
              fill
              sizes="(max-width: 768px) 100vw, 0vw"
              className="promo-card-image-full"
              quality={80}
              loading="lazy"
            />
          </div>
        </Link>
        
        <Link href="/producto/creatina-en-gomas-sabor-fresa" className="promo-card-mobile promo-card--wide col-span-2">
          <div className="promo-card-content">
            <h3 className="promo-card-title">Creatina</h3>
            <p className="promo-card-cta">Ver producto</p>
          </div>
          <div className="absolute inset-0">
            <Image 
              src="/imagenespagina/ofertacreatiana.webp" 
              alt="Banner Cuidado de Bebé" 
              fill
              sizes="(max-width: 768px) 100vw, 0vw"
              className="promo-card-image-full"
              quality={80}
              loading="lazy"
            />
          </div>
        </Link>

      </div>
    </section>
  );
}