// app/categoria/[slug]/page.js

// Importamos getProductsByCategory y createSlug desde lib/data.js
import { getProductsByCategory, createSlug } from '@/lib/data.js';
import PaginaCategoriaCliente from '@/components/PaginaCategoriaCliente.jsx';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';
import { generateOfferSchema } from './metadata';

// ISR: Revalidar cada 30 minutos
export const revalidate = 1800;

// Generar metadata dinámica para cada categoría de forma eficiente
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug);
  const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  
  // Limpiamos el nombre de la categoría para compararlo sin errores de tildes o mayúsculas
  const categoriaClean = categoryName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Definimos las descripciones ÚNICAS por cada categoría para evitar que Google raspe el footer
  let descripcionPersonalizada = `Descubre nuestra amplia selección de productos de ${categoryName}. Envíos gratis, garantía de calidad y el mejor precio en Glisé Colombia.`;

  if (categoriaClean === 'all') {
    descripcionPersonalizada = 'Explora el catálogo completo de Glisé. Encuentra aceites esenciales, dermocosméticos, cuidado infantil y suplementos naturales con envíos a toda Colombia.';
  } 
  else if (categoriaClean === 'dermocosmeticos') {
    descripcionPersonalizada = 'Encuentra productos dermocosméticos especializados en Glisé. Fórmulas de alta calidad diseñadas para el cuidado, hidratación, protección y salud avanzada de tu piel.';
  } 
  else if (categoriaClean === 'cuidado infantil') {
    descripcionPersonalizada = 'Descubre productos seguros y naturales para el cuidado infantil en Glisé. Protege y consiente la piel de los más pequeños con fórmulas suaves, delicadas y certificadas.';
  } 
  else if (categoriaClean === 'milenario') {
    descripcionPersonalizada = 'Línea Milenario en Glisé. Aceites esenciales puros, extractos naturales y soluciones milenarias extraídas con la mayor pureza para potenciar tu bienestar físico y mental.';
  } 
  else if (categoriaClean === 'cuidado y belleza') {
    descripcionPersonalizada = 'Realza tu estética diaria de forma saludable. Encuentra tratamientos capilares, aceites corporales y suplementos de cuidado y belleza en la tienda oficial de Glisé.';
  } 
  else if (categoriaClean === 'naturales y homeopaticos') {
    descripcionPersonalizada = 'Línea de productos naturales y homeopáticos en Glisé. Suplementos esenciales, magnesio y alternativas naturales para fortalecer y cuidar tu salud de manera integral.';
  }

  return {
    title: `${capitalizedCategory} | Glisé Colombia`,
    description: descripcionPersonalizada,
    keywords: [
      categoryName,
      `productos ${categoryName}`,
      `${categoryName} Colombia`,
      `comprar ${categoryName}`,
      `${categoryName} online`,
      'tienda online', // ✅ Cambiado de 'farmacia online' a 'tienda online'
      'bienestar',     // ✅ Agregado para reforzar el estilo de vida
      'dermocosméticos',
      'productos naturales'
    ],
    openGraph: {
      title: `${capitalizedCategory} | Glisé`, // ✅ Eliminado "Glisé Farmacia"
      description: descripcionPersonalizada,
      type: 'website',
      locale: 'es_CO',
      siteName: 'Glisé',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${capitalizedCategory} | Glisé`, // ✅ Eliminado "Glisé Farmacia"
      description: descripcionPersonalizada,
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
        <Breadcrumbs items={[
          { label: 'Inicio', href: '/' }, 
          { label: 'Tienda', href: '/categoria/all' }, 
          { label: categoryName, href: `/categoria/${slug}` }
        ]} />
        <PaginaCategoriaCliente initialProducts={productsWithSlugs} categoryName={categoryName} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOfferSchema(productsWithSlugs, categoryName))
        }}
      />
    </main>
  );
}