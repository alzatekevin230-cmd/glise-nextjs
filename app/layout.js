// EN: app/layout.js
import "nouislider/dist/nouislider.css";
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarritoModal from '@/components/CarritoModal';
import ModalAutenticacion from '@/components/ModalAutenticacion';
import MenuLateral from '@/components/MenuLateral';
import { ProveedorModal } from '@/contexto/ContextoModal.jsx';
import { ProveedorCarrito } from '@/contexto/ContextoCarrito.jsx';
import { ProveedorAuth } from '@/contexto/ContextoAuth.jsx';
import { Toaster } from 'react-hot-toast';
import { ProveedorProductos } from '@/contexto/ContextoProductos';
import { ProveedorMenuLateral } from '@/contexto/ContextoMenuLateral';
import BotonWhatsapp from '@/components/BotonWhatsapp';
import BarraNavegacionMovil from '@/components/BarraNavegacionMovil';
import Lightbox from '@/components/Lightbox';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import SmoothScrollToFooter from '@/components/SmoothScrollToFooter';
import ScrollProgressBar from '@/components/ScrollProgressBar';

// Optimización de fuente con font-display: swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // ✅ Mejora FCP - muestra texto mientras carga la fuente
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata = {
  metadataBase: new URL('https://glise.com.co'),
  title: {
    default: 'Glisé - Farmacia y Belleza Natural en Colombia | Productos Naturales y Dermocosméticos',
    template: '%s | Glisé'
  },
  description: '🛍️ ¡Descubre Glisé! Tu farmacia online #1 en Colombia. Productos naturales, dermocosméticos premium y cuidado personal de las mejores marcas. ✨ Envíos gratis, calidad garantizada. ¡Compra ahora!',
  keywords: ['farmacia online Colombia', 'productos naturales', 'dermocosméticos', 'belleza natural', 'cuidado personal', 'suplementos', 'Palmira', 'farmacia virtual', 'productos orgánicos', 'cosmética natural', 'medicamentos naturales'],
  authors: [{ name: 'Glisé - Farmacia y Belleza Natural' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://glise.com.co',
    siteName: 'Glisé',
    title: 'Glisé - Farmacia y Belleza Natural en Colombia | Productos Naturales y Dermocosméticos',
    description: '🛍️ ¡Descubre Glisé! Tu farmacia online #1 en Colombia. Productos naturales, dermocosméticos premium y cuidado personal de las mejores marcas. ✨ Envíos gratis, calidad garantizada.',
    images: [
      {
        url: 'https://glise.com.co/imagenespagina/logodeglise.webp',
        width: 1200,
        height: 630,
        alt: 'Glisé - Farmacia y Belleza Natural en Colombia',
        type: 'image/webp'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glisé - Farmacia y Belleza Natural en Colombia',
    description: '🛍️ Tu farmacia online #1 en Colombia. Productos naturales, dermocosméticos premium. ✨ Envíos gratis, calidad garantizada.',
    images: ['https://glise.com.co/imagenespagina/logodeglise.webp']
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#2563eb' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://glise.com.co'
  },
  verification: {
    google: 'google-site-verification-code', // Agrega tu código de verificación de Google aquí
  },
  other: {
    'google-site-verification': 'google-site-verification-code',
  }
};


export default function RootLayout({ children }) {
  // JSON-LD estructurado para Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Glisé',
    description: 'Farmacia y Belleza Natural en Colombia',
    url: 'https://glise.com.co',
    logo: 'https://glise.com.co/imagenespagina/logodeglise.webp',
    image: 'https://glise.com.co/imagenespagina/logodeglise.webp',
    sameAs: [
      'https://www.facebook.com/glisecolombia',
      'https://www.instagram.com/glisecolombia'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+57-321-797-3158',
      contactType: 'customer service',
      areaServed: 'CO',
      availableLanguage: 'Spanish'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Palmira',
      addressRegion: 'Valle del Cauca',
      addressCountry: 'CO'
    }
  };

  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect a dominios críticos - Mejora Network Waterfall */}
        {/* Firebase - El más crítico (1148ms de ahorro potencial) */}
        <link rel="preconnect" href="https://glise-58e2b.firebaseapp.com" />
        <link rel="dns-prefetch" href="https://glise-58e2b.firebaseapp.com" />
        
        {/* Google APIs para Firebase Auth */}
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://apis.google.com" />
        
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
        
        {/* Firebase Storage para imágenes de productos */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        
        {/* Font Awesome CDN */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        
        {/* Preload de fuentes Font Awesome críticas con font-display: swap */}
        {/* Estas fuentes se cargan en paralelo gracias al preload, no en cadena */}
        <link 
          rel="preload" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2" 
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="low"
        />
        <link 
          rel="preload" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2" 
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="low"
        />
        
        {/* Font Awesome CSS con preload para optimizar carga */}
        <link 
          rel="preload" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          as="style"
          crossOrigin="anonymous"
        />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <SmoothScrollProvider>
          <ProveedorModal>
            <ProveedorAuth>
              <ProveedorCarrito>
                <ProveedorMenuLateral>
                    <ProveedorProductos>
                      <ScrollProgressBar />
                      <Toaster position="bottom-center" />
                    
                    {/* El Header y Menú Lateral se mantienen fuera del div que se mueve */}
                    <Header />
                    <MenuLateral />
                    
                    <div id="page-content-wrapper" className="relative z-0">
                      <main className="md:pt-0 pb-20 md:pb-0">{children}</main>
                      <Footer />
                    </div>

                    {/* Los modales y otros elementos fijos se mantienen al final */}
                    <CarritoModal />
                    <ModalAutenticacion />
                    <Lightbox />
                    <BotonWhatsapp />
                    <BarraNavegacionMovil />
                    <SmoothScrollToFooter />
                    
                  </ProveedorProductos>
                </ProveedorMenuLateral>
              </ProveedorCarrito>
            </ProveedorAuth>
          </ProveedorModal>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
