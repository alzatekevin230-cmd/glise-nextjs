// components/MenuLateral.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useAuth } from '@/contexto/ContextoAuth';
import { useModal } from '@/contexto/ContextoModal';
import { 
  FiX, FiShoppingBag, FiGrid, FiBox, FiHeart, FiUser, FiTruck, FiLogIn, FiLogOut, 
  FiFeather, FiDroplet, FiSun, FiSmile, FiAward, FiTag, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';

const mainCategories = [
    { name: 'Natural', Icon: FiFeather, filter: 'Naturales y Homeopáticos' },
    { name: 'Dermocosmética', Icon: FiDroplet, filter: 'Dermocosméticos' },
    { name: 'Milenario', Icon: FiSun, filter: 'Milenario' },
    { name: 'Infantil', Icon: FiSmile, filter: 'Cuidado Infantil' },
    { name: 'Belleza', Icon: FiAward, filter: 'Cuidado y Belleza' }
];

export default function MenuLateral() {
  const { isMenuOpen, closeMenu } = useMenuLateral();
  const { currentUser, logout } = useAuth();
  const { openModal } = useModal();
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

  const brands = [
    { name: 'NIVEA', link: '/marca/NIVEA' },
    { name: 'EUCERIN', link: '/marca/EUCERIN' },
    { name: 'ISDIN', link: '/marca/ISDIN' },
    { name: 'CERAVE', link: '/marca/CERAVE' },
    { name: 'HEEL', link: '/marca/Heel' },
    { name: 'FUNAT', link: '/marca/FUNAT' },
    { name: 'DERMANAT', link: '/marca/DERMANAT' },
    { name: 'ALMIPRO', link: '/marca/ALMIPRO' },
    { name: 'GLISÉ', link: '/marca/GLISÉ' }
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    
    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [isMenuOpen]);


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
            <button onClick={closeMenu} className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FiX />Cerrar
            </button>
          </div>
          
          <div className="p-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-cyan-200">
              <div className="flex items-center justify-center gap-3 mb-2">
                <FiTruck className="text-3xl text-cyan-600" />
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">Envíos a todo Colombia</p>
                  <p className="text-xs text-gray-600">Llevamos bienestar hasta tu puerta</p>
                </div>
              </div>
            </div>
          </div>
          
          <div id="side-menu-content" className="p-4 flex-grow">
            <h3 className="menu-section-title">Tienda</h3>
            <Link href="/categoria/all" onClick={closeMenu} className="menu-link">
              <FiShoppingBag />Ver Todos los Productos
            </Link>
            
            <div className="menu-divider"></div>
            
            <h3 className="menu-section-title">Categorías</h3>
            {mainCategories.map(cat => {
              const Icon = cat.Icon;
              return (
                <Link key={cat.name} href={`/categoria/${cat.filter}`} onClick={closeMenu} className="menu-link">
                  <Icon />{cat.name}
                </Link>
              );
            })}

            <div className="menu-divider"></div>

            <button 
              onClick={() => setIsBrandsOpen(!isBrandsOpen)} 
              className="menu-link w-full text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                  <FiTag /> Marcas
              </div>
              {isBrandsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {isBrandsOpen && (
              <div className="pl-8 bg-gray-50 py-2 rounded-lg mt-1 space-y-2">
                  {brands.map(brand => (
                      <Link 
                          key={brand.name} 
                          href={brand.link} 
                          onClick={closeMenu} 
                          className="flex items-center gap-3 py-2 text-gray-600 hover:text-cyan-600 transition-colors"
                      >
                          <span className="text-sm font-medium">{brand.name}</span>
                      </Link>
                  ))}
              </div>
            )}

            <div className="menu-divider"></div>

            {currentUser ? (
              <>
                <h3 className="menu-section-title">Mi Cuenta</h3>
                <p className="px-2 py-1 text-sm text-gray-500">Hola, {currentUser.displayName || currentUser.email}</p>
                <Link href="/mi-cuenta" onClick={closeMenu} className="menu-link"><FiGrid />Mi Dashboard</Link>
                <Link href="/mis-pedidos" onClick={closeMenu} className="menu-link"><FiBox />Mis Pedidos</Link>
                <Link href="/mis-favoritos" onClick={closeMenu} className="menu-link"><FiHeart />Mis Favoritos</Link>
                <Link href="/mi-perfil" onClick={closeMenu} className="menu-link"><FiUser />Mi Perfil</Link>
                <Link href="/rastrear-pedido" onClick={closeMenu} className="menu-link"><FiTruck />Rastrear Pedido</Link>
                <button onClick={handleLogout} className="menu-link logout-link w-full text-left">
                  <FiLogOut />Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoginClick} className="menu-link w-full text-left">
                  <FiLogIn />Ingresar / Registrarse
                </button>
                <div className="menu-divider"></div>
                <Link href="/rastrear-pedido" onClick={closeMenu} className="menu-link"><FiTruck />Rastrear Pedido</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}