// app/marca/[brandName]/page.js

import { getProductsByBrand } from '@/lib/data.js';
import PaginaMarcaCliente from '@/components/PaginaMarcaCliente.jsx';

export default async function PaginaMarca({ params }) {
  const allProducts = await getProductsByBrand(params.brandName);
  const brandName = decodeURIComponent(params.brandName);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <PaginaMarcaCliente 
        brandName={brandName}
        initialProducts={allProducts}
      />
    </main>
  );
}