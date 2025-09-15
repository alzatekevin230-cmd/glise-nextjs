// components/BestOffers.jsx

import Image from 'next/image';
import Link from 'next/link';

export default function BestOffers() {
  return (
    <section className="mb-16 md:mb-24">
      <div className="container mx-auto px-2 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Mejores Ofertas</h2>
          <Link href="/categoria/all" className="text-blue-600 font-semibold hover:underline text-sm">Ver todo</Link>
        </div>

        {/* --- INICIO: Layout Móvil (Optimizado con width y height) --- */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          <Link href="/categoria/Dermocosméticos" className="offer-grid-card">
            <Image 
              src="/imagenespagina/ofertainicio1.png" 
              alt="Oferta principal de productos naturales" 
              width={1200}
              height={900}
              className="w-full h-auto"
              sizes="100vw"
            />
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/producto/192" className="offer-grid-card block">
              <Image 
                src="/imagenespagina/tarjetaofertas.png" 
                alt="Oferta en cuidado para bebés" 
                width={800}
                height={1200}
                className="w-full h-auto"
                sizes="50vw"
              />
            </Link>
            <Link href="/producto/49" className="offer-grid-card block">
              <Image 
                src="/imagenespagina/tarjetaofertas2.png" 
                alt="Oferta en productos de belleza" 
                width={800}
                height={1200}
                className="w-full h-auto"
                sizes="50vw"
              />
            </Link>
          </div>
          <Link href="/categoria/Cuidado Infantil" className="offer-grid-card">
            <Image 
              src="/imagenespagina/ofertainicio2.png" 
              alt="Oferta en suplementos" 
              width={1200}
              height={1200}
              className="w-full h-auto"
              sizes="100vw"
            />
          </Link>
        </div>

        {/* --- INICIO: Layout Escritorio (Optimizado con fill) --- */}
        <div className="hidden lg:grid grid-cols-2 gap-6">
          <Link href="/categoria/Dermocosméticos" className="offer-grid-card relative block">
            <Image 
              src="/imagenespagina/ofertaescritorio.png" 
              alt="Oferta principal de productos naturales" 
              fill
              sizes="50vw"
              className="w-full h-full object-cover" 
            />
          </Link>
          <div className="grid grid-cols-2 gap-6">
            <Link href="/producto/198" className="offer-grid-card relative aspect-square block">
              <Image 
                src="/imagenespagina/tescritorio1.png" 
                alt="Oferta en dermocosméticos" 
                fill
                sizes="25vw"
                className="w-full h-full object-cover" 
              />
            </Link>
            <Link href="/categoria/Naturales y Homeopáticos" className="offer-grid-card relative aspect-square block">
              <Image 
                src="/imagenespagina/tescritorio2.png" 
                alt="Oferta en productos de belleza" 
                fill
                sizes="25vw"
                className="w-full h-full object-cover" 
              />
            </Link>
            <Link href="/categoria/Cuidado y Belleza" className="offer-grid-card relative aspect-square block">
              <Image 
                src="/imagenespagina/tescritorio3.png" 
                alt="Oferta en suplementos" 
                fill
                sizes="25vw"
                className="w-full h-full object-cover" 
              />
            </Link>
            <Link href="/categoria/Cuidado Infantil" className="offer-grid-card relative aspect-square block">
              <Image 
                src="/imagenespagina/tescritorio4.png" 
                alt="Oferta en cuidado infantil" 
                fill
                sizes="25vw"
                className="w-full h-full object-cover" 
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}