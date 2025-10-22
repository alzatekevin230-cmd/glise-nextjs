// components/ProductosVistosRecientemente.jsx
"use client";

import { useState, useEffect } from 'react';
import ProductCarousel from "./ProductCarousel";

// ✅ Componente para página principal - acepta allProducts como prop
export default function ProductosVistosRecientemente({ allProducts, currentProductId }) {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    // Verificar que allProducts existe
    if (!allProducts || allProducts.length === 0) {
      return;
    }

    try {
      const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      
      // Limitar a los últimos 12 productos vistos
      const limitedIds = recentlyViewedIds.slice(0, 12);
      
      const productsToShow = limitedIds
        .map(id => allProducts.find(p => p.id === id))
        .filter(p => p && (!currentProductId || p.id !== currentProductId));

      setViewedProducts(productsToShow);
    } catch (error) {
      console.error('Error cargando productos vistos:', error);
    }
  }, [currentProductId, allProducts]);

  // No mostrar si no hay productos vistos
  if (!viewedProducts || viewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-6 bg-gray-50 rounded-lg mb-4">
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