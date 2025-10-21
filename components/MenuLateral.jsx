// components/MenuLateral.jsx
"use client";

// 1. IMPORTA 'useEffect' de React
import { useEffect } from 'react';
import Link from 'next/link';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useAuth } from '@/contexto/ContextoAuth';
import { useModal } from '@/contexto/ContextoModal';
import { FaTimes, FaStore, FaTachometerAlt, FaBox, FaHeart, FaUser, FaTruck, FaSignInAlt, FaSignOutAlt, FaLeaf, FaSpa, FaYinYang, FaBaby, FaGem } from 'react-icons/fa';

const mainCategories = [
    { name: 'Natural', Icon: FaLeaf, colorClass: 'icon-natural', filter: 'Naturales y Homeopáticos' },
    { name: 'Dermocosmética', Icon: FaSpa, colorClass: 'icon-dermo', filter: 'Dermocosméticos' },
    { name: 'Milenario', Icon: FaYinYang, colorClass: 'icon-milenario', filter: 'Milenario' },
    { name: 'Infantil', Icon: FaBaby, colorClass: 'icon-infantil', filter: 'Cuidado Infantil' },
    { name: 'Belleza', Icon: FaGem, colorClass: 'icon-belleza', filter: 'Cuidado y Belleza' }
];

export default function MenuLateral() {
  const { isMenuOpen, closeMenu } = useMenuLateral();
  const { currentUser, logout } = useAuth();
  const { openModal } = useModal();

  // ==================================================================
  // === INICIO DE LA SOLUCIÓN ===
  // 2. AÑADE ESTE BLOQUE 'useEffect'
  // ==================================================================
  useEffect(() => {
    // Si el menú está abierto, bloqueamos el scroll del body
    if (isMenuOpen) {
      document.body.classList.add('body-no-scroll');
    } else {
      // Si está cerrado, permitimos el scroll de nuevo
      document.body.classList.remove('body-no-scroll');
    }
    
    // Función de limpieza: se asegura de que el scroll se reactive si el componente desaparece
    return () => {
      document.body.classList.remove('body-no-scroll');
    };
  }, [isMenuOpen]); // Este efecto se ejecuta cada vez que 'isMenuOpen' cambia
  // ==================================================================
  // === FIN DE LA SOLUCIÓN ===
  // ==================================================================


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

  // El resto del componente queda exactamente igual
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
              <FaTimes />Cerrar
            </button>
          </div>
          
          <div className="p-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-cyan-200">
              <div className="flex items-center justify-center gap-3 mb-2">
                <FaTruck className="text-3xl text-cyan-600" />
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
              <FaStore />Ver Todos los Productos
            </Link>
            
            <div className="menu-divider"></div>
            
            <h3 className="menu-section-title">Categorías</h3>
            {mainCategories.map(cat => {
              const Icon = cat.Icon;
              return (
                <Link key={cat.name} href={`/categoria/${cat.filter}`} onClick={closeMenu} className="menu-link">
                  <Icon className={cat.colorClass} />{cat.name}
                </Link>
              );
            })}

            <div className="menu-divider"></div>

            {currentUser ? (
              <>
                <h3 className="menu-section-title">Mi Cuenta</h3>
                <p className="px-2 py-1 text-sm text-gray-500">Hola, {currentUser.displayName || currentUser.email}</p>
                <Link href="/mi-cuenta" onClick={closeMenu} className="menu-link"><FaTachometerAlt />Mi Dashboard</Link>
                <Link href="/mis-pedidos" onClick={closeMenu} className="menu-link"><FaBox />Mis Pedidos</Link>
                <Link href="/mis-favoritos" onClick={closeMenu} className="menu-link"><FaHeart />Mis Favoritos</Link>
                <Link href="/mi-perfil" onClick={closeMenu} className="menu-link"><FaUser />Mi Perfil</Link>
                <Link href="/rastrear-pedido" onClick={closeMenu} className="menu-link"><FaTruck />Rastrear Pedido</Link>
                <button onClick={handleLogout} className="menu-link logout-link w-full text-left">
                  <FaSignOutAlt />Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoginClick} className="menu-link w-full text-left">
                  <FaSignInAlt />Ingresar / Registrarse
                </button>
                <div className="menu-divider"></div>
                <Link href="/rastrear-pedido" onClick={closeMenu} className="menu-link"><FaTruck />Rastrear Pedido</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}