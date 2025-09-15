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
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Seguimiento de tu Pedido</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">ID del pedido</label>
              <input type="text" id="orderId" value={orderId} onChange={(e) => setOrderId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:border-green-500 focus:bg-green-50 focus:ring-2 focus:ring-green-200" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico de facturación</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:border-green-500 focus:bg-green-50 focus:ring-2 focus:ring-green-200" />
            </div>
            <button type="submit" disabled={isSearching} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center">
              {isSearching ? ( <><i className="fas fa-spinner fa-spin mr-2"></i><span>Buscando...</span></> ) : ( 'Rastrear' )}
            </button>
          </form>
          {error && <p className="mt-6 text-center text-red-600 font-semibold">{error}</p>}
        </div>
      )}

      {/* Si se encontró un pedido, muestra el nuevo diseño */}
      {orderData && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg border">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-gray-800">PEDIDO #{orderData.orderId}</p>
                <p className="text-sm text-gray-500">Realizado el {formatDate(orderData.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-lg text-gray-800">{formatPrice(orderData.total)}</p>
              </div>
            </div>
            <div className="p-6">
              <OrderStatusTracker status={orderData.status} />
            </div>
            {(orderData.status === 'shipped' || orderData.status === 'delivered') && orderData.trackingNumber && (
              <div className="p-6 border-t bg-blue-50">
                  <p className="text-sm">
                    <span className="font-semibold">Enviado con:</span>
                    <img src="/imagenespagina/coordinadora.png" alt="Coordinadora" className="inline-block h-5 ml-2 align-middle" />
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">Nº de Seguimiento:</span>
                   <a href="https://rastreo.coordinadora.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2 font-medium">
  {/* CORRECCIÓN: Leemos la propiedad .$value si trackingNumber es un objeto */}
  {typeof orderData.trackingNumber === 'object' ? orderData.trackingNumber.$value : orderData.trackingNumber}
</a>
                  </p>
              </div>
            )}
            <div className="p-6 border-t">
              <h3 className="font-semibold text-lg mb-4">Artículos del pedido</h3>
              <div className="space-y-4">
                {orderData.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md border bg-gray-50 flex-shrink-0 relative">
                      <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity} | Precio: {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
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