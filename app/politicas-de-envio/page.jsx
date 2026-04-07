import React from 'react';
import Link from 'next/link';
import { FaTruck, FaClock, FaMapMarkedAlt, FaMoneyBillWave, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';

export const metadata = {
  title: 'Políticas de Envío | Glisé',
  description: 'Conoce nuestras políticas de envío, tiempos de entrega y costos en Glisé Farmacia y Belleza.',
};

export default function PoliticasEnvioPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Banner Superior */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-16 px-4 mb-10">
        <div className="container mx-auto max-w-4xl text-center">
          <FaTruck className="text-6xl mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Políticas de Envío</h1>
          <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
            Conoce todo sobre nuestros tiempos de entrega, cobertura y costos para que recibas tus productos favoritos sin preocupaciones.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-6">
          
          {/* 1. Cobertura de Envío */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <FaMapMarkedAlt />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">1. Cobertura de Envío</h2>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              En <strong>Glisé Farmacia y Belleza</strong> realizamos envíos a nivel nacional en Colombia, cubriendo la mayor parte del territorio a través de nuestra transportadora aliada, <strong>Coordinadora</strong>.
            </p>
            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg mt-4">
              <p className="text-cyan-800 text-sm font-medium">
                📍 <strong>Entregas Locales:</strong> Las entregas en la ciudad de Palmira cuentan con condiciones especiales y tiempos de entrega reducidos.
              </p>
            </div>
          </div>

          {/* 2. Tiempos de Entrega */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <FaClock />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">2. Tiempos de Entrega</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-100 bg-gray-50 rounded-xl p-5 text-center">
                <h3 className="font-bold text-gray-800 mb-2">📍 Palmira</h3>
                <p className="text-3xl font-extrabold text-blue-600 mb-1">1 - 2</p>
                <p className="text-sm text-gray-500 font-medium">días hábiles</p>
              </div>
              <div className="border border-gray-100 bg-gray-50 rounded-xl p-5 text-center">
                <h3 className="font-bold text-gray-800 mb-2">🏙️ Ciudades Principales.</h3>
                <p className="text-3xl font-extrabold text-blue-600 mb-1">2 - 5</p>
                <p className="text-sm text-gray-500 font-medium">días hábiles</p>
              </div>
              <div className="border border-gray-100 bg-gray-50 rounded-xl p-5 text-center">
                <h3 className="font-bold text-gray-800 mb-2">🗺️ Otros Destinos</h3>
                <p className="text-3xl font-extrabold text-blue-600 mb-1">3 - 8</p>
                <p className="text-sm text-gray-500 font-medium">días hábiles</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm italic bg-gray-50 p-3 rounded-lg border border-gray-100">
              * Los tiempos de entrega comienzan a contar a partir de la confirmación y aprobación del pago. Las compras realizadas en fines de semana o días festivos se procesarán el siguiente día hábil.
            </p>
          </div>

          {/* 3. Costos y Promoción */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <FaMoneyBillWave />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">3. Costos de Envío</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              El costo exacto del envío se calcula automáticamente en la pantalla de pago (Checkout) teniendo en cuenta la ciudad o municipio de destino y el peso/dimensiones del paquete.
            </p>
            
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 md:p-8 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                <div className="text-5xl drop-shadow-md">🚀</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">¡Envío Gratis!</h3>
                  <p className="text-blue-50 text-base md:text-lg leading-snug">
                    Disfruta de envío gratuito a nivel nacional por compras superiores a <strong>$250.000 COP</strong>, o en todos tus pedidos con entrega local en la ciudad de <strong>Palmira</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Seguimiento */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <FaBoxOpen />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">4. Seguimiento y Rastreo</h2>
            </div>
            <p className="text-gray-600 mb-5 leading-relaxed">
              Una vez tu pedido haya sido despachado, asignaremos un número de guía a tu orden. Podrás rastrear el estado exacto de tu paquete ingresando a tu cuenta en nuestra tienda, o directamente a través del portal oficial de la transportadora.
            </p>
            <Link href="/rastrear-pedido" className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors">
              Rastrear mi pedido ahora &rarr;
            </Link>
          </div>

          {/* 5. Novedades */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <FaExclamationTriangle />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">5. Novedades y Retrasos</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Si se presenta alguna eventualidad con tu envío (dirección incorrecta, destinatario ausente, condiciones climáticas), la transportadora intentará realizar la entrega nuevamente. En caso de múltiples intentos fallidos, el paquete será devuelto a nuestras instalaciones y nos pondremos en contacto contigo para coordinar un nuevo envío.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}