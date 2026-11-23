// contexto/ContextoFavoritos.jsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import toast from 'react-hot-toast';

const FavoritosContext = createContext();

export function ProveedorFavoritos({ children }) {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!currentUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFavorites((userData.favorites || []).map(String));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addToFavorites = useCallback(async (productId) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para guardar favoritos', { duration: 3000 });
      return { success: false, reason: 'not_logged_in' };
    }

    const idStr = String(productId);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, { favorites: [idStr] });
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(idStr) });
      }

      setFavorites(prev => (prev.includes(idStr) ? prev : [...prev, idStr]));
      toast.success('Agregado a favoritos', { duration: 2000, icon: '❤️' });
      return { success: true };
    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
      toast.error('Error al agregar a favoritos');
      return { success: false, reason: 'error' };
    }
  }, [currentUser]);

  const removeFromFavorites = useCallback(async (productId) => {
    if (!currentUser) {
      return { success: false, reason: 'not_logged_in' };
    }

    const idStr = String(productId);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        favorites: arrayRemove(idStr)
      });

      setFavorites(prev => prev.filter(id => String(id) !== idStr));
      toast.success('💔 Eliminado de favoritos', { duration: 2000 });
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      toast.error('Error al eliminar de favoritos');
      return { success: false, reason: 'error' };
    }
  }, [currentUser]);

  const isFavorite = useCallback((productId) => {
    return favorites.includes(String(productId));
  }, [favorites]);

  const toggleFavorite = useCallback(async (productId) => {
    const idStr = String(productId);
    if (isFavorite(idStr)) {
      return await removeFromFavorites(idStr);
    }
    return await addToFavorites(idStr);
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  return (
    <FavoritosContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritosContext() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de ProveedorFavoritos');
  }
  return context;
}