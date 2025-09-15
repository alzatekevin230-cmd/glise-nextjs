// app/categoria/[slug]/page.js

// CAMBIO: Importamos getProductsByCategory y createSlug desde lib/data.js
import { getProductsByCategory, createSlug } from '@/lib/data.js';
import PaginaCategoriaCliente from '@/components/PaginaCategoriaCliente.jsx';

export default async function PaginaCategoria({ params }) {
  const initialProducts = await getProductsByCategory(params.slug);
  const categoryName = decodeURIComponent(params.slug);

  const productsWithSlugs = initialProducts.map(product => ({
    ...product,
    // Usamos tu función createSlug
    slug: createSlug(product.name) 
  }));

  return (
    <main className="container mx-auto px-2 sm:px-6 py-8">
      <PaginaCategoriaCliente 
        initialProducts={productsWithSlugs} 
        categoryName={categoryName} 
      />
    </main>
  );
}