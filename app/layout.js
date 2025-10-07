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

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://www.glise.com.co'),
  title: {
    default: 'Glisé - Farmacia y Belleza Natural en Colombia',
    template: '%s | Glisé'
  },
  description: 'Glisé es tu farmacia y tienda de belleza online en Colombia. Productos naturales, dermocosméticos y cuidado personal de las mejores marcas.',
  keywords: ['farmacia online Colombia', 'productos naturales', 'dermocosméticos', 'belleza natural', 'cuidado personal', 'suplementos', 'Palmira'],
  authors: [{ name: 'Glisé' }],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://www.glise.com.co',
    siteName: 'Glisé',
    title: 'Glisé - Farmacia y Belleza Natural en Colombia',
    description: 'Glisé es tu farmacia y tienda de belleza online en Colombia. Productos naturales, dermocosméticos y cuidado personal.',
    images: [
      {
        url: '/imagenespagina/logodeglise.png',
        width: 1200,
        height: 630,
        alt: 'Glisé - Farmacia y Belleza Natural'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glisé - Farmacia y Belleza Natural en Colombia',
    description: 'Tu farmacia online de confianza. Productos naturales y dermocosméticos.',
    images: ['/imagenespagina/logodeglise.png']
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://www.glise.com.co'
  }
};


export default async function RootLayout({ children }) {
  const allProducts = await getAllProducts();

  return (
    <html lang="es">
      <head>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-ez-plus/1.2.2/jquery.ez-plus.min.css" />
      </head>
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
