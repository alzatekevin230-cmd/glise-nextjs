// hooks/useSearch.js
"use client";

import { useState, useEffect } from 'react';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&limit=5`);
          const results = await response.json();
          setSuggestions(results);
        } catch (error) {
          console.error('Error en búsqueda:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { searchTerm, setSearchTerm, suggestions, isLoading };
}