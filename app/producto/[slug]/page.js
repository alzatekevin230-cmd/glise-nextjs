// app/producto/[slug]/page.js

// CAMBIO: Importamos las funciones necesarias desde lib/data.js
import { getProductBySlug, getRelatedProducts, createSlug, getAllProducts } from '@/lib/data.js';
import { getImageUrl } from '@/lib/imageUtils';
import DetalleProductoCliente from '@/components/DetalleProductoCliente';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';

// ISR: Revalidar cada 0 segundos (siempre fresco)
export const revalidate = 0;

// Genera todas las rutas de productos en build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  
  return products.map((product) => ({
    slug: createSlug(product.name),
  }));
}

// 🔥 MEJORA SEO: Metadatos dinámicos y enfocados en "Tienda de Confianza"
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado | Glisé' };

  const optimizedImage = getImageUrl(product.image, '700x700');

  // Título persuasivo
  const seoTitle = `${product.name} | Compra Segura en Glisé`;
  
  // Descripción inteligente (limita el texto base y añade gancho comercial)
  const baseDescription = product.description ? product.description.substring(0, 120) : '';
  const cleanDescription = `${baseDescription}... Adquiérelo al mejor precio en Glisé. Tu tienda online de confianza con envíos rápidos a toda Colombia y pago 100% seguro.`;

  return {
    title: seoTitle,
    description: cleanDescription,
    openGraph: {
      title: seoTitle,
      description: cleanDescription,
      images: [optimizedImage],
      type: 'website',
      locale: 'es_CO',
      siteName: 'Glisé',
    },
    // Añadimos etiquetas de Twitter completas
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: cleanDescription,
      images: [optimizedImage],
    },
    other: {
      'product:price:amount': product.price,
      'product:price:currency': 'COP',
    },
  };
}

export default async function PaginaProducto({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }
  
  const relatedProductsRaw = await getRelatedProducts(product.category, product.id);

  // ✅ MANTENIDO: Tu lógica segura para mapear los slugs de productos relacionados
  const relatedProducts = relatedProductsRaw.map(p => ({
    ...p,
    // Usamos tu función createSlug
    slug: createSlug(p.name)
  }));
  
  // Crear slug de categoría para el breadcrumb (usar encodeURIComponent directamente como en otras páginas)
  const categorySlug = product.category ? encodeURIComponent(product.category) : 'all';
  const categoryLabel = product.category || 'Productos';

  // JSON-LD para Google (Rich Snippets) optimizado
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} disponible en Glisé.`,
    "image": getImageUrl(product.image, '700x700'),
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "COP",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Glisé",
        "url": "https://glise.com.co" // Se agregó la URL oficial
      }
    },
    "brand": {
      "@type": "Brand",
      "name": product.laboratorio || "Glisé"
    },
    "category": product.category
  };
  
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="container mx-auto px-2 sm:px-6 py-8">
        {/* ✅ MANTENIDO: Tus 4 niveles de Breadcrumbs exactos */}
        <Breadcrumbs items={[
          { label: 'Inicio', href: '/' }, 
          { label: 'Tienda', href: '/categoria/all' },
          { label: categoryLabel, href: `/categoria/${categorySlug}` }, 
          { label: product.name }
        ]} />
        {/* ✅ MANTENIDO: Tu llamado al componente intacto */}
        <DetalleProductoCliente product={product} relatedProducts={relatedProducts} />
      </div>
    </main>
  );
}