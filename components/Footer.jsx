// components/Footer.jsx
"use client";

import { useEffect, useRef } from 'react';
import { useModal } from '@/contexto/ContextoModal';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'; 

export default function Footer() {
  const footerRef = useRef(null);
  const { openModal } = useModal();

  useEffect(() => {
    // Mantenemos solo la lógica para que se cierre un acordeón al abrir otro.
    const accordions = footerRef.current.querySelectorAll('details.footer-accordion');
    const handleAccordionToggle = (event) => {
      if (event.target.open) {
        accordions.forEach(otherAccordion => {
          if (otherAccordion !== event.target) {
            otherAccordion.open = false;
          }
        });
      }
    };

    accordions.forEach(accordion => {
      accordion.addEventListener('toggle', handleAccordionToggle);
    });
    
    return () => {
      accordions.forEach(accordion => {
        accordion.removeEventListener('toggle', handleAccordionToggle);
      });
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-white pb-24 md:pb-0">
      <div className="bg-pink-50 py-3 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
          <h3 className="text-xl font-bold text-cyan-700 text-center md:text-left flex-shrink-0">
            Suscríbete a nuestro boletín
          </h3>
          <form id="newsletter-form" className="w-full max-w-2xl">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full flex-grow">
                <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
                <input type="email" id="newsletter-email" placeholder="Ingresa tu correo electrónico" required className="w-full px-4 py-2.5 rounded-md border-2 border-cyan-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-md transition-colors whitespace-nowrap">
                  Suscribirme
                </button>
                <div className="flex items-center">
                  <input id="newsletter-acceptance" name="newsletter-acceptance" type="checkbox" required className="h-5 w-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="newsletter-acceptance" className="ml-2 text-sm text-gray-600">
                    Acepto <a href="/politicas" className="text-blue-600 hover:underline font-medium">políticas y términos</a>.
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-6 py-10 text-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div>
            <a href="/">
              <img src="/imagenespagina/logodeglise.webp" alt="Logo Glisé" className="h-20 md:h-24 object-contain" />
            </a>
          </div>
          <div>
            <h4 className="font-bold mb-3 pt-3">CONTÁCTANOS</h4>
            <div className="space-y-4 text-sm">
              <p className="flex items-start gap-2"><FaPhone className="w-4 text-blue-600 mt-1" /><span>321 797 3158</span></p>
              <p className="flex items-start gap-2"><FaEnvelope className="w-4 text-blue-600 mt-1" /><span>gliseybelleza@gmail.com</span></p>
              <p className="flex items-start gap-2"><FaMapMarkerAlt className="w-4 text-blue-600 mt-1" /><span>Palmira, Valle del Cauca, Colombia</span></p>
            </div>
          </div>
           <div className="space-y-2">
            <details className="footer-accordion">
              <summary className="footer-accordion-toggle"><span>SOBRE GLISÉ</span><FaChevronDown className="transition-transform duration-300" /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="/sobre-nosotros" className="hover:text-blue-600">Nuestra Historia</a></li>
                <li><a href="/blog" className="hover:text-blue-600">Blog de Bienestar</a></li>
              </ul>
            </details>
            <details className="footer-accordion">
              <summary className="footer-accordion-toggle"><span>SERVICIO AL CLIENTE</span><FaChevronDown className="transition-transform duration-300" /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="/contacto" className="hover:text-blue-600">Centro de Ayuda y Contacto</a></li>
                <li><a href="/rastrear-pedido" className="hover:text-blue-600">Seguimiento de tu Pedido</a></li>
              </ul>
            </details>
            <details className="footer-accordion">
              <summary className="footer-accordion-toggle"><span>POLÍTICAS</span><FaChevronDown className="transition-transform duration-300" /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="/politica-devoluciones" className="hover:text-blue-600">Política de Devoluciones</a></li>
                <li><a href="/politicas" className="hover:text-blue-600">Términos y Política de Privacidad</a></li>
              </ul>
            </details>
            <details className="footer-accordion">
              <summary className="footer-accordion-toggle"><span>MI CUENTA</span><FaChevronDown className="transition-transform duration-300" /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('auth'); }} className="hover:text-blue-600">Ingresar / Registrarme</a></li>
                <li><a href="/mis-pedidos" className="hover:text-blue-600">Mis Pedidos</a></li>
              </ul>
            </details>
          </div>
           <div>
            <div>
              <h4 className="font-bold mb-3 pt-3">SÍGUENOS</h4>
              <div className="flex items-center gap-2">
                <a href="https://www.facebook.com/profile.php?id=61577239121612&locale=es_LA" target="_blank" aria-label="Facebook" className="text-gray-500 hover:opacity-75 transition-opacity">
                  <img src="/imagenespagina/logofacebook.webp" alt="Facebook" className="h-10 w-10" />
                </a>
                <a href="https://www.instagram.com/glisefarmer/" target="_blank" aria-label="Instagram" className="text-gray-500 hover:opacity-75 transition-opacity">
                  <img src="/imagenespagina/logoinstagram.webp" alt="Instagram" className="h-10 w-10" />
                </a>
                <a href="#" target="_blank" aria-label="YouTube" className="text-gray-500 hover:opacity-75 transition-opacity">
                  <img src="/imagenespagina/logoyoutube.webp" alt="YouTube" className="h-10 w-10" />
                </a>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-bold mb-3">PAGO SEGURO</h4>
              <img src="/imagenespagina/logodewompi.webp" alt="Pago seguro con Wompi" className="h-10" loading="lazy" />
            </div>
          </div>
        </div>
         <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Glisé. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}