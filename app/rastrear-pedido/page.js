// app/rastrear-pedido/page.js
"use client";

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebaseClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import Image from 'next/image';
import { FaTruck, FaSearch, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

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

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Rastrear Pedido', href: '/rastrear-pedido' }
  ];

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 pt-[190px] md:pt-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Si no se ha buscado, muestra el formulario */}
      {!orderData && (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-2xl mx-auto mt-8 border border-gray-100">
          {/* Hero Visual */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <FaTruck className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Seguimiento de tu Pedido</h1>
            <p className="text-gray-600 text-lg">Ingresa los datos de tu pedido para ver su estado actualizado</p>
            
            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-blue-800 font-semibold mb-1">¿Dónde encuentro mi ID de pedido?</p>
                  <p className="text-xs text-blue-700">El ID del pedido (ej: ORD-123456) lo recibiste por email después de realizar tu compra.</p>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="orderId" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaSearch className="text-blue-600" />
                ID del pedido *
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  id="orderId" 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" 
                  placeholder="Ej: ORD-123456"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-blue-600" />
                Correo electrónico de facturación *
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" 
                  placeholder="tu@email.com"
                />
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
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
            <div className="mt-6 p-5 rounded-xl border-2 bg-red-50 border-red-300 text-red-800 shadow-md">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-bold text-lg mb-2">No se encontró el pedido</p>
                  <p className="text-sm mb-3">{error}</p>
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-xs font-semibold text-red-700 mb-1">Verifica que:</p>
                    <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                      <li>El ID del pedido esté escrito correctamente</li>
                      <li>El email coincida con el de tu compra</li>
                      <li>Haya pasado al menos unos minutos desde la compra</li>
                    </ul>
                  </div>
                </div>
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
              <div className="p-6 border-t border-gray-200 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                    <FaTruck className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">Información de Envío</h3>
                    <p className="text-sm text-gray-600">Tu pedido está en camino</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <span className="font-semibold text-gray-700">Enviado con:</span>
                    <Image src="/imagenespagina/coordinadora.webp" alt="Coordinadora" width={80} height={32} className="object-contain" />
                  </div>
                  <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-lg">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Nº de Seguimiento:</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg font-bold text-gray-800 border border-gray-300">
                        {typeof orderData.trackingNumber === 'object' ? orderData.trackingNumber.$value : orderData.trackingNumber}
                      </code>
                      <a 
                        href={`https://www.coordinadora.com/portafolio-de-servicios/servicios-en-linea/rastrear-guias/?guia=${typeof orderData.trackingNumber === 'object' ? orderData.trackingNumber.$value : orderData.trackingNumber}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                      >
                        <FaTruck />
                        Rastrear en Coordinadora
                      </a>
                    </div>
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
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                    {/* Imagen */}
                    <div className="w-full md:w-24 h-32 md:h-24 rounded-xl border-2 border-gray-200 bg-white flex-shrink-0 relative overflow-hidden shadow-md">
                      <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-contain p-3" />
                    </div>
                    
                    {/* Info del producto - Móvil: vertical, Desktop: horizontal */}
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-gray-800 text-lg md:text-xl mb-3 md:mb-2">{item.name}</p>
                      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 md:gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
                          Cantidad: {item.quantity}
                        </span>
                        <span className="text-gray-600 text-sm">Precio unitario: {formatPrice(item.price)}</span>
                      </div>
                    </div>
                    
                    {/* Precio - Móvil: debajo, Desktop: derecha */}
                    <div className="md:text-right flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200 md:border-none">
                      <p className="text-xs md:text-sm text-gray-500 mb-1 md:hidden">Total:</p>
                      <p className="font-bold text-xl md:text-2xl text-blue-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Botón para buscar otro pedido */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setOrderData(null);
                  setOrderId('');
                  setEmail('');
                  setError('');
                }}
                className="w-full md:w-auto bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaSearch />
                Buscar otro pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}