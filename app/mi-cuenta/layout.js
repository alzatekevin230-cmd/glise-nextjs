// app/mi-cuenta/layout.js
// Exporta metadata para la página de Mi Cuenta (que es un cliente component)

export const metadata = {
  title: 'Mi Cuenta - Glisé Farmacia y Belleza Natural',
  description: '👤 Accede a tu cuenta en Glisé. Visualiza tus pedidos, favoritos, dirección y historial de compras. ¡Gestiona tu perfil con facilidad!',
  keywords: ['mi cuenta', 'mis pedidos', 'perfil usuario', 'Glisé', 'farmacia online', 'cuenta cliente'],
  openGraph: {
    title: 'Mi Cuenta - Glisé Farmacia',
    description: 'Accede a tu cuenta y visualiza todos tus pedidos en Glisé',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Glisé',
  },
  twitter: {
    card: 'summary',
    title: 'Mi Cuenta - Glisé Farmacia',
    description: 'Gestiona tu perfil y visualiza tus pedidos en nuestra farmacia online',
  },
  alternates: {
    canonical: 'https://glise.com.co/mi-cuenta'
  },
  robots: {
    index: false, // Página protegida, no indexar
    follow: false,
  }
};

export default function MiCuentaLayout({ children }) {
  return children;
}
