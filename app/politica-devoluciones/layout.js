// app/politica-devoluciones/layout.js
// Exporta metadata para la página de Política de Devoluciones (que es un cliente component)

export const metadata = {
  title: 'Política de Devoluciones - Glisé Farmacia y Belleza Natural',
  description: '🔄 Lee nuestra política de devoluciones en Glisé. Cambios y devoluciones sin complicaciones hasta 30 días. ¡Compra con confianza en nuestro farmacia online!',
  keywords: ['devoluciones', 'cambios', 'política devoluciones', 'Glisé', 'farmacia online', 'garantía'],
  openGraph: {
    title: 'Política de Devoluciones - Glisé Farmacia',
    description: 'Conoce nuestra política de devoluciones y cambios en Glisé',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Glisé',
  },
  twitter: {
    card: 'summary',
    title: 'Política de Devoluciones - Glisé',
    description: 'Devoluciones y cambios sin complicaciones en Glisé',
  },
  alternates: {
    canonical: 'https://glise.com.co/politica-devoluciones'
  }
};

export default function PoliticaDevolucionesLayout({ children }) {
  return children;
}
