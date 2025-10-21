// app/blog/[slug]/page.jsx
import Image from 'next/image';
import Link from 'next/link';
// 1. IMPORTAMOS las funciones correctas, incluyendo la nueva y 'createSlug'
import { getBlogPostBySlug, getRelatedProductsForBlog, getRelatedBlogPosts, createSlug, getAllBlogPosts } from '@/lib/data.js';
import { processBlogImageUrl } from '@/lib/imageUtils';
import { notFound } from 'next/navigation';
import ProductosRelacionadosBlog from '@/components/ProductosRelacionadosBlog';
import ArticulosRelacionadosBlog from '@/components/ArticulosRelacionadosBlog';

// ISR: Revalidar cada 2 horas (blog)
export const revalidate = 7200;

// Genera todas las rutas de blog posts en build time
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  
  return posts.map((post) => ({
    slug: createSlug(post.title),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Artículo no encontrado' };
  return { 
    title: `${post.title} - Blog Glisé`, 
    description: post.description,
    openGraph: {
      title: `${post.title} - Blog Glisé`,
      description: post.description,
      images: [post.imageUrl],
    },
  };
}

export default async function PaginaArticulo({ params }) {
  // 2. Buscamos el post usando el SLUG de la URL, no el ID
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 3. Obtenemos los productos y posts relacionados como antes
  const [relatedProductsRaw, relatedPostsRaw] = await Promise.all([
    getRelatedProductsForBlog(post.category),
    getRelatedBlogPosts(post.category, post.id)
  ]);

  // 4. AÑADIMOS SLUGS a los items relacionados para que sus enlaces también funcionen
  const relatedProducts = relatedProductsRaw.map(p => ({
    ...p,
    slug: createSlug(p.name)
  }));
  const relatedPosts = relatedPostsRaw.map(p => ({
    ...p,
    slug: createSlug(p.title)
  }));

  const imageUrl = processBlogImageUrl(post.imageUrl);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      
      <Link 
        href="/blog" 
        className="mb-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        Volver al Blog
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg static-page-content max-w-4xl mx-auto mt-8">
          
          <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden mb-6">
            <Image 
              src={imageUrl}
              alt={post.title} 
              fill
              className="object-cover"
              priority
            />
          </div>

          <span className="text-blue-600 font-semibold text-sm uppercase">{post.category}</span>
          <h2 className="text-3xl lg:text-4xl font-bold my-2">{post.title}</h2>
          <div className="mt-6 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: post.fullContent }}></div>
      </div>

      {/* 5. Pasamos los datos ya con los slugs a los componentes */}
      <ProductosRelacionadosBlog products={relatedProducts} />
      <ArticulosRelacionadosBlog posts={relatedPosts} />

    </main>
  );
}
