// app/blog/page.js

import { getAllBlogPosts } from '@/lib/data';
import ArticuloBlogCard from '@/components/ArticuloBlogCard';
import Link from 'next/link'; // Importamos Link

export default async function PaginaPrincipalBlog() {
  const posts = await getAllBlogPosts();

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      
      {/* --- BOTÓN AÑADIDO --- */}
      <Link 
  href="/" 
  className="mb-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center transition-colors"
>
  <i className="fas fa-arrow-left mr-2"></i>
  Volver a la tienda
</Link>

      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold text-gray-800">Blog de Bienestar y Belleza</h1>
        <p className="text-lg text-gray-600 mt-2">Consejos, guías y novedades del mundo Glisé.</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <ArticuloBlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No se encontraron artículos en el blog por el momento.</p>
        </div>
      )}
    </main>
  );
}