"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const ProductosContext = createContext();

export const useProductos = () => {
  return useContext(ProductosContext);
};

// Este proveedor ahora carga productos bajo demanda (lazy loading)
export const ProveedorProductos = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Función para cargar productos solo cuando se necesiten
  const loadProducts = async () => {
    if (isLoaded || isLoading) return; // Evita cargas duplicadas
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      setAllProducts(products);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    allProducts,
    isLoading,
    isLoaded,
    loadProducts, // Exponer función para cargar bajo demanda
  };

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  );
};