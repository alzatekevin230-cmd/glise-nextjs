// app/categoria/[slug]/page.js

// CAMBIO: Importamos getProductsByCategory y createSlug desde lib/data.js
import { getProductsByCategory, createSlug } from '@/lib/data.js';
import PaginaCategoriaCliente from '@/components/PaginaCategoriaCliente.jsx';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';

// ISR: Revalidar cada 30 minutos
export const revalidate = 1800;

// Generar metadata dinámica para cada categoría
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);
  const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  
  return {
    title: `${capitalizedCategory} | Compra Online en Glisé - Farmacia y Belleza Natural`,
    description: `Descubre nuestra amplia selección de productos de ${categoryName}. Envíos gratis, garantía de calidad y el mejor precio. ¡Compra en Glisé, tu tienda online de confianza en Colombia!`,
    keywords: [
      categoryName,
      `productos ${categoryName}`,
      `${categoryName} Colombia`,
      `comprar ${categoryName}`,
      `${categoryName} online`,
      'farmacia online',
      'dermocosméticos',
      'productos naturales'
    ],
    openGraph: {
      title: `${capitalizedCategory} - Glisé Farmacia`,
      description: `Compra ${categoryName} con envío gratis y garantía de calidad en Glisé`,
      type: 'website',
      locale: 'es_CO',
      siteName: 'Glisé',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${capitalizedCategory} - Glisé Farmacia`,
      description: `Descubre ${categoryName} al mejor precio en Glisé`,
    },
    alternates: {
      canonical: `/categoria/${slug}`,
    },
  };
}

export default async function PaginaCategoria({ params }) {
  const { slug } = await params;
  const initialProducts = await getProductsByCategory(slug);
  const categoryName = decodeURIComponent(slug);

  const productsWithSlugs = initialProducts.map(product => ({
    ...product,
    // Usamos tu función createSlug
    slug: createSlug(product.name) 
  }));

  return (
    <main>
      <div className="container mx-auto px-2 sm:px-6 py-8">
        <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Tienda', href: '/categoria/all' }, { label: categoryName }]} />
        <PaginaCategoriaCliente
          initialProducts={productsWithSlugs}
          categoryName={categoryName}
        />
      </div>
    </main>
  );
}