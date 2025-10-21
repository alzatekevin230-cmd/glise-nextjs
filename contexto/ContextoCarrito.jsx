// contexto/ContextoCarrito.jsx

"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  return useContext(CarritoContext);
};

export const ProveedorCarrito = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const cartFromStorage = localStorage.getItem('glise_cart');
      if (cartFromStorage) {
        setCart(JSON.parse(cartFromStorage));
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error al cargar el carrito desde localStorage:", error);
      }
      localStorage.removeItem('glise_cart');
    }
  }, []);

  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('glise_cart', JSON.stringify(updatedCart));
  };

  const agregarAlCarrito = (product, quantity = 1) => {
    const newCart = [...cart];
    const existingItemIndex = newCart.findIndex(item => String(item.id) === String(product.id));

    if (existingItemIndex > -1) {
      newCart[existingItemIndex].quantity += quantity;
    } else {
      newCart.push({ ...product, quantity });
    }
    
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => String(item.id) !== String(productId));
    saveCartToStorage(updatedCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map(item =>
      String(item.id) === String(productId) ? { ...item, quantity: newQuantity } : item
    );
    saveCartToStorage(updatedCart);
  };
  
  // --- FUNCIÓN QUE FALTABA ---
  const clearCart = () => {
    saveCartToStorage([]); // Simplemente guarda un carrito vacío
  };

  const value = {
    cart,
    agregarAlCarrito,
    removeFromCart,
    updateQuantity,
    clearCart, // <-- Y la exportamos aquí para que esté disponible
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};