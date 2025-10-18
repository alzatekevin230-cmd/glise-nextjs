// app/rastrear-pedido/page.js
"use client";

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebaseClient';
import BotonVolver from '@/components/BotonVolver';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import Image from 'next/image';

// Función para formatear precios
const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

// --- FUNCIÓN CORREGIDA ---
// Esta función ahora sabe cómo leer el objeto de fecha que viene del servidor.
const formatDate = (timestamp) => {
  // Verificamos si el timestamp tiene la propiedad _seconds (que viene del servidor)
  if (timestamp && timestamp._seconds) {
    // Si la tiene, la usamos para crear la fecha
    return new Date(timestamp._seconds * 1000).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  // Si no, devolvemos un texto por defecto
  return 'Fecha no disponible';
};

export default function RastrearPedidoPage() {
  const functions = getFunctions(app);
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    setOrderData(null);
    try {
      const trackOrder = httpsCallable(functions, 'trackOrder');
      const result = await trackOrder({ orderId, email });
      if (result.data.found) {
        setOrderData(result.data);
      } else {
        setError('No se encontró ningún pedido con los datos proporcionados. Por favor, verifica la información.');
      }
    } catch (err) {
      setError('Ocurrió un error al buscar tu pedido. Inténtalo más tarde.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="container mx-auto px-4 sm-px-6 py-8">
      <BotonVolver texto="Volver"/>

      {/* Si no se ha buscado, muestra el formulario */}
      {!orderData && (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-2xl mx-auto mt-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Seguimiento de tu Pedido</h1>
            <p className="text-gray-600">Ingresa los datos de tu pedido para ver su estado</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="orderId" className="block text-sm font-semibold text-gray-700 mb-2">ID del pedido *</label>
              <input 
                type="text" 
                id="orderId" 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)} 
                required 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" 
                placeholder="Ej: ORD-123456"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico de facturación *</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" 
                placeholder="tu@email.com"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSearching} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {isSearching ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando pedido...
                </span>
              ) : (
                'Rastrear Pedido'
              )}
            </button>
          </form>
          
          {error && (
            <div className="mt-6 p-4 rounded-xl border-2 bg-red-50 border-red-200 text-red-800">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Si se encontró un pedido, muestra el nuevo diseño */}
      {orderData && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="font-bold text-xl text-gray-800">PEDIDO #{orderData.orderId}</p>
                  <p className="text-sm text-gray-600 mt-1">Realizado el {formatDate(orderData.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total del pedido</p>
                  <p className="font-bold text-2xl text-blue-600">{formatPrice(orderData.total)}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <OrderStatusTracker status={orderData.status} />
            </div>
            {(orderData.status === 'shipped' || orderData.status === 'delivered') && orderData.trackingNumber && (
              <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-bold text-lg text-gray-800">Información de Envío</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 mr-2">Enviado con:</span>
                    <img src="/imagenespagina/coordinadora.webp" alt="Coordinadora" className="h-6" />
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-semibold text-gray-700">Nº de Seguimiento:</span>
                    <a 
                      href="https://rastreo.coordinadora.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      {typeof orderData.trackingNumber === 'object' ? orderData.trackingNumber.$value : orderData.trackingNumber}
                    </a>
                  </div>
                </div>
              </div>
            )}
            <div className="p-6 border-t border-gray-200">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
                Artículos del pedido
              </h3>
              <div className="space-y-4">
                {orderData.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 rounded-lg border-2 border-gray-200 bg-white flex-shrink-0 relative overflow-hidden">
                      <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800 text-lg">{item.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                          Cantidad: {item.quantity}
                        </span>
                        <span className="text-gray-500">Precio unitario: {formatPrice(item.price)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-blue-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}