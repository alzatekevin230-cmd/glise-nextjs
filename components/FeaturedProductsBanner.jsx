// components/FeaturedProductsBanner.jsx

import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedProductsBanner() {
  return (
    <section className="mb-12">
      <div className="container mx-auto px-2 sm-px-6">
        {/* Versión para Móvil */}
        <Link href="/categoria/Dermocosméticos" className="md:hidden block mb-8">
          <Image 
            src="/imagenespagina/pdestacadosmovil.png" 
            alt="Banner Productos Destacados Móvil" 
            width={1200}
            height={700}
            className="w-full h-auto rounded-lg shadow-md" 
          />
        </Link>
        {/* Versión para Escritorio */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          <Link href="/categoria/Dermocosméticos" className="col-span-2 block">
            <Image 
              src="/imagenespagina/pdestacadosmovil.png" 
              alt="Banner Principal Productos Destacados" 
              width={1200}
              height={700}
              className="w-full h-full object-cover rounded-lg shadow-md" 
            />
          </Link>
          <Link href="/producto/acuanova-soft-hidratante-220-g" className="col-span-1 block">
            <Image 
              src="/imagenespagina/ofertaacuanova.png" 
              alt="Banner Lateral Productos Destacados" 
              width={800}
              height={800}
              className="w-full h-full object-cover rounded-lg shadow-md" 
            />
          </Link>
        </div>
      </div>
    </section>
  );
}