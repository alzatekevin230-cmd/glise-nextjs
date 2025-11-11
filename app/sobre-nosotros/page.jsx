// app/sobre-nosotros/page.jsx
import Breadcrumbs from '@/components/Breadcrumbs';
import SobreNosotrosClient from './SobreNosotrosClient';

export const metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce la historia y filosofía de Glisé. Descubre nuestra pasión por fusionar ciencia y naturaleza para ofrecerte los mejores productos de bienestar y belleza en Colombia.',
  openGraph: {
    title: 'Sobre Nosotros | Glisé',
    description: 'Nuestra historia, nuestra misión y nuestro compromiso con tu bienestar.',
    url: 'https://glise.com.co/sobre-nosotros',
  },
  alternates: {
    canonical: 'https://glise.com.co/sobre-nosotros',
  },
};

export default function SobreNosotrosPage() {
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre Nosotros' }
  ];

  return (
    <main>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SobreNosotrosClient />
      </div>
    </main>
  );
}