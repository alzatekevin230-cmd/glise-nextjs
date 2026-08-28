// components/ProductCard.jsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useFavorites } from '@/hooks/useFavorites';
import toast from 'react-hot-toast';
import AnimatedSection from './AnimatedSection';
import OptimizedImage from './OptimizedImage';
import { getImageUrl } from '@/lib/imageUtils';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function formatPrice(price) {
  return `$${Math.round(price).toLocaleString('es-CO')}`;
}

export default function ProductCard({ product, isSmall = false, animated = true }) {
  const { agregarAlCarrito } = useCarrito();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const favorite = isFavorite(product.id);

  const handleAddToCart = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const result = agregarAlCarrito(product);
    
    if (result.success) {
      toast.success(result.isNew ? `🛒 ${product.name} añadido al carrito!` : `✅ Cantidad actualizada en el carrito`, {
        duration: 2000,
        style: {
          background: '#22c55e',
          color: '#fff',
        },
      });
    } else if (result.reason === 'max_limit') {
      toast.error(`⚠️ Máximo ${result.max} unidades por producto`, {
        duration: 2000,
      });
    }
  };

  const imageSrc = getImageUrl((product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://placehold.co/300x300'));
  const isOutOfStock = product.stock === 0;

  const cardClasses = isSmall ? "p-1.5" : "p-2";
  const titleClasses = isSmall
    ? "font-bold text-gray-900 text-base leading-snug text-left"
    : "font-bold text-gray-900 text-lg leading-snug text-left";
  const priceClasses = isSmall ? "text-lg font-extrabold text-cyan-700 mb-1" : "text-2xl font-extrabold text-cyan-700 mb-1";
  const reviewCount = product.reviewCount || 0;
  const rating = product.rating || 0;
  const ratingStars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return <FaStar key={i} className="text-amber-400" />;
    if (rating >= i + 0.5) return <FaStarHalfAlt key={i} className="text-amber-400" />;
    return <FaRegStar key={i} className="text-amber-400" />;
  });
  // Botón usa el azul/cyan principal de la marca
  const buttonClasses = `w-full text-white font-bold rounded-lg transition-all duration-150 flex items-center justify-center whitespace-nowrap ${isSmall ? 'py-2 px-1 text-xs' : 'py-3 px-2 text-sm'} ${isOutOfStock ? 'btn-disabled' : 'bg-cyan-700 hover:bg-cyan-800 active:scale-95 active:bg-cyan-900'}`;

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    toggleFavorite(product.id);
  };

  const cardContent = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden product-card flex flex-col text-center border h-full relative transition-all duration-300 hover:shadow-xl group">
      {isOutOfStock && <div className="out-of-stock-badge">Agotado</div>}

      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 z-10"
        aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        onMouseDown={(e) => e.preventDefault()}
      >
        {favorite ? (
          <FaHeart className="text-red-500" style={{width: '20px', height: '20px', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))'}} />
        ) : (
        <FaRegHeart className="text-red-400" style={{width: '20px', height: '20px', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))'}} />
        )}
      </button>

      <Link href={`/producto/${product.slug}`} className={`cursor-pointer flex flex-col ${isOutOfStock ? 'opacity-60' : ''}`}>

        <div className="relative overflow-hidden">
          <OptimizedImage
            src={imageSrc}
            alt={`${product.name} - ${product.category} - Comprar en Glisé Colombia`}
            className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={true}
            priority={false}
          />
        </div>

        <div className={`${cardClasses} flex flex-col`}>
          <h3 className={titleClasses} title={product.name}>{product.name}</h3>
          <p className="text-xs text-gray-500 mb-1 text-left">{product.category}</p>
          {reviewCount > 0 && (
            <div className="flex items-center justify-center gap-0.5 mb-1 text-xs">
              {ratingStars}
              <span className="text-gray-500 ml-1">({reviewCount})</span>
            </div>
          )}
        </div>
      </Link>

      <div className={`mt-auto ${isSmall ? 'px-2 pb-2' : 'px-3 pb-3'}`}>
        <p className={priceClasses}>{formatPrice(product.price)}</p>
        <button
          onClick={handleAddToCart}
          className={buttonClasses}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Agotado' : 'AÑADIR AL CARRITO'}
        </button>
      </div>
    </div>
  );

  return animated ? (
    <AnimatedSection animation="slideUpScale" delay={0} duration={500}>
      {cardContent}
    </AnimatedSection>
  ) : (
    cardContent
  );
}