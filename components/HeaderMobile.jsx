"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from './SearchResults';
import { useSmartHeader } from './hooks/useSmartHeader';
import { FaBars, FaShoppingCart, FaTruck, FaGift, FaStar, FaFire } from 'react-icons/fa';

const promoMessages = [
  { icon: FaTruck, text: "Envíos a todo Colombia", color: "bg-teal-400" },
  { icon: FaGift, text: "Envío GRATIS en compras +$250.000", color: "bg-rose-300" },
  { icon: FaStar, text: "+5.000 clientes satisfechos", color: "bg-indigo-300" },
  { icon: FaFire, text: "Nuevos productos cada semana", color: "bg-cyan-300" }
];

export default function HeaderMobile() {
  const { openModal } = useModal();
  const { cart } = useCarrito();
  const { openMenu } = useMenuLateral();
  const { searchTerm, setSearchTerm, suggestions } = useSearch();
  const { isVisible } = useSmartHeader();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Rotación automática de mensajes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promoMessages.length);
    }, 3500); // Cambia cada 3.5 segundos

    return () => clearInterval(interval);
  }, []);

  const currentMessage = promoMessages[currentPromoIndex];
  const Icon = currentMessage.icon;

  return (
    <div
      id="mobile-header"
      className="md:hidden w-full"
    >
      <div className={`${currentMessage.color} text-white text-center text-sm font-semibold py-2 w-full flex items-center justify-center gap-2 transition-colors duration-500 overflow-hidden`}>
        <Icon className="animate-bounce" />
        <span 
          key={currentPromoIndex} 
          className="animate-[slideIn_0.5s_ease-out]"
        >
          {currentMessage.text}
        </span>
        {/* Indicadores de paginación */}
        <div className="absolute right-2 flex gap-1">
          {promoMessages.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentPromoIndex ? 'bg-white w-3' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="relative h-20 bg-white shadow w-full flex items-center justify-between px-2">
        <button onClick={openMenu} className="text-2xl text-gray-600 z-10 p-2 -ml-1">
          <FaBars />
        </button>
        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] z-0">
          <Image src="/imagenespagina/logodeglise.webp" alt="Logo Glisé" width={112} height={56} className="h-14 w-auto object-contain" style={{ width: 'auto' }} />
        </Link>
        <button onClick={() => openModal('carrito')} className="relative text-2xl text-cyan-600 z-10 p-2 -mr-1">
          <FaShoppingCart />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
      <div className="bg-pink-50 py-2 w-full border-t border-b border-pink-100">
        <div
          className="relative px-4"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        >
          <input
            type="text"
            placeholder="Busca tus productos..."
            className="w-full pl-5 pr-16 py-3 border-2 border-cyan-500 rounded-full focus:outline-none focus:rounded-full focus:border-cyan-600 transition-colors text-sm"
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
