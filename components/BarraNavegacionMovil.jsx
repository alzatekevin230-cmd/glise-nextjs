// app/components/BarraNavegacionMovil.jsx
"use client";

import Link from 'next/link';
import { useModal } from '@/contexto/ContextoModal';
import { useAuth } from '@/contexto/ContextoAuth';
import { useMenuLateral } from '@/contexto/ContextoMenuLateral';
import { useCarrito } from '@/contexto/ContextoCarrito';

export default function BarraNavegacionMovil() {
  const { openModal } = useModal();
  const { openMenu } = useMenuLateral();
  const { currentUser } = useAuth();
  const { cart } = useCarrito();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (currentUser) {
      openMenu();
    } else {
      openModal('auth');
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-pink-50 border-t border-pink-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30 flex justify-around items-center h-20">
      <Link href="/categoria/all" className="flex flex-col items-center justify-center text-cyan-600 hover:text-cyan-800 transition-colors w-full h-full">
        <i className="fas fa-store text-2xl"></i>
        <span className="text-xs mt-1 font-medium">Tienda</span>
      </Link>

      <a href="#" onClick={(e) => { e.preventDefault(); openModal('carrito'); }} className="relative flex flex-col items-center justify-center text-cyan-600 hover:text-cyan-800 transition-colors w-full h-full">
  <i className="fas fa-shopping-cart text-2xl"></i>
  <span className="text-xs mt-1 font-medium">Carrito</span>
  {totalItems > 0 && (
    <span className="absolute top-2 right-6 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {totalItems}
    </span>
  )}
</a>

      <a href="#" onClick={handleAccountClick} className="flex flex-col items-center justify-center text-cyan-600 hover:text-cyan-800 transition-colors w-full h-full">
        <i className="fas fa-user-circle text-2xl"></i>
        <span className="text-xs mt-1 font-medium">Mi Cuenta</span>
      </a>
    </nav>
  );
}