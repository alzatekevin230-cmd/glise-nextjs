// components/MobilePromo.jsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imageUtils';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

// Genera un placeholder SVG muy ligero usando el mismo color base que la tarjeta
const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const getColorPlaceholder = (hexColor) => {
  const color = hexColor || '#e5e7eb';
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="300" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
};

function ProductPromoCard({ product, label, bgColor }) {
  if (!product) return null;

  const imageSrc = getImageUrl(
    (product.images && product.images.length > 0)
      ? product.images[0]
      : (product.image || 'https://placehold.co/300x300')
  );
  const blurPlaceholder = getColorPlaceholder(bgColor);
  const hasDiscount = product.oldPrice || product.originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((hasDiscount - product.price) / hasDiscount) * 100)
    : 0;

  return (
    <Link
      href={`/producto/${product.slug || product.id}`}
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 relative"
      style={{ aspectRatio: '1 / 1.3', backgroundColor: bgColor }}
    >
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
          priority
          placeholder="blur"
          blurDataURL={blurPlaceholder}
        />
      </div>

      {/* Encabezado con label y link de compra sencillo (sin tapar el producto) */}
      <div className="absolute top-0 left-0 right-0 p-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="font-bold text-sm text-gray-800 m-0 p-0 leading-none">
              {label}
            </p>
            <span className="mt-1 text-[11px] font-semibold text-gray-800 underline">
              Comprar
            </span>
          </div>
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded shadow-sm">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </div>

      {/* Badge de marketing lateral (usa color cyan de la marca) */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-red-600 text-white px-2.5 py-1.5 rounded-full shadow-sm text-center">
        <p className="text-[11px] font-bold m-0 tracking-wide">OFERTA</p>
      </div>
    </Link>
  );
}

export default function MobilePromo({ milenarioProduct, naturalesProduct }) {
  // Arreglo de banners para evitar repetir código JSX (DRY)
  const promoBanners = [
    {
      id: "eucerin",
      href: "/categoria/Dermocosméticos",
      title: "Dermocosméticos",
      cta: "Comprar",
      image: "/imagenespagina/banermobildermocosmetica.webp",
    },
    {
      id: "nivea",
      href: "/categoria/Cuidado y Belleza",
      title: "Belleza Facial",
      cta: "Comprar",
      image: "/imagenespagina/banermovilbelleza.webp",
    },
    {
      id: "creatina",
      href: "/categoria/Milenario",
      title: "Aceites",
      cta: "Comprar",
      image: "/imagenespagina/banermovilaceites.webp",
    }
  ];

  return (
    // Esta sección solo se mostrará en pantallas pequeñas (md:hidden)
    // Dejamos sin margen superior para que el espacio lo controle FeaturedCategories
    <section className="container mx-auto px-2 sm:px-6 md:hidden">
      {/* Tarjetas Superiores en Grid (Aceites y Naturales) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        
        {/* Tarjeta de Aceites */}
        <ProductPromoCard product={milenarioProduct} label="Aceites" bgColor="#f0f9ff" />

        {/* Tarjeta de Natural */}
        <ProductPromoCard product={naturalesProduct} label="Natural" bgColor="#f0fdf4" />
      </div>

      {/* Carrusel de Banners Anchos implementado según TODO.md */}
      <div className="mobile-promo-carousel">
        {promoBanners.map((banner) => (
          <Link key={banner.id} href={banner.href} className="promo-card-mobile promo-card--wide promo-card-scroll">
            <div className="promo-card-content -mt-2 -ml-6">
              <h3 className="promo-card-title">{banner.title}</h3>
              <p className="promo-card-cta">{banner.cta}</p>
            </div>
            <div className="absolute inset-0">
              <Image 
                src={banner.image} 
                alt={`Promoción ${banner.title}`} 
                fill
                sizes="(max-width: 768px) 85vw, 0vw"
                className="promo-card-image-full" 
                quality={80}
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}