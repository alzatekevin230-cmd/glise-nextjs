"use client";

import { useRouter } from 'next/navigation';
import { useModal } from '@/contexto/ContextoModal';
import { useCarrito } from '@/contexto/ContextoCarrito';
import Image from 'next/image';

// --- Componente pequeño para la barra de envío gratis ---
const BarraEnvioGratis = ({ subtotal }) => {
  const envioGratisDesde = 250000;

  if (subtotal >= envioGratisDesde) {
    return (
      <div className="mb-4 p-3 bg-green-50 rounded-lg text-center">
        <p className="text-sm font-semibold text-green-700">✅ ¡Felicidades! Tienes envío gratis.</p>
      </div>
    );
  }

  const restante = envioGratisDesde - subtotal;
  const progreso = Math.min((subtotal / envioGratisDesde) * 100, 100);

  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm font-semibold text-center text-yellow-800 mb-2">
        ¡Agrega <span className="font-bold">{formatPrice(restante)}</span> y obtén envío gratis!
      </p>
      <div className="w-full bg-yellow-200 rounded-full h-2.5">
        <div 
          className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progreso}%` }}>
        </div>
      </div>
    </div>
  );
};

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

export default function CarritoModal() {
  const { modalActivo, closeModal } = useModal();
  const { cart, removeFromCart, updateQuantity } = useCarrito();
  const router = useRouter();

  if (modalActivo !== 'carrito') {
    return null;
  }

  const handleGoToCheckout = () => {
    closeModal();
    router.push('/checkout');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Por ahora, el descuento es 0. Se puede añadir lógica de cupones en el futuro.
  const descuento = 0; 
  const total = subtotal - descuento;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={closeModal}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out scale-100" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-2xl font-bold">Tu Carrito</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-grow">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Tu carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image 
                      src={item.image || item.images?.[0] || 'https://placehold.co/100x100'} 
                      alt={item.name} 
                      fill 
                      className="object-contain rounded-md"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 h-7 font-semibold text-lg flex items-center justify-center">-</button>
                    <span className="px-3 text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 h-7 font-semibold text-lg flex items-center justify-center">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 w-7 h-7 flex items-center justify-center text-lg"><i className="fas fa-trash-alt"></i></button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* --- SECCIÓN DE TOTALES ACTUALIZADA --- */}
        {cart.length > 0 && (
          <div className="p-5 border-t bg-gray-50">
            <BarraEnvioGratis subtotal={subtotal} />

            <div className="space-y-2 text-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className="font-semibold">Descuento:</span>
                <span>-{formatPrice(descuento)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-2xl pt-2 border-t">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              onClick={handleGoToCheckout}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 mt-6 text-lg"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}