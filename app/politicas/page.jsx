// app/politicas/page.jsx

import Breadcrumbs from '@/components/Breadcrumbs';
import { FaShieldAlt, FaEnvelope } from 'react-icons/fa';
import BotonWhatsapp from '@/components/BotonWhatsapp';

export default function PaginaPoliticas() {
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Políticas de Privacidad', href: '/politicas' }
  ];

  const fecha = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 pt-[190px] md:pt-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Tarjeta informativa superior */}
      <div className="flex justify-center mb-7 mt-4">
        <div className="w-full md:max-w-2xl rounded-xl bg-blue-50 border border-blue-200 shadow flex items-center gap-4 px-5 py-4">
          <FaShieldAlt className="text-blue-500 text-3xl shrink-0"/>
          <div>
            <div className="font-bold text-lg text-blue-800 mb-1">Navega con tranquilidad en Glisé</div>
            <div className="text-blue-900 text-sm md:text-base leading-snug">Cuidamos tus datos y redactamos nuestras políticas pensando en tu privacidad, tu experiencia y tus derechos. Aquí puedes conocer <span className="font-semibold">cómo usamos tu información</span> y <span className="font-semibold">qué derechos tienes</span>.</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg static-page-content mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Políticas de Privacidad y Términos de Uso - Glisé</h2>
        <p className="mb-2 text-gray-500 font-medium">Última actualización: {fecha}</p>
        <p>Bienvenido/a a Glisé. Al acceder, navegar o comprar, confirmas que leíste y aceptas estas políticas y condiciones. Si tienes dudas o no estás de acuerdo, 
          <span className="ml-1 text-blue-700 font-semibold underline"><a href="#contacto-politicas">contáctanos aquí</a></span> y te asesoramos.
        </p>
        <hr className="my-5" />

        <h3 className="text-lg font-semibold text-blue-700 mt-4 mb-1">1. Tratamiento de tus datos personales</h3>
        <p>Glisé protege tu privacidad. Los datos que nos das (nombre, dirección, email, teléfono, historial de pedidos) sólo los utilizamos para procesar tus compras, brindarte mejor servicio y, si lo autorizas, enviarte noticias o promo. <b>Nunca vendemos ni compartimos tus datos con terceros sin tu permiso.</b></p>

        <div className="bg-yellow-50 border-gold-200 border-l-4 p-3 my-6 rounded">
          <b>🛡️ Tus derechos sobre tus datos (Ley 1581 de 2012, Colombia)</b><br/>
          Puedes acceder, actualizar, corregir o eliminar tu información personal, así como revocar autorización o solicitar prueba del uso de tus datos. Solo escríbenos usando los métodos de contacto al final de esta página y te respondemos rápido ♥.
        </div>

        <h3 className="text-lg font-semibold text-blue-700 mt-6 mb-1">2. Seguridad de la Información</h3>
        <p>Usamos medidas de seguridad estándar para proteger tus datos. Los pagos son procesados en pasarelas seguras (por ejemplo, Wompi) y <b>no almacenamos información sensible de tarjetas</b>.</p>

        <h3 className="text-lg font-semibold text-blue-700 mt-6 mb-1">3. Uso de Cookies</h3>
        <p>Nuestro sitio usa cookies para que tengas mejor experiencia (guardamos tus favoritos, carrito, lenguaje, etc). Puedes configurar tu navegador para bloquear cookies si así lo prefieres, aunque puede limitar algunas funciones.</p>

        <h3 className="text-lg font-semibold text-blue-700 mt-6 mb-1">4. Propiedad intelectual</h3>
        <p className="bg-red-50 border-l-4 border-red-300 rounded px-2 py-2 text-red-700 font-medium my-3">
          🚫 Todo el contenido de Glisé (logos, textos, imágenes) está protegido por derechos de autor y queda prohibido reproducir, distribuir o usar nuestra marca o materiales sin permiso escrito.</p>

        <h3 className="text-lg font-semibold text-blue-700 mt-6 mb-1">5. Cambios en las políticas</h3>
        <p>Podemos modificar estos términos o la política de privacidad en cualquier momento. Si hay cambios importantes, lo anunciamos en esta página para que siempre tengas la información más reciente.</p>

        <hr className="my-6" />

        {/* Sección de contacto directo */}
        <div id="contacto-politicas" className="flex flex-col md:flex-row gap-4 items-center my-7 justify-center">
          <span className="font-semibold text-slate-800">¿Tienes dudas legales, quieres acceder o eliminar tus datos?</span>
          <BotonWhatsapp />
          <a href="mailto:gliseybelleza@gmail.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"><FaEnvelope/><span>Email</span></a>
        </div>
      </div>
    </main>
  );
}