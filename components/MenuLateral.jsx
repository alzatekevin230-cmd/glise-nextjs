// app/components/MenuLateral.jsx
"use client";

import Link from 'next/link';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useAuth } from '@/contexto/ContextoAuth';
import { useModal } from '@/contexto/ContextoModal';

const mainCategories = [
    { name: 'Natural', icon: 'fa-leaf', colorClass: 'icon-natural', filter: 'Naturales y Homeopáticos' },
    { name: 'Dermocosmética', icon: 'fa-spa', colorClass: 'icon-dermo', filter: 'Dermocosméticos' },
    { name: 'Milenario', icon: 'fa-yin-yang', colorClass: 'icon-milenario', filter: 'Milenario' },
    { name: 'Infantil', icon: 'fa-baby', colorClass: 'icon-infantil', filter: 'Cuidado Infantil' },
    { name: 'Belleza', icon: 'fa-gem', colorClass: 'icon-belleza', filter: 'Cuidado y Belleza' }
];

export default function MenuLateral() {
  const { isMenuOpen, closeMenu } = useMenuLateral();
  const { currentUser, logout } = useAuth();
  const { openModal } = useModal();

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  const handleLoginClick = () => {
    closeMenu();
    openModal('auth');
  };

  if (!isMenuOpen) {
    return null;
  }

  return (
    <div>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={closeMenu}
      ></div>
      
      <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 overflow-y-auto transition-transform duration-300 transform translate-x-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">MENÚ</h2>
            <button onClick={closeMenu} className="text-lg font-semibold text-gray-700">
              <i className="fas fa-times mr-2"></i>Cerrar
            </button>
          </div>
          
          {/* --- CAMBIO 1: Creamos un nuevo contenedor para el buscador --- */}
          <div className="p-4 border-b bg-pink-50">
            <div className="relative">
              <input type="text" placeholder="Busca tus productos..." className="w-full pl-5 pr-12 py-3 border-2 border-cyan-500 rounded-full text-sm" />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 text-white w-9 h-9 rounded-full flex items-center justify-center">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          
          {/* --- CAMBIO 2: El buscador ya no está aquí dentro --- */}
          <div id="side-menu-content" className="p-4 flex-grow">
            <h3 className="menu-section-title">Tienda</h3>
            <Link href="/categoria/all" onClick={closeMenu} className="menu-link">
              <i className="fas fa-store"></i>Ver Todos los Productos
            </Link>
            
            <div className="menu-divider"></div>
            
            <h3 className="menu-section-title">Categorías</h3>
            {mainCategories.map(cat => (
              <Link key={cat.name} href={`/categoria/${cat.filter}`} onClick={closeMenu} className="menu-link">
                <i className={`fas ${cat.icon} ${cat.colorClass}`}></i>{cat.name}
              </Link>
            ))}

            <div className="menu-divider"></div>

            {currentUser ? (
              <>
                <h3 className="menu-section-title">Mi Cuenta</h3>
                <p className="px-2 py-1 text-sm text-gray-500">Hola, {currentUser.displayName || currentUser.email}</p>
                <Link href="/mis-pedidos" onClick={closeMenu} className="menu-link"><i className="fas fa-box"></i>Mis Pedidos</Link>
                <Link href="/rastrear-pedido" onClick={closeMenu} className="menu-link"><i className="fas fa-truck-fast"></i>Rastrear Pedido</Link>
                <button onClick={handleLogout} className="menu-link logout-link w-full text-left">
                  <i className="fas fa-sign-out-alt"></i>Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoginClick} className="menu-link w-full text-left">
                  <i className="fas fa-sign-in-alt"></i>Ingresar / Registrarse
                </button>
                <div className="menu-divider"></div>
                <Link href="/rastrear-pedido" onClick={closeMenu} className="menu-link"><i className="fas fa-truck-fast"></i>Rastrear Pedido</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}