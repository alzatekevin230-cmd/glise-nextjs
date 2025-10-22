// app/blog/BlogPageClient.jsx
"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import ArticuloBlogCard from '@/components/ArticuloBlogCard';
import BlogSearchFilter from '@/components/BlogSearchFilter';

export default function BlogPageClient({ posts }) {
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleFilteredPostsChange = useCallback((filtered) => {
    setFilteredPosts(filtered);
  }, []);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      
      {/* Botón volver */}
      <Link 
        href="/" 
        className="mb-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Volver a la tienda
      </Link>

      {/* Header del blog */}
      <div className="text-center mb-12 mt-8">
        <div className="inline-block mb-4">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
            📝 Nuestro Blog
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Blog de Bienestar y Belleza
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Consejos de expertos, guías prácticas y las últimas novedades del mundo de la belleza y el bienestar. 
          Todo lo que necesitas saber para verte y sentirte mejor. ✨
        </p>
      </div>

      {/* Búsqueda y Filtros */}
      {posts && posts.length > 0 && (
        <BlogSearchFilter 
          posts={posts} 
          onFilteredPostsChange={handleFilteredPostsChange}
        />
      )}

      {/* Grid de artículos */}
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map(post => (
            <ArticuloBlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No encontramos artículos</h3>
          <p className="text-gray-600">Intenta con otros términos de búsqueda o categorías</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Próximamente</h3>
          <p className="text-gray-600">Estamos preparando contenido increíble para ti</p>
        </div>
      )}
    </main>
  );
}

