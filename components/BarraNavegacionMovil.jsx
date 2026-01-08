// app/components/BarraNavegacionMovil.jsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModal } from '@/contexto/ContextoModal';
import { useAuth } from '@/contexto/ContextoAuth';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useDetalleProducto } from '@/contexto/ContextoDetalleProducto';
import { FiHome, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function BarraNavegacionMovil() {
  const { openModal } = useModal();
  const { openMenu } = useMenuLateral();
  const { currentUser } = useAuth();
  const { cart } = useCarrito();
  const pathname = usePathname();
  const { 
    isProductPage, 
    product, 
    quantity, 
    increaseQuantity, 
    decreaseQuantity, 
    handleAddToCart, 
    isAddingToCart,
    MAX_QUANTITY_PER_ITEM 
  } = useDetalleProducto();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isProductDetailPage = pathname?.startsWith('/producto/');

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (currentUser) {
      openMenu();
    } else {
      openModal('auth');
    }
  };

  // Si estamos en la página de detalle del producto y hay un producto cargado, mostrar barra especial
  if (isProductDetailPage && isProductPage && product) {
    const maxLimit = Math.min(product.stock || MAX_QUANTITY_PER_ITEM, MAX_QUANTITY_PER_ITEM);
    const isOutOfStock = product.stock === 0;

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_15px_rgba(0,0,0,0.1)] z-30 h-[80px] flex items-center px-2 sm:px-4">
        {/* Controles de cantidad - 40% del ancho */}
        <div className="flex items-center gap-2 flex-[0.4]">
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center font-semibold text-gray-900 text-base">
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            disabled={quantity >= maxLimit || isOutOfStock}
            className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        {/* Botón Agregar al Carrito - 60% del ancho */}
        <div className="flex-[0.6] pl-2">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock}
            className="w-full h-[52px] bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            aria-label={isAddingToCart ? "Agregando al carrito..." : "Agregar al carrito"}
          >
            {isAddingToCart ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Agregando...</span>
              </>
            ) : isOutOfStock ? (
              <span>Agotado</span>
            ) : (
              <>
                <FiShoppingCart />
                <span>Agregar al Carrito</span>
              </>
            )}
          </button>
        </div>
      </nav>
    );
  }

  // Barra normal para otras páginas
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-2px_15px_rgba(0,0,0,0.1)] z-30 flex justify-around items-center h-20">
      <Link 
        href="/categoria/all" 
        className="flex flex-col items-center justify-center text-cyan-600 active:text-cyan-800 active:scale-95 active:bg-cyan-50 transition-all duration-150 w-full h-full rounded-lg"
      >
        <FiHome className="text-2xl" />
        <span className="text-xs mt-1 font-medium">Tienda</span>
      </Link>

      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); openModal('carrito'); }} 
        className="relative flex flex-col items-center justify-center text-cyan-600 active:text-cyan-800 active:scale-95 active:bg-cyan-50 transition-all duration-150 w-full h-full rounded-lg"
      >
        <FiShoppingCart className="text-2xl" />
        <span className="text-xs mt-1 font-medium">Carrito</span>
        {totalItems > 0 && (
          <span className="absolute top-2 right-6 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
            {totalItems}
          </span>
        )}
      </a>

      <a 
        href="#" 
        onClick={handleAccountClick} 
        className="flex flex-col items-center justify-center text-cyan-600 active:text-cyan-800 active:scale-95 active:bg-cyan-50 transition-all duration-150 w-full h-full rounded-lg"
      >
        <FiUser className="text-2xl" />
        <span className="text-xs mt-1 font-medium">Mi Cuenta</span>
      </a>
    </nav>
  );
}
