// components/ProductosVistosRecientemente.jsx
"use client";

import { useState, useEffect } from 'react';
import ProductCarousel from "./ProductCarousel";
// 1. Importa el hook para usar el contexto de productos
import { useProductos } from '@/contexto/ContextoProductos';

// 3. Quita 'allProducts' de los props, ya no lo necesitamos aquí
export default function VistosRecientemente({ currentProductId }) {
  const [viewedProducts, setViewedProducts] = useState([]);
  
  // 2. Consume el contexto para obtener la lista completa de productos
  const { allProducts } = useProductos();

  useEffect(() => {
    // 4. Agrega una comprobación para asegurarte de que allProducts existe antes de usarlo
    if (!allProducts) {
      return;
    }

    const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const productsToShow = recentlyViewedIds
      .map(id => allProducts.find(p => p.id === id)) // Ahora 'allProducts' no será undefined
      .filter(p => p && p.id !== currentProductId);

    setViewedProducts(productsToShow);
  }, [currentProductId, allProducts]); // Mantenemos allProducts como dependencia

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 rounded-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Vistos Recientemente</h2>
      <ProductCarousel 
        products={viewedProducts}
        carouselClassName="detail-recently-viewed-carousel"
        nextButtonClassName="detail-recently-viewed-next"
        prevButtonClassName="detail-recently-viewed-prev"
        
      />
    </section>
  );
}