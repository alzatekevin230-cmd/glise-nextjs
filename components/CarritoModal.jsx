"use client";

import { useRouter } from 'next/navigation';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

// --- Componente pequeño para la barra de envío gratis ---
const BarraEnvioGratis = ({ subtotal }) => {
  const envioGratisDesde = 250000;
  const progreso = Math.min((subtotal / envioGratisDesde) * 100, 100);
  const restante = envioGratisDesde - subtotal;

  if (subtotal >= envioGratisDesde) {
    return (
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">🎉</span>
          <p className="text-sm font-bold text-green-700">¡Felicidades! Tienes envío gratis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
      <p className="text-sm font-semibold text-center text-gray-800 mb-3">
        🚚 ¡Agrega <span className="font-bold text-orange-600">{formatPrice(restante)}</span> para envío gratis!
      </p>
      <div className="w-full bg-yellow-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-700 ease-out progress-bar-animate shadow-sm" 
          style={{ width: `${progreso}%` }}>
        </div>
      </div>
      <p className="text-xs text-center text-gray-600 mt-2">
        {Math.round(progreso)}% completado
      </p>
    </div>
  );
};

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

export default function CarritoModal() {
  const { modalActivo, closeModal } = useModal();
  const { cart, removeFromCart, updateQuantity, clearCart, MAX_QUANTITY_PER_ITEM, getSubtotal } = useCarrito();
  const router = useRouter();
  const [shakingItem, setShakingItem] = useState(null);
  const modalRef = useRef(null);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && modalActivo === 'carrito') {
        closeModal();
      }
    };
    
    if (modalActivo === 'carrito') {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [modalActivo, closeModal]);

  if (modalActivo !== 'carrito') {
    return null;
  }

  const handleGoToCheckout = () => {
    closeModal();
    router.push('/checkout');
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id);
    toast.success(`🗑️ ${item.name} eliminado del carrito`, {
      duration: 2000,
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    const result = updateQuantity(item.id, newQuantity);
    
    if (result && !result.success && result.reason === 'max_limit') {
      // Shake animation
      setShakingItem(item.id);
      setTimeout(() => setShakingItem(null), 300);
      toast.error(`⚠️ Máximo ${MAX_QUANTITY_PER_ITEM} unidades por producto`, {
        duration: 2000,
      });
    }
  };

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      clearCart();
      toast.success('🗑️ Carrito vaciado', {
        duration: 2000,
      });
    }
  };

  const subtotal = getSubtotal();
  const total = subtotal;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn" 
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out scale-100" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 id="cart-title" className="text-2xl font-bold text-gray-900">
              Tu Carrito
            </h3>
            {cart.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </div>
          <button 
            onClick={closeModal} 
            className="text-gray-500 hover:text-gray-800 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors text-2xl"
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>
        
        {/* Body - Lista de productos */}
        <div className="p-5 overflow-y-auto flex-grow">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <button
                onClick={closeModal}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Ir a comprar
              </button>
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex justify-between items-center gap-4 mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0 cart-item-animate ${shakingItem === item.id ? 'animate-shake' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Imagen y Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image 
                        src={item.image || item.images?.[0] || 'https://placehold.co/100x100'} 
                        alt={item.name} 
                        fill 
                        className="object-contain"
                        quality={60}
                        sizes="80px"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm">
                        <p className="text-gray-600">{formatPrice(item.price)}</p>
                        <span className="text-gray-400">×</span>
                        <p className="font-semibold text-gray-900">{item.quantity}</p>
                      </div>
                      <p className="text-blue-600 font-bold text-base mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)} 
                        className="px-3 h-9 md:h-8 font-bold text-lg flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition btn-quantity"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="px-4 text-base font-bold min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)} 
                        className="px-3 h-9 md:h-8 font-bold text-lg flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition btn-quantity disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity >= MAX_QUANTITY_PER_ITEM}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item)} 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center justify-center transition"
                      style={{width: '36px', height: '36px', minWidth: '36px', minHeight: '36px'}}
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <FaTrashAlt style={{width: '20px', height: '20px', minWidth: '20px', minHeight: '20px'}} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Footer - Totales y Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t bg-gray-50">
            <BarraEnvioGratis subtotal={subtotal} />

            {/* Botón vaciar carrito */}
            <button
              onClick={handleClearCart}
              className="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition mb-4 font-medium"
            >
              🗑️ Vaciar carrito
            </button>

            {/* Totales */}
            <div className="space-y-3 text-lg mb-5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-2xl pt-3 border-t-2">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Botón Checkout */}
            <button 
              onClick={handleGoToCheckout}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
            >
              Finalizar Compra 🛍️
            </button>

            <p className="text-xs text-center text-gray-500 mt-3">
              Los gastos de envío se calcularán en el checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
