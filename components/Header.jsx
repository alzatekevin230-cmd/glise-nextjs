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
import { FaHome, FaStore, FaLeaf, FaSpa, FaYinYang, FaBaby, FaGem, FaSearch, FaChevronDown } from 'react-icons/fa';

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

  const handleLogout = async () => {
    try { 
      await logout();
      setUserMenuOpen(false);
    } catch (error) { console.error("Error al cerrar sesión:", error); }
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
  }, [guestMenuRef, menuRef, userMenuRef]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 h-28 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          <div className="flex-shrink-0">
            <Link href="/"><Image src="/imagenespagina/logodeglise.webp" alt="Logo Glisé" width={150} height={96} className="h-24 w-auto" style={{ width: 'auto' }} priority /></Link>
          </div>
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center justify-between bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-3 rounded-full transition-colors duration-200">
              <span className="mr-2">Menú</span>
              <FaChevronDown className={`text-xs transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border" onClick={() => setIsMenuOpen(false)}>
                <div className="p-2">
                  <Link href="/" className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white flex items-center gap-2"><FaHome className="w-4" />Inicio</Link>
                  <Link href="/categoria/all" className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white flex items-center gap-2"><FaStore className="w-4" />Tienda</Link>
                  <Link href="/categoria/Naturales y Homeopáticos" className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white flex items-center gap-2"><FaLeaf className="w-4" />Natural</Link>
                  <Link href="/categoria/Dermocosméticos" className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white flex items-center gap-2"><FaSpa className="w-4" />Dermocosmética</Link>
                  <Link href="/categoria/Milenario" className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white flex items-center gap-2"><FaYinYang className="w-4" />Milenario</Link>
                  <Link href="/categoria/Cuidado Infantil" className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white flex items-center gap-2"><FaBaby className="w-4" />Infantil</Link>
                  <Link href="/categoria/Cuidado y Belleza" className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white flex items-center gap-2"><FaGem className="w-4" />Belleza</Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
          <div className="relative w-full max-w-3xl md:max-w-sm lg:max-w-3xl mx-8 md:mx-2 lg:mx-8" onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}>
            <input type="text" placeholder="Busca tus productos, marcas y más..." className="w-full pl-5 pr-16 py-3 border-2 border-cyan-500 rounded-full focus:outline-none focus:rounded-full focus:border-cyan-600 transition-colors" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 text-white w-10 h-10 rounded-full hover:bg-cyan-700 flex items-center justify-center transition-transform duration-200 hover:scale-110" aria-label="Buscar"><FaSearch /></button>
            {isSearchFocused && <SearchResults suggestions={suggestions} />}
          </div>

          <div className="flex items-center gap-x-6 flex-shrink-0">
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors">
                <i className="fas fa-user-circle fa-2x"></i>
                <span className="text-sm font-medium">Hola, {currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0] || 'Usuario'}</span>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                  <div className="p-2" onClick={() => setUserMenuOpen(false)}>
                    <Link href="/mi-cuenta" className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white">Mi Dashboard</Link>
                    <Link href="/mis-pedidos" className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white">Mis Pedidos</Link>
                    <Link href="/mis-favoritos" className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white">Mis Favoritos</Link>
                    <Link href="/mi-perfil" className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white">Mi Perfil</Link>
                    <Link href="/rastrear-pedido" className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-blue-500 hover:text-white">Rastrear Pedido</Link>
                    <div className="border-t my-2"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-500 hover:text-white">Cerrar Sesión</button>
                  </div>
                </div>
              )}
            </div>
          ) : ( 
            <div className="relative" ref={guestMenuRef}>
              <button onClick={() => setGuestMenuOpen(!isGuestMenuOpen)} className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors">
                <i className="fas fa-user-circle fa-2x"></i>
                <span className="text-sm font-medium">Mi Cuenta</span>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isGuestMenuOpen ? 'rotate-180' : ''}`}></i>
              </button>
              {isGuestMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-xl p-2 z-20 border">
                  <button onClick={() => handleOpenAuthModal('login')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md transition-colors hover:bg-blue-500 hover:text-white font-semibold">Iniciar Sesión</button>
                  <button onClick={() => handleOpenAuthModal('register')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md transition-colors hover:bg-blue-500 hover:text-white">Registrarse</button>
                  <div className="border-t my-2"></div>
                  <Link href="/rastrear-pedido" onClick={() => setGuestMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md transition-colors hover:bg-blue-500 hover:text-white">Seguimiento de tu Pedido</Link>
                </div>
              )}
            </div>
          )}
          <button onClick={() => openModal('carrito')} className="relative text-cyan-600 hover:text-cyan-700 transition-colors p-3">
            <i className="fas fa-shopping-cart fa-2x"></i>
            {cartItemCount > 0 && ( <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span> )}
          </button>
        </div>
      </div>
      <HeaderMobile />
    </header>
  );
}