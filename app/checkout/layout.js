// app/checkout/layout.js
// Exporta metadata para la página de Checkout (que es un cliente component)

export const metadata = {
  title: 'Carrito de Compras - Glisé Farmacia y Belleza Natural',
  description: '🛒 Completa tu compra en Glisé. Pago seguro, entrega rápida y garantía de calidad. ¡Tus productos farmacéuticos favoritos un click away!',
  keywords: ['carrito', 'checkout', 'pagar', 'compra online', 'Glisé', 'farmacia online', 'pago seguro'],
  openGraph: {
    title: 'Carrito de Compras - Glisé Farmacia',
    description: 'Completa tu compra de forma segura en Glisé',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Glisé',
  },
  twitter: {
    card: 'summary',
    title: 'Carrito de Compras - Glisé Farmacia',
    description: 'Checkout seguro en Glisé',
  },
  robots: {
    index: false, // No indexar página de checkout
    follow: false,
  }
};

export default function CheckoutLayout({ children }) {
  return children;
}
