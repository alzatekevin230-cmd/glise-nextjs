// EN: app/layout.js
import "nouislider/dist/nouislider.css";
import './globals.css';
import { Inter } from 'next/font/google';
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
import { getAllProducts } from '@/lib/data';
import { ProveedorMenuLateral } from '@/contexto/ContextoMenuLateral';
import BotonWhatsapp from '@/components/BotonWhatsapp';
import BarraNavegacionMovil from '@/components/BarraNavegacionMovil';
import Lightbox from '@/components/Lightbox';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

const inter = Inter({ subsets: ['latin'] });

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
        url: '/imagenespagina/logodeglise.webp',
        width: 1200,
        height: 630,
        alt: 'Glisé - Farmacia y Belleza Natural en Colombia'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glisé - Farmacia y Belleza Natural en Colombia',
    description: '🛍️ Tu farmacia online #1 en Colombia. Productos naturales, dermocosméticos premium. ✨ Envíos gratis, calidad garantizada.',
    images: ['/imagenespagina/logodeglise.webp']
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
  }
};


export default async function RootLayout({ children }) {
  const allProducts = await getAllProducts();

  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-ez-plus/1.2.2/jquery.ez-plus.min.css" />
      </head>
      <body className={inter.className}>
        <SmoothScrollProvider>
          <ProveedorModal>
            <ProveedorAuth>
              <ProveedorCarrito>
                <ProveedorMenuLateral>
                  <ProveedorProductos allProducts={allProducts}>
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
