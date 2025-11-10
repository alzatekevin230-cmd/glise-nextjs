// app/marca/[brandName]/page.js

import { getProductsByBrand } from '@/lib/data.js';
import PaginaMarcaCliente from '@/components/PaginaMarcaCliente.jsx';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

// Generar metadata para SEO
export async function generateMetadata({ params }) {
  const { brandName } = await params;
  const decodedBrandName = decodeURIComponent(brandName);
  
  return {
    title: `${decodedBrandName} - Productos Originales y Certificados | Glisé`,
    description: `Compra productos ${decodedBrandName} originales al mejor precio. Envío rápido, garantía de calidad y autenticidad. Descubre toda la línea ${decodedBrandName} disponible.`,
    keywords: [
      decodedBrandName,
      `productos ${decodedBrandName}`,
      `${decodedBrandName} originales`,
      `comprar ${decodedBrandName}`,
      `${decodedBrandName} Colombia`,
      'cosméticos',
      'dermocosmética',
      'cuidado de la piel'
    ],
    openGraph: {
      title: `${decodedBrandName} - Productos Originales | Glisé`,
      description: `Encuentra todos los productos ${decodedBrandName} que necesitas. Garantía de autenticidad y calidad.`,
      type: 'website',
      locale: 'es_CO',
      siteName: 'Glisé',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedBrandName} - Productos Originales | Glisé`,
      description: `Compra productos ${decodedBrandName} originales con garantía de calidad`,
    },
    alternates: {
      canonical: `/marca/${brandName}`,
    },
  };
}

export default async function PaginaMarca({ params }) {
  const { brandName } = await params;
  const allProducts = await getProductsByBrand(brandName);
  const decodedBrandName = decodeURIComponent(brandName);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 pt-[190px] md:pt-8">
      <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Tienda', href: '/' }, { label: decodedBrandName }]} />
      <PaginaMarcaCliente 
        brandName={decodedBrandName}
        initialProducts={allProducts}
      />
    </main>
  );
}