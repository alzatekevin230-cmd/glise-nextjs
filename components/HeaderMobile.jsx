// components/HeaderMobile.jsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from './SearchResults';
import { useSmartHeader } from './hooks/useSmartHeader';

export default function HeaderMobile() {
  const { openModal } = useModal();
  const { cart } = useCarrito();
  const { openMenu } = useMenuLateral();
  const { searchTerm, setSearchTerm, suggestions } = useSearch();
  const { headerState } = useSmartHeader(); // Usamos el nuevo estado
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // ==================================================================
  // === INICIO DE LA CORRECIÓN CLAVE ===
  // ==================================================================
  useEffect(() => {
    // Limpiamos clases anteriores
    document.body.classList.remove(
      'header-visible-full',
      'header-visible-search',
      'header-hidden'
    );

    // Añadimos la clase actual basada en el estado del hook
    if (headerState) {
       document.body.classList.add(`header-${headerState}`);
    }
  }, [headerState]);
  // ==================================================================
  // === FIN DE LA CORRECIÓN CLAVE ===
  // ==================================================================


  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Definimos las alturas para usarlas en el CSS y aquí
  const fullHeaderHeight = 118; // Altura de logo + banner
  const searchBarHeight = 70; // Altura solo del buscador

  return (
    <div 
      id="mobile-header"
      className="md:hidden w-full fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out"
    >
      <div className="bg-pink-500 text-white text-center text-sm font-semibold py-2 w-full">
        <i className="fas fa-truck"></i>
        <span> Glisé te lo lleva</span>
      </div>
      <div className="relative h-20 bg-white shadow w-full flex items-center justify-between px-4">
        <button onClick={openMenu} className="text-2xl text-gray-600 z-10">
          <i className="fas fa-bars"></i>
        </button>
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] z-0">
          <Image src="/imagenespagina/logodeglise.png" alt="Logo Glisé" width={112} height={56} className="h-14 w-auto object-contain" />
        </Link>
        <button onClick={() => openModal('carrito')} className="relative text-2xl text-cyan-600 z-10">
          <i className="fas fa-shopping-cart"></i>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
      <div className="bg-pink-50 py-2 border-t border-b border-pink-100 w-full">
        <div 
          className="relative px-4"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        >
          <input
            type="text"
            placeholder="Busca tus productos..."
            className="w-full pl-5 pr-16 py-3 border-2 border-cyan-500 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" className="absolute right-6 top-1/2 -translate-y-1/2 bg-cyan-600 text-white w-10 h-10 rounded-full hover:bg-cyan-700 flex items-center justify-center transition-transform duration-200 hover:scale-110" aria-label="Buscar">
            <i className="fas fa-search"></i>
          </button>
          {isSearchFocused && <SearchResults suggestions={suggestions} />}
        </div>
      </div>
    </div>
  );
}