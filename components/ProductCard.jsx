// components/ProductCard.jsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCarrito } from '@/contexto/ContextoCarrito';
import toast from 'react-hot-toast';
import AnimatedSection from './AnimatedSection';
import OptimizedImage from './OptimizedImage';
import { FaStar, FaStarHalfAlt, FaShoppingCart } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa';

function formatPrice(price) {
  return `$${Math.round(price).toLocaleString('es-CO')}`;
}

export default function ProductCard({ product, isSmall = false }) {
  const { agregarAlCarrito } = useCarrito();

  const handleAddToCart = () => {
    agregarAlCarrito(product);
    toast.success(`${product.name} añadido al carrito!`);
  };

  const imageSrc = (product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/300x300');
  const isOutOfStock = product.stock === 0;

  const rating = 3.5 + (product.popularity / 800) * 1.5;
  const reviewCount = Math.floor(product.popularity / 15) + 3;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return <FaStar key={i} className="text-amber-400" />;
    if (rating >= i + 0.5) return <FaStarHalfAlt key={i} className="text-amber-400" />;
    return <FaRegStar key={i} className="text-amber-400" />;
  });

  const cardClasses = isSmall ? "p-2" : "p-4";
  const titleClasses = isSmall 
    ? "font-semibold text-gray-800 my-1 flex-grow flex items-center justify-center h-10 text-sm"
    : "font-semibold text-gray-800 my-1 flex-grow flex items-center justify-center h-14";
  const priceClasses = isSmall ? "text-lg font-bold text-blue-600 mb-2" : "text-xl font-bold text-blue-600 mb-3";
  const buttonClasses = `w-full text-white font-bold rounded-lg transition-all duration-150 flex items-center justify-center ${isSmall ? 'py-1 px-2 text-xs' : 'py-2 px-4'} ${isOutOfStock ? 'btn-disabled' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 active:bg-blue-800'}`;

  return (
    <AnimatedSection animation="slideUpScale" delay={0} duration={500}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden product-card flex flex-col text-center border h-full relative transition-all duration-300 hover:shadow-xl">
        {isOutOfStock && <div className="out-of-stock-badge">Agotado</div>}
        
        {/* --- ENLACE CORREGIDO: AHORA USA product.slug --- */}
        <Link href={`/producto/${product.slug}`} className={`cursor-pointer flex-grow flex flex-col ${isOutOfStock ? 'opacity-60' : ''}`}>
          
          <OptimizedImage 
            src={imageSrc} 
            alt={product.name}
            className="aspect-square w-full"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={false}
          />

        <div className={`${cardClasses} flex-grow flex flex-col`}>
          <p className={`text-xs text-gray-400 uppercase tracking-wider ${isSmall ? 'hidden' : ''}`}>{product.category}</p>
          <h3 className={titleClasses} title={product.name}>
            <span className="line-clamp-2">{product.name}</span>
          </h3>
          <div className={`flex items-center justify-center mt-2 ${isSmall ? 'hidden' : ''}`}>
            {stars}
            <span className="text-gray-600 text-sm ml-2">({reviewCount})</span>
          </div>
        </div>
      </Link>
      
      <div className={`mt-auto ${isSmall ? 'px-2 pb-2' : 'px-4 pb-4'}`}>
        <p className={priceClasses}>{formatPrice(product.price)}</p>
        <button
          onClick={handleAddToCart}
          className={buttonClasses}
          disabled={isOutOfStock}
        >
          <FaShoppingCart className={isSmall ? 'mr-1' : 'mr-2'} /> {isOutOfStock ? 'Agotado' : 'Agregar'}
        </button>
      </div>
      </div>
    </AnimatedSection>
  );
}