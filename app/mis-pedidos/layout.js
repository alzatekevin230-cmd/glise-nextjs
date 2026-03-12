// app/mis-pedidos/layout.js
// Exporta metadata para la página de Mis Pedidos (que es un cliente component)

export const metadata = {
  title: 'Mis Pedidos - Glisé Farmacia y Belleza Natural',
  description: '📦 Consulta el estado de tus pedidos en Glisé. Rastreo en tiempo real y detalles completos de cada compra. ¡Tu farmacia online de confianza!',
  keywords: ['mis pedidos', 'mis compras', 'historial compras', 'rastrear order', 'Glisé', 'farmacia online'],
  openGraph: {
    title: 'Mis Pedidos - Glisé Farmacia',
    description: 'Consulta el estado e historial de todos tus pedidos en Glisé',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Glisé',
  },
  twitter: {
    card: 'summary',
    title: 'Mis Pedidos - Glisé Farmacia',
    description: 'Rastrear y consultar tus pedidos en Glisé',
  },
  alternates: {
    canonical: 'https://glise.com.co/mis-pedidos'
  },
  robots: {
    index: false, // Página protegida, no indexar
    follow: false,
  }
};

export default function MisPedidosLayout({ children }) {
  return children;
}
