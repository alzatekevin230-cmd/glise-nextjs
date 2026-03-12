// app/gracias/layout.js
// Exporta metadata para la página de Gracias (que es un cliente component)

export const metadata = {
  title: 'Gracias por tu Compra - Glisé Farmacia y Belleza Natural',
  description: '✅ ¡Gracias por tu compra en Glisé! Tu pedido ha sido procesado exitosamente. Recibe tu farmacia online de confianza con envío rápido y seguro.',
  keywords: ['compra completada', 'confirmación pedido', 'Glisé', 'farmacia online', 'pedido exitoso'],
  openGraph: {
    title: 'Gracias por tu Compra - Glisé Farmacia',
    description: 'Tu pedido en Glisé ha sido procesado con éxito',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Glisé',
  },
  twitter: {
    card: 'summary',
    title: 'Gracias por tu Compra - Glisé',
    description: 'Tu pedido ha sido confirmado',
  },
  robots: {
    index: false, // No indexar página de confirmación
    follow: false,
  }
};

export default function GraciasLayout({ children }) {
  return children;
}
