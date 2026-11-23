"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useAuth } from '@/contexto/ContextoAuth';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from './SearchResults';
import {
  FiMenu,
  FiShoppingCart,
  FiSearch,
  FiUser,
  FiChevronRight,
  FiMapPin,
  FiX,
} from 'react-icons/fi';

const QUICK_CATEGORIES = [
  { label: 'Tienda', href: '/categoria/all' },
  { label: 'Aceites', href: '/categoria/Milenario' },
  { label: 'Natural', href: '/categoria/Naturales y Homeopáticos' },
  { label: 'Dermocosmética', href: '/categoria/Dermocosméticos' },
  { label: 'Infantil', href: '/categoria/Cuidado Infantil' },
  { label: 'Belleza', href: '/categoria/Cuidado y Belleza' },
  { label: 'Rastrear', href: '/rastrear-pedido' },
];

export default function HeaderMobile() {
  const { openModal, setAuthTab } = useModal();
  const { cart } = useCarrito();
  const { currentUser } = useAuth();
  const { openMenu } = useMenuLateral();
  const { searchTerm, setSearchTerm, suggestions } = useSearch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const firstName =
    currentUser?.displayName?.split(' ')[0] ||
    currentUser?.email?.split('@')[0] ||
    'Cuenta';

  const handleLoginClick = () => {
    setAuthTab('login');
    openModal('auth');
  };

  return (
    <div id="mobile-header" className="md:hidden w-full">
      {/* Bloque principal en paleta Glisé */}
      <div className="bg-gradient-to-b from-cyan-100 to-cyan-50 border-b border-cyan-200/80">
        {/* Fila 1: Menú + Logo a la izquierda | Cuenta y Carrito más grandes a la derecha */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openMenu}
              className="!p-1.5 !min-w-0 !min-h-0 -ml-1 text-cyan-950 hover:text-cyan-700 flex items-center justify-center"
              aria-label="Abrir menú"
            >
              <FiMenu size={26} aria-hidden="true" />
            </button>

            <Link href="/" className="!p-0 flex items-center" aria-label="Ir al inicio de Glisé">
              <Image
                src="/imagenespagina/logodeglise.webp"
                alt="Logo Glisé"
                width={100}
                height={44}
                className="h-10 w-auto object-contain"
                style={{ width: 'auto' }}
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link
                href="/mi-cuenta"
                className="!p-1 flex items-center gap-1 text-cyan-950 hover:text-cyan-700"
                aria-label="Ir a mi cuenta"
              >
                <span className="text-[13px] font-bold max-w-[86px] truncate">
                  {firstName}
                </span>
                <FiChevronRight size={15} className="-ml-0.5 text-cyan-700" aria-hidden="true" />
                <FiUser size={25} strokeWidth={2.1} aria-hidden="true" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLoginClick}
                className="!p-1 !min-w-0 !min-h-0 flex items-center gap-1 text-cyan-950 hover:text-cyan-700"
                aria-label="Iniciar sesión"
              >
                <span className="text-[13px] font-bold">Ingresar</span>
                <FiChevronRight size={15} className="-ml-0.5 text-cyan-700" aria-hidden="true" />
                <FiUser size={25} strokeWidth={2.1} aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={() => openModal('carrito')}
              className="relative !p-1.5 !min-w-0 !min-h-0 !overflow-visible text-cyan-950 hover:text-cyan-700 flex items-center justify-center"
              aria-label={
                cartItemCount > 0
                  ? `Abrir carrito, ${cartItemCount} artículos`
                  : 'Abrir carrito'
              }
            >
              <FiShoppingCart size={27} strokeWidth={2.1} aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Fila 2: Buscador cuadrado (esquinas suaves estilo Amazon) con lupa visible */}
        <div
          className="relative px-3 pb-2 overflow-visible"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        >
          <div className="flex items-center h-11 bg-white rounded-lg border-2 border-cyan-500 shadow-sm focus-within:border-cyan-600 overflow-hidden">
            <input
              type="text"
              placeholder="Buscar en Glisé..."
              className="flex-1 min-w-0 h-full !min-h-0 !py-0 pl-3.5 pr-2 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent border-0 outline-none focus:outline-none focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="w-8 h-full !min-w-0 !min-h-0 !p-0 text-gray-400 hover:text-gray-600 flex items-center justify-center flex-shrink-0"
                aria-label="Limpiar búsqueda"
              >
                <FiX size={18} style={{ width: '18px', height: '18px', minWidth: '18px' }} />
              </button>
            )}

            <button
              type="button"
              className="w-12 h-full !min-w-0 !min-h-0 !p-0 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white flex items-center justify-center flex-shrink-0 rounded-none"
              aria-label="Buscar"
            >
              <FiSearch
                size={21}
                strokeWidth={2.5}
                style={{ width: '21px', height: '21px', minWidth: '21px', minHeight: '21px' }}
              />
            </button>
          </div>

          {isSearchFocused && <SearchResults suggestions={suggestions} />}
        </div>

        {/* Fila 3: Accesos rápidos de categorías */}
        <nav
          aria-label="Categorías rápidas"
          className="flex items-center gap-5 overflow-x-auto px-3.5 pb-2 pt-0.5"
        >
          {QUICK_CATEGORIES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="!py-1 whitespace-nowrap text-[13px] font-semibold text-cyan-950/90 hover:text-cyan-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Fila 4: Franja compacta de envíos */}
      <Link
        href="/politicas-de-envio"
        className="w-full bg-cyan-700 text-white px-3 !py-1.5 !flex items-center justify-between text-xs font-medium"
      >
        <span className="flex items-center gap-1.5 truncate">
          <FiMapPin size={14} className="text-cyan-200 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">
            Envíos a todo Colombia <span className="text-cyan-200 mx-0.5">•</span>{' '}
            <strong className="font-semibold text-white">Gratis en Palmira</strong>
          </span>
        </span>
        <FiChevronRight size={14} className="text-cyan-200 flex-shrink-0 ml-1" aria-hidden="true" />
      </Link>
    </div>
  );
}