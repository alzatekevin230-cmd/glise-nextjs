// app/marca/[brandName]/page.js

import { getProductsByBrand } from '@/lib/data.js';
import PaginaMarcaCliente from '@/components/PaginaMarcaCliente.jsx';

export default async function PaginaMarca({ params }) {
  const { brandName } = await params;
  const allProducts = await getProductsByBrand(brandName);
  const decodedBrandName = decodeURIComponent(brandName);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <PaginaMarcaCliente 
        brandName={decodedBrandName}
        initialProducts={allProducts}
      />
    </main>
  );
}