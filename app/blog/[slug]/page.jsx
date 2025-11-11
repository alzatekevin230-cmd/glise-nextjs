// app/blog/[slug]/page.jsx
import Image from 'next/image';
import { getBlogPostBySlug, getRelatedProductsForBlog, getRelatedBlogPosts, createSlug, getAllBlogPosts } from '@/lib/data.js';
import { processBlogImageUrl } from '@/lib/imageUtils';
import { processContentWithIds, generateBlogPostSchema, calculateReadingTime, formatDate } from '@/lib/blogUtils';
import { notFound } from 'next/navigation';
import ProductosRelacionadosBlog from '@/components/ProductosRelacionadosBlog';
import ArticulosRelacionadosBlog from '@/components/ArticulosRelacionadosBlog';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import TableOfContents from '@/components/TableOfContents';
import NewsletterSignup from '@/components/NewsletterSignup';
import { FaUserCircle, FaCalendar, FaClock } from 'react-icons/fa';

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
  
  if (!post) return { title: 'Artículo no encontrado - Glisé Blog' };
  
  return { 
    title: `${post.title} | Blog Glisé`, 
    description: post.description,
    keywords: `${post.category}, belleza, bienestar, glisé, ${post.title}`,
    openGraph: {
      title: `${post.title} | Blog Glisé`,
      description: post.description,
      images: [post.imageUrl],
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      authors: ['Glisé'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Blog Glisé`,
      description: post.description,
      images: [post.imageUrl],
    },
  };
}

export default async function PaginaArticulo({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Obtener productos y posts relacionados
  const [relatedProductsRaw, relatedPostsRaw] = await Promise.all([
    getRelatedProductsForBlog(post.category),
    getRelatedBlogPosts(post.category, post.id)
  ]);

  // Añadir slugs a los items relacionados
  const relatedProducts = relatedProductsRaw.map(p => ({
    ...p,
    slug: createSlug(p.name)
  }));
  const relatedPosts = relatedPostsRaw.map(p => ({
    ...p,
    slug: createSlug(p.title)
  }));

  const imageUrl = processBlogImageUrl(post.imageUrl);
  const processedContent = processContentWithIds(post.fullContent);
  const readingTime = calculateReadingTime(post.fullContent);
  const formattedDate = formatDate(post.publishedAt || post.createdAt);

  // Generar URL completa para shares y schema
  const fullUrl = `https://glise.com.co/blog/${slug}`;
  const schema = generateBlogPostSchema(post, fullUrl);

  // Breadcrumbs data
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.category, href: `/blog?category=${encodeURIComponent(post.category.toLowerCase())}` },
    { label: post.title, href: `/blog/${slug}` }
  ];

  return (
    <>
      {/* JSON-LD Schema para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contenido principal del artículo */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              
              {/* Imagen destacada */}
              <div className="relative w-full aspect-[2/1]">
                <Image 
                  src={imageUrl}
                  alt={post.title} 
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Contenido del artículo */}
              <div className="p-6 sm:p-10">
                
                {/* Badge de categoría */}
                <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide mb-4">
                  {post.category}
                </span>

                {/* Título */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-blue-600" />
                    <span className="font-medium">Equipo Glisé</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-blue-600" />
                    <span>{formattedDate}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-600" />
                    <span>{readingTime} de lectura</span>
                  </div>
                </div>

                {/* Contenido del artículo */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:my-6 prose-ol:my-6
                    prose-li:text-gray-700 prose-li:mb-2
                    prose-img:rounded-xl prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                ></div>
              </div>
            </div>

            {/* Botones de compartir */}
            <div className="mt-8">
              <ShareButtons title={post.title} url={fullUrl} />
            </div>

            {/* Newsletter Signup */}
            <div className="mt-12">
              <NewsletterSignup />
            </div>
          </article>

          {/* Sidebar - Table of Contents (Desktop only) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={processedContent} />
            </div>
          </aside>
        </div>

        {/* Productos relacionados */}
        <div className="mt-16">
          <ProductosRelacionadosBlog products={relatedProducts} />
        </div>

        {/* Artículos relacionados */}
        <div className="mt-12">
          <ArticulosRelacionadosBlog posts={relatedPosts} />
        </div>

        </div>
      </main>
    </>
  );
}
