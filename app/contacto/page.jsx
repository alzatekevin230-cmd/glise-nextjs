// Metadatos específicos para la página de contacto
export const metadata = {
  title: 'Contacto - Glisé Farmacia y Belleza Natural Colombia',
  description: '📞 ¡Contáctanos en Glisé! Teléfono: 321 797 3158 | Email: gliseybelleza@gmail.com | Ubicación: Palmira, Valle del Cauca. Tu farmacia online de confianza en Colombia.',
  keywords: ['contacto Glisé', 'farmacia Palmira', 'teléfono farmacia', 'contacto farmacia online', 'Glisé Colombia', 'soporte farmacia'],
  openGraph: {
    title: 'Contacto - Glisé Farmacia y Belleza Natural Colombia',
    description: '📞 ¡Contáctanos en Glisé! Teléfono: 321 797 3158 | Email: gliseybelleza@gmail.com | Ubicación: Palmira, Valle del Cauca.',
    url: 'https://glise.com.co/contacto',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contacto - Glisé Farmacia Colombia',
    description: '📞 Contáctanos: 321 797 3158 | Email: gliseybelleza@gmail.com | Palmira, Valle del Cauca.',
  },
  alternates: {
    canonical: 'https://glise.com.co/contacto'
  }
};

import ContactoClient from './ContactoClient';

export default function ContactoPage() {
  return <main><div className="container mx-auto px-4 sm:px-6 py-8"><ContactoClient /></div></main>;
}
