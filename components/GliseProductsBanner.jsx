// components/GliseProductsBanner.jsx

import Image from 'next/image';
import Link from 'next/link';

export default function GliseProductsBanner() {
  return (
    <section className="mb-12">
      <div className="container mx-auto px-2 sm:px-6">
        {/* Versión para Móvil */}
        <Link href="/categoria/Milenario" className="md:hidden block mb-8">
          <Image 
            src="/imagenespagina/pglisemovil.webp" 
            alt="Banner Productos Glisé Móvil" 
            width={1200}
            height={700}
            className="w-full h-auto rounded-lg shadow-md" 
          />
        </Link>
        {/* Versión para Escritorio */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          <Link href="/categoria/Milenario" className="col-span-1 block">
            <Image 
              src="/imagenespagina/ofertaaceitesescritorio.webp" 
              alt="Banner Lateral Productos Glisé" 
              width={800}
              height={800}
              className="w-full h-full object-cover rounded-lg shadow-md" 
            />
          </Link>
          <Link href="/categoria/Milenario" className="col-span-2 block">
            <Image 
              src="/imagenespagina/pglisemovil.webp" 
              alt="Banner Principal Productos Glisé" 
              width={1200}
              height={700}
              className="w-full h-full object-cover rounded-lg shadow-md" 
            />
          </Link>
        </div>
      </div>
    </section>
  );
}