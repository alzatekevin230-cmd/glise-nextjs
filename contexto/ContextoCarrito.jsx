// contexto/ContextoCarrito.jsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CarritoContext = createContext();

// Constantes
const MAX_QUANTITY_PER_ITEM = 10;
const STORAGE_KEY = 'glise_cart';

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de ProveedorCarrito');
  }
  return context;
};

export const ProveedorCarrito = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar carrito desde localStorage al inicio
  useEffect(() => {
    try {
      const cartFromStorage = localStorage.getItem(STORAGE_KEY);
      if (cartFromStorage) {
        const parsedCart = JSON.parse(cartFromStorage);
        // Validar que sea un array
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error al cargar el carrito desde localStorage:", error);
      }
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar carrito en localStorage (optimizado con useCallback)
  const saveCartToStorage = useCallback((updatedCart) => {
    try {
      setCart(updatedCart);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error al guardar el carrito:", error);
      }
    }
  }, []);

  // Agregar al carrito con validación de límites
  const agregarAlCarrito = useCallback((product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Producto inválido');
      return { success: false, reason: 'invalid' };
    }

    const newCart = [...cart];
    const existingItemIndex = newCart.findIndex(item => String(item.id) === String(product.id));

    if (existingItemIndex > -1) {
      const newQuantity = newCart[existingItemIndex].quantity + quantity;
      
      // Validar límite máximo
      if (newQuantity > MAX_QUANTITY_PER_ITEM) {
        return { success: false, reason: 'max_limit', max: MAX_QUANTITY_PER_ITEM };
      }
      
      newCart[existingItemIndex].quantity = newQuantity;
    } else {
      // Nuevo producto
      if (quantity > MAX_QUANTITY_PER_ITEM) {
        return { success: false, reason: 'max_limit', max: MAX_QUANTITY_PER_ITEM };
      }
      newCart.push({ ...product, quantity });
    }
    
    saveCartToStorage(newCart);
    return { success: true, isNew: existingItemIndex === -1 };
  }, [cart, saveCartToStorage]);

  // Eliminar del carrito
  const removeFromCart = useCallback((productId) => {
    const updatedCart = cart.filter(item => String(item.id) !== String(productId));
    saveCartToStorage(updatedCart);
    return true;
  }, [cart, saveCartToStorage]);

  // Actualizar cantidad con validación
  const updateQuantity = useCallback((productId, newQuantity) => {
    // Si es menor a 1, eliminar
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    // Validar límite máximo
    if (newQuantity > MAX_QUANTITY_PER_ITEM) {
      return { success: false, reason: 'max_limit', max: MAX_QUANTITY_PER_ITEM };
    }

    const updatedCart = cart.map(item =>
      String(item.id) === String(productId) ? { ...item, quantity: newQuantity } : item
    );
    saveCartToStorage(updatedCart);
    return { success: true };
  }, [cart, saveCartToStorage, removeFromCart]);
  
  // Vaciar carrito
  const clearCart = useCallback(() => {
    saveCartToStorage([]);
    return true;
  }, [saveCartToStorage]);

  // Obtener cantidad total de items
  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Obtener subtotal
  const getSubtotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const value = {
    cart,
    isLoading,
    agregarAlCarrito,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    MAX_QUANTITY_PER_ITEM,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
