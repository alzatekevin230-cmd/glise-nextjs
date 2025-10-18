// app/producto/[slug]/page.js

// CAMBIO: Importamos las funciones necesarias desde lib/data.js
import { getProductBySlug, getRelatedProducts, createSlug, getAllProducts } from '@/lib/data.js';
import DetalleProductoCliente from '@/components/DetalleProductoCliente';
import BotonVolver from '@/components/BotonVolver';
import { notFound } from 'next/navigation';

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
  return { 
    title: `${product.name} - Glisé`, 
    description: product.description,
    openGraph: {
      title: `${product.name} - Glisé`,
      description: product.description,
      images: [product.imageUrl],
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
  
  return (
    <main className="container mx-auto px-2 sm:px-6 py-8">
      <BotonVolver texto="Volver a la tienda" className="mt-4" />
      <div className="mt-8">
        <DetalleProductoCliente product={product} relatedProducts={relatedProducts} />
      </div>
    </main>
  );
}
