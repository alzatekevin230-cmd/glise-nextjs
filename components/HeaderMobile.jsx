"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from './SearchResults';
import { FiMenu, FiShoppingCart, FiTruck, FiGift, FiStar, FiZap, FiSearch } from 'react-icons/fi';

const promoMessages = [
  { icon: FiTruck, text: "Envíos a todo Colombia" },
  { icon: FiStar, text: "+5.000 clientes satisfechos" },
  { icon: FiZap, text: "Nuevos productos cada semana" }
];

export default function HeaderMobile() {
  const { openModal } = useModal();
  const { cart } = useCarrito();
  const { openMenu } = useMenuLateral();
  const { searchTerm, setSearchTerm, suggestions } = useSearch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Rotación automática de mensajes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promoMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = promoMessages[currentPromoIndex];
  const Icon = currentMessage.icon;

  return (
    <div
      id="mobile-header"
      className="md:hidden w-full"
    >
      <div className="bg-cyan-700 text-white text-center text-base font-semibold py-3 w-full flex items-center justify-center gap-2 overflow-hidden relative">
        <Icon />
        <span 
          key={currentPromoIndex} 
          className="animate-fadeIn"
        >
          {currentMessage.text}
        </span>
      </div>
      <div className="relative h-16 bg-white shadow w-full flex items-center justify-between px-2">
        <button
          onClick={openMenu}
          className="text-2xl text-gray-600 z-10 p-2 -ml-1"
          aria-label="Abrir menú"
        >
          <FiMenu aria-hidden="true" />
        </button>
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[50%] z-0">
          <Image src="/imagenespagina/logodeglise.webp" alt="Logo Glisé" width={112} height={56} className="h-14 w-auto object-contain" style={{ width: 'auto' }} />
        </Link>
        <button
          onClick={() => openModal('carrito')}
          className="relative text-2xl text-cyan-600 z-10 p-2 -mr-1"
          aria-label={cartItemCount > 0 ? `Abrir carrito, ${cartItemCount} artículos` : 'Abrir carrito'}
        >
          <FiShoppingCart aria-hidden="true" />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
      <div className="bg-white py-1.5 w-full border-t border-b border-gray-200">
        <div
          className="relative px-4 overflow-visible"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        >
          <div className="relative h-11 bg-white border-2 border-cyan-500 rounded-full focus-within:border-cyan-600 transition-colors">
            <input
              type="text"
              placeholder="Busca tus productos..."
              className="w-full h-full pl-5 pr-12 text-sm bg-transparent border-0 rounded-full outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 min-h-0 min-w-0 p-0 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 flex items-center justify-center transition-colors outline-none focus:outline-none focus-visible:outline-none" aria-label="Buscar">
              <FiSearch style={{width: '17px', height: '17px', minWidth: '17px', minHeight: '17px'}} />
            </button>
          </div>
          {isSearchFocused && <SearchResults suggestions={suggestions} />}
        </div>
      </div>
    </div>
  );
}
