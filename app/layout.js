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


// --- IMPORTAMOS EL NUEVO LIGHTBOX ---
import Lightbox from '@/components/Lightbox';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Glisé - Farmacia y Belleza Natural',
  description: 'Glisé es tu farmacia y tienda de belleza online en Colombia.',
};

export default async function RootLayout({ children }) {
  const allProducts = await getAllProducts();

  return (
    <html lang="es">
      <head>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  
  {/* --- AÑADE ESTA LÍNEA AQUÍ --- */}
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-ez-plus/1.2.2/jquery.ez-plus.min.css" />
      </head>
      <body className={inter.className}>
        <ProveedorModal>
          <ProveedorAuth>
            <ProveedorCarrito>
              <ProveedorMenuLateral>
                <ProveedorProductos allProducts={allProducts}>
                  <Toaster position="bottom-center" />
                  <Header />
                  <MenuLateral />
                  <main className="pb-20 md:pb-0">{children}</main>
                  <Footer />
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