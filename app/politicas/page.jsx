// app/politicas/page.jsx

import Breadcrumbs from '@/components/Breadcrumbs';

export default function PaginaPoliticas() {
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Políticas de Privacidad', href: '/politicas' }
  ];

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg static-page-content mt-8">
        <h2>Políticas de Privacidad y Términos de Uso - Glisé</h2>
        <p><strong>Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
        <p>Bienvenido a Glisé. Al acceder, navegar o utilizar nuestro Sitio Web, usted (en adelante, “el Usuario”) declara que ha leído y ha aceptado estos términos y políticas. Si no está de acuerdo con ellos, le solicitamos abstenerse de utilizar el sitio.</p>

        <h3>1. Tratamiento de Datos Personales</h3>
        <p>Glisé se compromete a proteger tu privacidad. La información personal que nos proporcionas (nombre, dirección, correo electrónico, teléfono) se utiliza exclusivamente para procesar tus pedidos, mejorar tu experiencia de compra y, si lo autorizas, enviarte comunicaciones sobre promociones y novedades.</p>

        <h3>2. Seguridad de la Información</h3>
        <p>Utilizamos medidas de seguridad estándar de la industria para proteger tus datos. Los pagos se procesan a través de pasarelas seguras como Wompi, y no almacenamos información sensible de tus tarjetas de crédito o débito.</p>

        <h3>3. Uso de Cookies</h3>
        <p>Nuestro sitio utiliza cookies para mejorar la funcionalidad, como recordar los productos en tu carrito de compras y tus preferencias. Al usar el sitio, aceptas el uso de estas cookies.</p>

        <h3>4. Propiedad Intelectual</h3>
        <p>Todo el contenido de este sitio web, incluyendo logos, textos, gráficos e imágenes, es propiedad de Glisé y está protegido por las leyes de derechos de autor. Queda prohibida su reproducción total o parcial sin autorización explícita.</p>

        <h3>5. Modificaciones de los Términos</h3>
        <p>Glisé se reserva el derecho de modificar estos términos y políticas en cualquier momento. Cualquier cambio será publicado en esta página y entrará en vigor inmediatamente.</p>
      </div>
    </main>
  );
}