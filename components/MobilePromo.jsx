// components/MobilePromo.jsx

import Image from 'next/image';
import Link from 'next/link';

export default function MobilePromo() {
  return (
    // Esta sección solo se mostrará en pantallas pequeñas (md:hidden)
    <section className="container mx-auto px-2 sm:px-6 my-8 md:hidden">
      <div className="grid grid-cols-2 gap-4">
        
        <Link href="/producto/alitopic-leche-emoliente-500-ml" className="promo-card-mobile promo-card--tall">
          <div className="promo-card-content">
            <h3 className="promo-card-title">Skin 10%off</h3>
            <p className="promo-card-cta">Ver ahora</p>
          </div>
          <div className="absolute inset-0">
            <Image 
              src="/imagenespagina/tarjetatopic.webp" 
              alt="Nuevos Dermocosméticos"
              fill
              sizes="50vw" 
              className="promo-card-image" 
            />
          </div>
        </Link>

        <Link href="/producto/aceite-esencial-de-lavanda-120-ml" className="promo-card-mobile promo-card--tall">
          <div className="promo-card-content">
            <h3 className="promo-card-title">Aceites 10%off</h3>
            <p className="promo-card-cta">Descubrir</p>
          </div>
          <div className="absolute inset-0">
            <Image 
              src="/imagenespagina/ofertalavanda.webp" 
              alt="Ofertas Naturales" 
              fill
              sizes="50vw"
              className="promo-card-image" 
            />
          </div>
        </Link>

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
              sizes="100vw"
              className="promo-card-image-full" 
               quality={100} 
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
              sizes="100vw"
              className="promo-card-image-full" 
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
              sizes="100vw"
              className="promo-card-image-full" 
            />
          </div>
        </Link>

      </div>
    </section>
  );
}