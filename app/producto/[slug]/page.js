// app/producto/[slug]/page.js

// CAMBIO: Importamos las funciones necesarias desde lib/data.js
import { getProductBySlug, getRelatedProducts, createSlug } from '@/lib/data.js';
import DetalleProductoCliente from '@/components/DetalleProductoCliente';
import BotonVolver from '@/components/BotonVolver';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Producto no encontrado' };
  return { title: `${product.name} - Glisé`, description: product.description };
}

export default async function PaginaProducto({ params }) {
  const product = await getProductBySlug(params.slug);

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
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <BotonVolver texto="Volver a la tienda" />
      <div className="mt-8">
        <DetalleProductoCliente product={product} relatedProducts={relatedProducts} />
      </div>
    </main>
  );
}