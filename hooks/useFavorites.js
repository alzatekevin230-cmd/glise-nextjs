// hooks/useFavorites.js
"use client";

import { useFavoritosContext } from '@/contexto/ContextoFavoritos';

export function useFavorites() {
  return useFavoritosContext();
}