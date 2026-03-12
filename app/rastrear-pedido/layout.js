// app/rastrear-pedido/layout.js
// Exporta metadata para la página de Rastrear Pedido (que es un cliente component)

export const metadata = {
  title: 'Rastrear Pedido - Glisé Farmacia y Belleza Natural',
  description: '📍 Rastrea tu pedido en tiempo real en Glisé. Ingresa tu número de orden y visualiza el estado actual de tu envío. ¡Tu farmacia online confiable!',
  keywords: ['rastrear pedido', 'seguimiento orden', 'estado envío', 'Glisé', 'farmacia online', 'tracking pedido'],
  openGraph: {
    title: 'Rastrear Pedido - Glisé Farmacia',
    description: 'Rastrea el estado de tu pedido en Glisé en tiempo real',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Glisé',
  },
  twitter: {
    card: 'summary',
    title: 'Rastrear Pedido - Glisé Farmacia',
    description: 'Sigue el estado de tu envío en Glisé',
  },
  alternates: {
    canonical: 'https://glise.com.co/rastrear-pedido'
  }
};

export default function RastrearPedidoLayout({ children }) {
  return children;
}
