"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useAuth } from '@/contexto/ContextoAuth';
import HeaderMobile from './HeaderMobile';
import { useSearch } from '@/hooks/useSearch';
import SearchResults from './SearchResults';
import {
  FiMenu,
  FiHome,
  FiShoppingBag,
  FiFeather,
  FiDroplet,
  FiSun,
  FiSmile,
  FiAward,
  FiChevronDown,
  FiUser,
  FiShoppingCart,
  FiHeart,
  FiLogOut,
  FiBox,
  FiTruck,
  FiGrid,
  FiSearch,
  FiMapPin,
  FiX,
} from 'react-icons/fi';

export default function Header() {
  const { openModal, setAuthTab } = useModal();
  const { cart } = useCarrito();
  const { currentUser, logout } = useAuth();

  const [isGuestMenuOpen, setGuestMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const guestMenuRef = useRef(null);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  const { searchTerm, setSearchTerm, suggestions } = useSearch();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const firstName =
    currentUser?.displayName?.split(' ')[0] ||
    currentUser?.email?.split('@')[0] ||
    'Usuario';

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleOpenAuthModal = (tab) => {
    setAuthTab(tab);
    openModal('auth');
    setGuestMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (guestMenuRef.current && !guestMenuRef.current.contains(event.target)) {
        setGuestMenuOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative z-40 shadow-md">
      {/* ==================== VERSIÓN ESCRITORIO ==================== */}
      <div className="hidden md:block">
        {/* Franja superior compacta de envíos */}
        <div className="bg-cyan-800 text-cyan-50 text-xs">
          <div className="container mx-auto px-4 h-8 flex items-center justify-between">
            <Link
              href="/politicas-de-envio"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <FiMapPin size={13} className="text-cyan-300" />
              <span>
                Envíos a todo Colombia <span className="text-cyan-400 mx-1">•</span>{' '}
                <strong className="font-semibold text-white">Envío gratis en Palmira</strong>
              </span>
            </Link>

            <div className="flex items-center gap-5">
              <Link href="/rastrear-pedido" className="hover:text-white transition-colors flex items-center gap-1">
                <FiTruck size={13} />
                <span>Rastrear pedido</span>
              </Link>
              <Link href="/politicas-de-envio" className="hover:text-white transition-colors">
                Envíos y devoluciones
              </Link>
            </div>
          </div>
        </div>

        {/* Fila principal (sin barra inferior adicional) */}
        <div className="bg-gradient-to-b from-cyan-50/90 to-white border-b border-cyan-100">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-5">
            {/* Logo + Menú desplegable */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/imagenespagina/logodeglise.webp"
                  alt="Logo Glisé"
                  width={140}
                  height={64}
                  className="h-16 w-auto object-contain"
                  style={{ width: 'auto' }}
                  priority
                />
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm shadow-sm"
                >
                  <FiMenu size={18} />
                  <span>Categorías</span>
                  <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="p-2">
                      <Link href="/" className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white flex items-center gap-2.5 transition-colors"><FiHome className="w-4" />Inicio</Link>
                      <Link href="/categoria/all" className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white flex items-center gap-2.5 transition-colors"><FiShoppingBag className="w-4" />Toda la Tienda</Link>
                      <Link href="/categoria/Milenario" className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white flex items-center gap-2.5 transition-colors"><FiSun className="w-4" />Aceites Milenarios</Link>
                      <Link href="/categoria/Naturales y Homeopáticos" className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white flex items-center gap-2.5 transition-colors"><FiFeather className="w-4" />Natural y Homeopáticos</Link>
                      <Link href="/categoria/Dermocosméticos" className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white flex items-center gap-2.5 transition-colors"><FiDroplet className="w-4" />Dermocosmética</Link>
                      <Link href="/categoria/Cuidado Infantil" className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white flex items-center gap-2.5 transition-colors"><FiSmile className="w-4" />Cuidado Infantil</Link>
                      <Link href="/categoria/Cuidado y Belleza" className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white flex items-center gap-2.5 transition-colors"><FiAward className="w-4" />Cuidado y Belleza</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Buscador cuadrado central */}
            <div
              className="relative flex-1 max-w-2xl overflow-visible"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            >
              <div className="flex items-center h-11 bg-white rounded-lg border-2 border-cyan-500 shadow-sm focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20 overflow-hidden transition-all">
                <input
                  type="text"
                  placeholder="Busca tus productos, marcas y más..."
                  className="flex-1 min-w-0 h-full pl-4 pr-2 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent border-0 outline-none focus:outline-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="w-8 h-full text-gray-400 hover:text-gray-600 flex items-center justify-center flex-shrink-0"
                    aria-label="Limpiar búsqueda"
                  >
                    <FiX size={17} />
                  </button>
                )}

                <button
                  type="button"
                  className="w-12 h-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center flex-shrink-0 transition-colors"
                  aria-label="Buscar"
                >
                  <FiSearch size={20} strokeWidth={2.5} />
                </button>
              </div>

              {isSearchFocused && <SearchResults suggestions={suggestions} />}
            </div>

            {/* Acciones de usuario */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-cyan-100/70 text-cyan-950 transition-colors"
                  >
                    <FiUser size={23} className="text-cyan-700 flex-shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="block text-[11px] text-gray-500">Hola, {firstName}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-cyan-950">
                        Mi Cuenta
                        <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl z-50 border border-gray-100">
                      <div className="p-2" onClick={() => setUserMenuOpen(false)}>
                        <Link href="/mi-cuenta" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors"><FiGrid />Mi Dashboard</Link>
                        <Link href="/mis-pedidos" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors"><FiBox />Mis Pedidos</Link>
                        <Link href="/mis-favoritos" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors"><FiHeart />Mis Favoritos</Link>
                        <Link href="/mi-perfil" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors"><FiUser />Mi Perfil</Link>
                        <Link href="/rastrear-pedido" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors"><FiTruck />Rastrear Pedido</Link>
                        <div className="border-t my-2"></div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FiLogOut />Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={guestMenuRef}>
                  <button
                    type="button"
                    onClick={() => setGuestMenuOpen(!isGuestMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-cyan-100/70 text-cyan-950 transition-colors"
                  >
                    <FiUser size={23} className="text-cyan-700 flex-shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="block text-[11px] text-gray-500">Hola, identifícate</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-cyan-950">
                        Cuenta y pedidos
                        <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isGuestMenuOpen ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                  </button>

                  {isGuestMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl p-2 z-50 border border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleOpenAuthModal('login')}
                        className="block w-full text-center px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors mb-1.5"
                      >
                        Iniciar Sesión
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAuthModal('register')}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg transition-colors hover:bg-cyan-50 hover:text-cyan-800"
                      >
                        Crear cuenta nueva
                      </button>
                      <div className="border-t my-2"></div>
                      <Link
                        href="/rastrear-pedido"
                        onClick={() => setGuestMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg transition-colors hover:bg-cyan-50 hover:text-cyan-800"
                      >
                        <FiTruck size={15} />
                        Seguimiento de tu Pedido
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <Link
                href="/mis-favoritos"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-cyan-100/70 text-cyan-950 transition-colors"
                aria-label="Mis favoritos"
              >
                <FiHeart size={21} className="text-cyan-700" />
                <span className="text-xs font-bold">Favoritos</span>
              </Link>

              <button
                type="button"
                onClick={() => openModal('carrito')}
                className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-colors shadow-sm !overflow-visible"
                aria-label={cartItemCount > 0 ? `Abrir carrito, ${cartItemCount} artículos` : 'Abrir carrito'}
              >
                <FiShoppingCart size={20} />
                <span className="text-xs font-bold hidden lg:inline">Carrito</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== VERSIÓN MÓVIL ==================== */}
      <HeaderMobile />
    </header>
  );
}