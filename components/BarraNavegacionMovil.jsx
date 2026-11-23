// components/BarraNavegacionMovil.jsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexto/ContextoAuth';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useModal } from '@/contexto/ContextoModal';
import { useDetalleProducto } from '@/contexto/ContextoDetalleProducto';
import {
  FiHome,
  FiShoppingBag,
  FiTruck,
  FiBox,
  FiShoppingCart,
} from 'react-icons/fi';

const HIDDEN_ROUTES = ['/checkout', '/pago', '/confirmacion', '/gracias', '/carrito'];

export default function BarraNavegacionMovil() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { cart } = useCarrito();
  const { openModal } = useModal();
  const {
    isProductPage,
    product,
    quantity,
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart,
    isAddingToCart,
    MAX_QUANTITY_PER_ITEM,
  } = useDetalleProducto();

  // Nunca mostrar barra inferior en checkout, carrito o páginas de pago
  const isHiddenRoute = HIDDEN_ROUTES.some((route) => pathname?.startsWith(route));
  if (isHiddenRoute) {
    return null;
  }

  // Barra de compra rápida exclusiva para la página de detalle del producto
  const isProductDetailPage = pathname?.startsWith('/producto/');
  if (isProductDetailPage && isProductPage && product) {
    const maxLimit = Math.min(product.stock || MAX_QUANTITY_PER_ITEM, MAX_QUANTITY_PER_ITEM);
    const isOutOfStock = product.stock === 0;

    return (
      <nav
        aria-label="Acciones de compra rápida"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-30 h-[76px] flex items-center gap-3 px-3"
      >
        {/* Controles de cantidad */}
        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden flex-shrink-0">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-10 h-11 !p-0 !min-w-0 !min-h-0 bg-gray-50 flex items-center justify-center font-bold text-gray-700 active:bg-gray-200 transition disabled:opacity-40 text-lg"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="w-10 h-11 flex items-center justify-center font-bold text-gray-900 text-base border-x border-gray-200">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= maxLimit || isOutOfStock}
            className="w-10 h-11 !p-0 !min-w-0 !min-h-0 bg-gray-50 flex items-center justify-center font-bold text-gray-700 active:bg-gray-200 transition disabled:opacity-40 text-lg"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        {/* Botón principal Agregar al Carrito */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart || isOutOfStock}
          className="flex-1 h-12 !py-0 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base"
          aria-label={isAddingToCart ? 'Agregando al carrito...' : 'Agregar al carrito'}
        >
          {isAddingToCart ? (
            <span>Agregando...</span>
          ) : isOutOfStock ? (
            <span>Agotado</span>
          ) : (
            <>
              <FiShoppingCart className="w-5 h-5" />
              <span>Agregar al Carrito</span>
            </>
          )}
        </button>
      </nav>
    );
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isHomeActive = pathname === '/';
  const isStoreActive = pathname?.startsWith('/categoria');
  const ordersHref = currentUser ? '/mis-pedidos' : '/rastrear-pedido';
  const ordersLabel = currentUser ? 'Pedidos' : 'Rastrear';
  const OrdersIcon = currentUser ? FiBox : FiTruck;
  const isOrdersActive = currentUser
    ? pathname?.startsWith('/mis-pedidos')
    : pathname?.startsWith('/rastrear-pedido');

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30 h-16 flex items-stretch justify-around px-1"
    >
      {/* 1. Inicio */}
      <Link
        href="/"
        className={`relative !flex flex-col items-center justify-center flex-1 !py-0 transition-colors ${
          isHomeActive ? 'text-cyan-700 font-bold' : 'text-gray-500 hover:text-cyan-700 font-medium'
        }`}
      >
        {isHomeActive && (
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-cyan-600 rounded-b-full"
            aria-hidden="true"
          />
        )}
        <FiHome size={22} strokeWidth={isHomeActive ? 2.4 : 1.9} aria-hidden="true" />
        <span className="text-[11px] mt-1 leading-none">Inicio</span>
      </Link>

      {/* 2. Tienda */}
      <Link
        href="/categoria/all"
        className={`relative !flex flex-col items-center justify-center flex-1 !py-0 transition-colors ${
          isStoreActive ? 'text-cyan-700 font-bold' : 'text-gray-500 hover:text-cyan-700 font-medium'
        }`}
      >
        {isStoreActive && (
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-cyan-600 rounded-b-full"
            aria-hidden="true"
          />
        )}
        <FiShoppingBag size={22} strokeWidth={isStoreActive ? 2.4 : 1.9} aria-hidden="true" />
        <span className="text-[11px] mt-1 leading-none">Tienda</span>
      </Link>

      {/* 3. Carrito */}
      <button
        type="button"
        onClick={() => openModal('carrito')}
        className="relative flex flex-col items-center justify-center flex-1 !p-0 !min-w-0 !min-h-0 !overflow-visible bg-transparent border-0 text-cyan-700 hover:text-cyan-800 active:scale-95 transition-transform font-semibold"
        aria-label={totalItems > 0 ? `Abrir carrito, ${totalItems} artículos` : 'Abrir carrito'}
      >
        <span className="relative inline-flex items-center justify-center">
          <FiShoppingCart size={23} strokeWidth={2.2} aria-hidden="true" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          )}
        </span>
        <span className="text-[11px] mt-1 leading-none">Carrito</span>
      </button>

      {/* 4. Pedidos / Rastrear */}
      <Link
        href={ordersHref}
        className={`relative !flex flex-col items-center justify-center flex-1 !py-0 transition-colors ${
          isOrdersActive ? 'text-cyan-700 font-bold' : 'text-gray-500 hover:text-cyan-700 font-medium'
        }`}
      >
        {isOrdersActive && (
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-cyan-600 rounded-b-full"
            aria-hidden="true"
          />
        )}
        <OrdersIcon size={22} strokeWidth={isOrdersActive ? 2.4 : 1.9} aria-hidden="true" />
        <span className="text-[11px] mt-1 leading-none">{ordersLabel}</span>
      </Link>
    </nav>
  );
}