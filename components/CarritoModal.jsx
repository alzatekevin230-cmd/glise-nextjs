"use client";

import { useRouter } from 'next/navigation';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { FaTrashAlt, FaShoppingCart, FaTimes, FaCheck } from 'react-icons/fa';
import Confetti from 'react-confetti';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

// Componente de barra de envío gratis mejorado
const BarraEnvioGratis = ({ subtotal }) => {
  const envioGratisDesde = 250000;
  const progreso = Math.min((subtotal / envioGratisDesde) * 100, 100);
  const restante = envioGratisDesde - subtotal;
  const porcentaje = Math.round(progreso);
  const ahorro = subtotal > envioGratisDesde ? subtotal - envioGratisDesde : 0;

  // Cuando ALCANZA o SUPERA el objetivo
  if (subtotal >= envioGratisDesde) {
    return (
      <div className="mb-5 p-4 sm:p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl border-2 border-green-200 shadow-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FaCheck className="text-green-600 text-xl" />
          <p className="text-base font-bold text-green-700">¡Felicitaciones! Tienes envío GRATIS</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: '100%' }}
          />
        </div>
        <p className="text-xs text-center text-green-700 font-semibold">
          100% completado ✓
        </p>
        {ahorro > 0 && (
          <p className="text-xs text-center text-gray-600 mt-1">
            Has ahorrado {formatPrice(ahorro)} en envío
          </p>
        )}
      </div>
    );
  }

  // Cuando está MUY CERCA (más del 90%)
  if (progreso >= 90) {
    return (
      <div className="mb-5 p-4 sm:p-5 bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 rounded-xl border border-cyan-200 shadow-sm">
        <p className="text-sm font-semibold text-center text-gray-800 mb-3">
          ¡Solo <span className="font-bold text-cyan-600 text-base">{formatPrice(restante)}</span> más para envío gratis!
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-xs text-center text-cyan-700 font-semibold">
          {porcentaje}% completado
        </p>
      </div>
    );
  }

  // Estado normal (cuando está lejos)
  return (
    <div className="mb-5 p-4 sm:p-5 bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 rounded-xl border border-cyan-200 shadow-sm">
      <p className="text-sm font-semibold text-center text-gray-800 mb-3">
        ¡Agrega <span className="font-bold text-cyan-600 text-base">{formatPrice(restante)}</span> y obtén envío gratis!
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progreso}%` }}
        />
      </div>
      <p className="text-xs text-center text-cyan-700 font-semibold">
        {porcentaje}% completado
      </p>
    </div>
  );
};

export default function CarritoModal() {
  const { modalActivo, closeModal } = useModal();
  const { cart, removeFromCart, updateQuantity, clearCart, MAX_QUANTITY_PER_ITEM, getSubtotal } = useCarrito();
  const router = useRouter();
  const [shakingItem, setShakingItem] = useState(null);
  const modalRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const prevSubtotalRef = useRef(0);

  // Obtener tamaño de ventana para el confetti
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Detectar cuando se cruza exactamente el umbral de envío gratis y activar confetti
  useEffect(() => {
    const subtotal = getSubtotal();
    const envioGratisDesde = 250000;
    const prevSubtotal = prevSubtotalRef.current;
    
    // Solo activar confetti cuando se cruza el umbral (de estar por debajo a estar por encima)
    const estabaPorDebajo = prevSubtotal < envioGratisDesde;
    const ahoraPorEncima = subtotal >= envioGratisDesde;
    
    if (estabaPorDebajo && ahoraPorEncima) {
      setShowConfetti(true);
      
      // Desactivar confetti después de 3.5 segundos
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3500);
      
      // Actualizar el subtotal anterior
      prevSubtotalRef.current = subtotal;
      
      return () => clearTimeout(timer);
    }
    
    // Actualizar el subtotal anterior
    prevSubtotalRef.current = subtotal;
  }, [cart, getSubtotal]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && modalActivo === 'carrito') {
        closeModal();
      }
    };
    
    if (modalActivo === 'carrito') {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
      setIsAnimating(false);
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
    toast.success(`${item.name} eliminado del carrito`, {
      duration: 2000,
      style: {
        background: '#0891b2',
        color: '#fff',
      },
    });
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    const result = updateQuantity(item.id, newQuantity);
    
    if (result && !result.success && result.reason === 'max_limit') {
      setShakingItem(item.id);
      setTimeout(() => setShakingItem(null), 300);
      toast.error(`Máximo ${MAX_QUANTITY_PER_ITEM} unidades por producto`, {
        duration: 2000,
      });
    }
  };

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      clearCart();
      toast.success('Carrito vaciado', {
        duration: 2000,
      });
    }
  };

  const subtotal = getSubtotal();
  const total = subtotal;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Confetti cuando se alcanza el 100% */}
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#0891b2', '#06b6d4', '#14b8a6', '#0d9488', '#2dd4bf', '#5eead4']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      {/* Overlay oscuro */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      />
      
      {/* Panel lateral deslizante */}
      <div 
        ref={modalRef}
        className={`fixed top-0 right-0 h-full w-[calc(100%-48px)] sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER DEL CARRITO */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div>
            <h3 id="cart-title" className="text-xl font-bold text-black">
              Carrito de compras
            </h3>
            {cart.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                ({totalItems.toString().padStart(2, '0')}) Ítems
              </p>
            )}
          </div>
          <button 
            onClick={closeModal} 
            className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded p-1 transition"
            aria-label="Cerrar carrito"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
        
        {/* BODY - Lista de productos con scroll */}
        <div className="flex-1 overflow-y-auto cart-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg mb-6">Tu carrito está vacío</p>
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition font-semibold"
              >
                Ir a comprar
              </button>
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              {cart.map((item, index) => {
                const marca = item.laboratorio || item.brand || '';
                const presentacion = item.presentation || item.presentacion || '';
                const precioAnterior = item.oldPrice || item.priceBefore || null;
                const precioActual = item.price;
                
                return (
                  <div 
                    key={item.id} 
                    className={`pb-5 mb-5 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0 ${shakingItem === item.id ? 'animate-shake' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Container del Item - Layout de 3 columnas */}
                    <div className="flex gap-4 relative">
                      {/* Columna Izquierda - Imagen */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <Image 
                          src={item.image || item.images?.[0] || 'https://placehold.co/100x100'} 
                          alt={item.name} 
                          fill 
                          className="object-contain p-1"
                          quality={60}
                          sizes="80px"
                          loading="lazy"
                        />
                      </div>

                      {/* Columna Central - Información */}
                      <div className="flex-1 min-w-0 pr-2">
                        {marca && (
                          <p className="text-xs text-gray-600 uppercase font-medium mb-1">
                            {marca}
                          </p>
                        )}
                        <h4 className="font-semibold text-sm text-black leading-tight mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        {presentacion && (
                          <p className="text-xs text-gray-500 mb-2">
                            {presentacion}
                          </p>
                        )}
                        <div className="flex flex-col gap-1">
                          {precioAnterior && precioAnterior > precioActual && (
                            <p className="text-xs text-gray-500 line-through">
                              {formatPrice(precioAnterior)}
                            </p>
                          )}
                          <p className="text-cyan-600 font-bold text-lg">
                            Ahora {formatPrice(precioActual)}
                          </p>
                        </div>
                      </div>

                      {/* Columna Derecha - Controles */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        {/* Botón basura (eliminar) - esquina superior derecha */}
                        <button 
                          onClick={() => handleRemoveItem(item)} 
                          className="text-cyan-600 hover:text-cyan-700 flex items-center justify-center transition flex-shrink-0"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <FaTrashAlt className="text-base" />
                        </button>

                        {/* Control de cantidad */}
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                          <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)} 
                            className="px-3 h-9 bg-white border-r border-gray-300 font-bold text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition text-lg flex items-center justify-center min-w-[36px]"
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="px-3 text-base font-semibold text-center min-w-[40px] bg-white">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)} 
                            className="px-3 h-9 bg-white border-l border-gray-300 font-bold text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition text-lg flex items-center justify-center min-w-[36px] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= MAX_QUANTITY_PER_ITEM}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* FOOTER DEL CARRITO */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white flex-shrink-0 p-5 sm:p-6">
            {/* Barra de envío gratis */}
            <BarraEnvioGratis subtotal={subtotal} />

            {/* Sección de Totales */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-medium text-black">Subtotal</span>
                <span className="text-base font-medium text-black">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 mb-4">
                <span className="text-xl font-bold text-black">Total</span>
                <span className="text-xl font-bold text-black">{formatPrice(total)}</span>
              </div>

              {/* Nota de Envío */}
              <p className="text-xs text-gray-500 mb-5">
                Gastos de envío e impuestos calculados al finalizar la compra.
              </p>
            </div>

            {/* Botón Finalizar Compra */}
            <button 
              onClick={handleGoToCheckout}
              disabled={cart.length === 0}
              className="w-full bg-cyan-600 text-white font-bold py-4 px-6 rounded-[28px] hover:bg-cyan-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-3"
            >
              <FaShoppingCart />
              <span>Finalizar Compra</span>
            </button>

            {/* Botón Vaciar todo el carrito */}
            <button
              onClick={handleClearCart}
              className="w-full bg-transparent border-2 border-cyan-600 text-cyan-600 font-semibold py-3 px-6 rounded-[28px] hover:bg-cyan-50 transition-all flex items-center justify-center gap-2"
            >
              <FaTrashAlt />
              <span>Vaciar todo el carrito</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
