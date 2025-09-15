"use client";

import { createContext, useContext } from 'react';

const ProductosContext = createContext();

export const useProductos = () => {
  return useContext(ProductosContext);
};

// Este proveedor recibe la lista de productos que fue cargada en el servidor (en layout.js)
// y la distribuye a cualquier componente de cliente que la necesite, como el Header.
export const ProveedorProductos = ({ children, allProducts }) => {
  const value = {
    allProducts,
  };

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  );
};