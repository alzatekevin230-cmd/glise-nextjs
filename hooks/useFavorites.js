// hooks/useFavorites.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar favoritos del usuario
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
        setFavorites(userData.favorites || []);
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

  // Cargar favoritos cuando el usuario cambia
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Agregar a favoritos
  const addToFavorites = useCallback(async (productId) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para guardar favoritos', {
        duration: 3000,
      });
      return { success: false, reason: 'not_logged_in' };
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Crear documento del usuario si no existe
        await setDoc(userRef, {
          favorites: [productId]
        });
      } else {
        // Agregar a favoritos si no está ya
        await updateDoc(userRef, {
          favorites: arrayUnion(productId)
        });
      }

      setFavorites(prev => [...prev, productId]);
      toast.success('❤️ Agregado a favoritos', {
        duration: 2000,
        icon: '❤️',
      });
      return { success: true };
    } catch (error) {
      console.error('Error al agregar a favoritos:', error);
      toast.error('Error al agregar a favoritos');
      return { success: false, reason: 'error' };
    }
  }, [currentUser]);

  // Eliminar de favoritos
  const removeFromFavorites = useCallback(async (productId) => {
    if (!currentUser) {
      return { success: false, reason: 'not_logged_in' };
    }

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        favorites: arrayRemove(productId)
      });
      
      setFavorites(prev => prev.filter(id => id !== productId));
      toast.success('💔 Eliminado de favoritos', {
        duration: 2000,
      });
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      toast.error('Error al eliminar de favoritos');
      return { success: false, reason: 'error' };
    }
  }, [currentUser]);

  // Verificar si un producto está en favoritos
  const isFavorite = useCallback((productId) => {
    return favorites.includes(String(productId));
  }, [favorites]);

  // Toggle favorito (agregar o eliminar)
  const toggleFavorite = useCallback(async (productId) => {
    const productIdStr = String(productId);
    if (isFavorite(productIdStr)) {
      return await removeFromFavorites(productIdStr);
    } else {
      return await addToFavorites(productIdStr);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    loadFavorites
  };
}






