"use client";

import { useState, useEffect, useRef } from 'react';
import { useModal } from '@/contexto/ContextoModal';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronDown,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa'; 
import toast from 'react-hot-toast';

export default function Footer() {
  const footerRef = useRef(null);
  const { openModal } = useModal();
  
  // Estado para el formulario de suscripción
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('¡Gracias por suscribirte!');
    setEmail('');
    setLoading(false);
  };

  useEffect(() => {
    const accordions = footerRef.current.querySelectorAll('details.footer-accordion');
    const handleAccordionToggle = (event) => {
      if (event.target.open) {
        accordions.forEach(otherAccordion => {
          if (otherAccordion !== event.target) otherAccordion.open = false;
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
    <footer ref={footerRef} data-nosnippet className="bg-white pb-24 md:pb-0 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100">
      <div className="bg-gradient-to-r from-cyan-800 to-cyan-600 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden sm:flex w-14 h-14 rounded-full bg-white/10 items-center justify-center flex-shrink-0">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Suscríbete a nuestro boletín
              </h3>
              <p className="text-cyan-100 text-sm mt-0.5">
                Ofertas exclusivas y novedades directo a tu correo.
              </p>
            </div>
          </div>
          <form id="newsletter-form" onSubmit={handleSubmit} className="w-full md:w-auto md:max-w-lg">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full flex-grow">
                <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
                <input 
                  type="email" 
                  id="newsletter-email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico" 
                  required 
                  className="w-full px-5 py-3 rounded-full border-0 text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30" 
                />
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white text-cyan-800 font-bold px-6 py-3 rounded-full hover:bg-cyan-50 transition-colors whitespace-nowrap disabled:opacity-50 shadow-md"
                >
                  {loading ? '...' : 'Suscribirme'}
                </button>
              </div>
            </div>
            <div className="flex items-center mt-3 justify-center sm:justify-start">
              <input id="newsletter-acceptance" name="newsletter-acceptance" type="checkbox" required className="h-4 w-4 rounded border-white/50 text-cyan-600 focus:ring-cyan-300" />
              <label htmlFor="newsletter-acceptance" className="ml-2 text-xs text-cyan-100">
                Acepto <a href="/politicas" className="underline hover:text-white font-medium">políticas y términos</a>.
              </label>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 text-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a href="/">
              <img src="/imagenespagina/logodeglise.webp" alt="Logo Glisé" width="200" height="80" className="h-20 md:h-24 object-contain" />
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
              <summary className="footer-accordion-toggle flex justify-between items-center cursor-pointer"><span>SOBRE GLISÉ</span><FaChevronDown /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="/sobre-nosotros" className="hover:text-blue-600">Nuestra Historia</a></li>
                <li><a href="/blog" className="hover:text-blue-600">Blog de Bienestar</a></li>
              </ul>
            </details>
            <details className="footer-accordion">
              <summary className="footer-accordion-toggle flex justify-between items-center cursor-pointer"><span>SERVICIO AL CLIENTE</span><FaChevronDown /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="/contacto" className="hover:text-blue-600">Centro de Ayuda y Contacto</a></li>
                <li><a href="/rastrear-pedido" className="hover:text-blue-600">Seguimiento de tu Pedido</a></li>
              </ul>
            </details>
            <details className="footer-accordion">
              <summary className="footer-accordion-toggle flex justify-between items-center cursor-pointer"><span>POLÍTICAS</span><FaChevronDown /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="/politica-devoluciones" className="hover:text-blue-600">Política de Devoluciones</a></li>
                <li><a href="/politicas-de-envio" className="hover:text-blue-600">Políticas de Envío</a></li>
                <li><a href="/politicas" className="hover:text-blue-600">Términos y Política de Privacidad</a></li>
              </ul>
            </details>
            <details className="footer-accordion">
              <summary className="footer-accordion-toggle flex justify-between items-center cursor-pointer"><span>MI CUENTA</span><FaChevronDown /></summary>
              <ul className="pt-2 pl-4 space-y-2 text-sm text-gray-600">
                <li><a href="#" onClick={(e) => { e.preventDefault(); openModal('auth'); }} className="hover:text-blue-600">Ingresar / Registrarme</a></li>
                <li><a href="/mis-pedidos" className="hover:text-blue-600">Mis Pedidos</a></li>
              </ul>
            </details>
          </div>
          <div>
            <div>
              <h4 className="font-bold mb-3 pt-3">SÍGUENOS</h4>
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/profile.php?id=61577239121612&locale=es_LA" target="_blank" aria-label="Facebook" className="text-blue-600 hover:text-blue-700 transition-colors text-3xl"><FaFacebook /></a>
                <a href="https://www.instagram.com/glisefarmer/" target="_blank" aria-label="Instagram" className="text-pink-500 hover:text-pink-600 transition-colors text-3xl"><FaInstagram /></a>
                <a href="https://www.tiktok.com/@glisefarmer" target="_blank" aria-label="TikTok" className="text-black hover:text-gray-900 transition-colors text-3xl"><FaTiktok /></a>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-bold mb-3">PAGO SEGURO</h4>
              <img src="/imagenespagina/logodewompi.webp" alt="Pago seguro con Wompi" width="120" height="40" className="h-10 w-auto" />
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