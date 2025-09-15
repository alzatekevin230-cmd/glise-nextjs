// app/marca/[brandName]/page.js

// 1. Importamos la NUEVA función que acabamos de crear
import { getProductsByBrand } from '@/lib/data.js';
// 2. Reutilizamos el MISMO componente cliente que usa la página de categorías
import PaginaCategoriaCliente from '@/components/PaginaCategoriaCliente.jsx';

export default async function PaginaMarca({ params }) {
  // 3. Llamamos a la función para obtener productos por marca
  const allProducts = await getProductsByBrand(params.brandName);
  const brandName = decodeURIComponent(params.brandName);

  // 4. Pasamos los datos al componente cliente. Cambiamos 'categoryName' por 'brandName'
  //    para que el título de la página sea el nombre de la marca.
  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <PaginaCategoriaCliente 
        initialProducts={allProducts} 
        categoryName={brandName} // Le pasamos el nombre de la marca como si fuera una categoría
      />
    </main>
  );
}