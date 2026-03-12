// app/mis-favoritos/layout.js
// Exporta metadata para la página de Mis Favoritos (que es un cliente component)

export const metadata = {
  title: 'Mis Favoritos - Glisé Farmacia y Belleza Natural',
  description: '❤️ Tu colección de favoritos en Glisé. Guarda los productos que te encantan y cómpralos cuando quieras. ¡Ofertas especiales en tus favoritos!',
  keywords: ['mis favoritos', 'productos favoritos', 'wishlist', 'Glisé', 'farmacia online', 'compra favoritos'],
  openGraph: {
    title: 'Mis Favoritos - Glisé Farmacia',
    description: 'Consulta tu lista de productos favoritos en Glisé',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Glisé',
  },
  twitter: {
    card: 'summary',
    title: 'Mis Favoritos - Glisé Farmacia',
    description: 'Accede a tu lista de favoritos en Glisé',
  },
  alternates: {
    canonical: 'https://glise.com.co/mis-favoritos'
  },
  robots: {
    index: false, // Página protegida, no indexar
    follow: false,
  }
};

export default function MisFavoritosLayout({ children }) {
  return children;
}
