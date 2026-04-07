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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado' };

  const optimizedImage = getImageUrl(product.image, '700x700');

  return {
    title: `${product.name} - Glisé`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Glisé`,
      description: product.description,
      images: [optimizedImage],
      type: 'website',
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

  const relatedProducts = relatedProductsRaw.map(p => ({
    ...p,
    // Usamos tu función createSlug
    slug: createSlug(p.name)
  }));
  
  // Crear slug de categoría para el breadcrumb (usar encodeURIComponent directamente como en otras páginas)
  const categorySlug = product.category ? encodeURIComponent(product.category) : 'all';
  const categoryLabel = product.category || 'Productos';

  // JSON-LD para Google (Rich Snippets)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": getImageUrl(product.image, '700x700'),
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "COP",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Glisé"
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
        <Breadcrumbs items={[
          { label: 'Inicio', href: '/' }, 
          { label: 'Tienda', href: '/categoria/all' },
          { label: categoryLabel, href: `/categoria/${categorySlug}` }, 
          { label: product.name }
        ]} />
        <DetalleProductoCliente product={product} relatedProducts={relatedProducts} />
      </div>
    </main>
  );
}