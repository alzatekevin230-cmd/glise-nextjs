"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useCarrito } from '@/contexto/ContextoCarrito';

export default function GraciasPage() {
  const { clearCart } = useCarrito();

  // Nos aseguramos de que el carrito se limpie por si el usuario llega aquí
  // sin pasar por la redirección de Wompi (ej. recargando la página).
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <i className="fas fa-check-circle text-6xl text-green-500 mb-6"></i>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">¡Gracias por tu compra!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Hemos recibido tu pedido y lo estamos procesando. Recibirás un correo electrónico de confirmación en breve con los detalles de tu compra y la guía de envío.
        </p>
        <div className="mt-8">
          <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </main>
  );
}


