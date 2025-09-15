// hooks/useSearch.js
"use client";

import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useProductos } from '@/contexto/ContextoProductos';

export function useSearch() {
  const { allProducts } = useProductos();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fuse = useMemo(() => {
    if (allProducts && allProducts.length > 0) {
      return new Fuse(allProducts, {
        keys: ['name', 'category', 'laboratorio'],
        includeScore: true,
        threshold: 0.4,
      });
    }
    return null;
  }, [allProducts]);

  useEffect(() => {
    if (fuse && searchTerm.length > 2) {
      const results = fuse.search(searchTerm).slice(0, 5).map(result => result.item);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, fuse]);

  return { searchTerm, setSearchTerm, suggestions };
}