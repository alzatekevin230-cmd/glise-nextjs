// components/BlogSearchFilter.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function BlogSearchFilter({ posts, onFilteredPostsChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Obtener categorías únicas de los posts
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map(post => post.category))];
    return ['todos', ...uniqueCategories.sort()];
  }, [posts]);

  // Filtrar posts basado en búsqueda y categoría
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filtro de categoría
      const matchesCategory = selectedCategory === 'todos' || 
                              post.category.toLowerCase() === selectedCategory.toLowerCase();
      
      // Filtro de búsqueda (en título y descripción)
      const matchesSearch = searchTerm === '' || 
                           post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Notificar cambios al componente padre
  useEffect(() => {
    onFilteredPostsChange(filteredPosts);
  }, [filteredPosts, onFilteredPostsChange]);

  // Limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <div className="mb-8 space-y-4">
      
      {/* Barra de búsqueda */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar artículos por título o tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-800 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => {
          const isActive = selectedCategory === category;
          const categoryLabel = category === 'todos' ? 'Todos' : category;
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {categoryLabel}
              {isActive && category !== 'todos' && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {filteredPosts.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Resultados */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          {filteredPosts.length === 0 ? (
            <span className="text-red-500 font-semibold">
              😕 No se encontraron artículos con esos filtros
            </span>
          ) : filteredPosts.length === posts.length ? (
            <span>
              Mostrando <span className="font-bold text-blue-600">{posts.length}</span> artículos
            </span>
          ) : (
            <span>
              Mostrando <span className="font-bold text-blue-600">{filteredPosts.length}</span> de {posts.length} artículos
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

