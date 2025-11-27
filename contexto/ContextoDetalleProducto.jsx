"use client";

import { createContext, useContext, useState } from 'react';

const DetalleProductoContext = createContext();

export const useDetalleProducto = () => {
  const context = useContext(DetalleProductoContext);
  if (!context) {
    return {
      isProductPage: false,
      product: null,
      quantity: 1,
      setQuantity: () => {},
      increaseQuantity: () => {},
      decreaseQuantity: () => {},
      handleAddToCart: () => {},
      isAddingToCart: false,
      MAX_QUANTITY_PER_ITEM: 10,
    };
  }
  return context;
};

export const ProveedorDetalleProducto = ({ children }) => {
  const [isProductPage, setIsProductPage] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [MAX_QUANTITY_PER_ITEM] = useState(10);

  const increaseQuantity = () => {
    if (product) {
      const maxLimit = Math.min(product.stock, MAX_QUANTITY_PER_ITEM);
      setQuantity(q => Math.min(q + 1, maxLimit));
    }
  };

  const decreaseQuantity = () => {
    setQuantity(q => Math.max(1, q - 1));
  };

  const handleAddToCart = () => {
    // Esta función será sobrescrita por DetalleProductoCliente
  };

  const [handleAddToCartFn, setHandleAddToCartFn] = useState(() => () => {});

  const value = {
    isProductPage,
    setIsProductPage,
    product,
    setProduct,
    quantity,
    setQuantity,
    increaseQuantity,
    decreaseQuantity,
    handleAddToCart: handleAddToCartFn,
    setHandleAddToCart: setHandleAddToCartFn,
    isAddingToCart,
    setIsAddingToCart,
    MAX_QUANTITY_PER_ITEM,
  };

  return (
    <DetalleProductoContext.Provider value={value}>
      {children}
    </DetalleProductoContext.Provider>
  );
};

