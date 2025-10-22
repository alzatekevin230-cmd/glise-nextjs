// app/blog/page.js
import { getAllBlogPosts } from '@/lib/data';
import BlogPageClient from './BlogPageClient';

export const metadata = {
  title: 'Blog de Bienestar y Belleza - Glisé',
  description: 'Descubre consejos, guías y novedades sobre belleza, bienestar y cuidado personal. Artículos escritos por expertos para tu salud y belleza.',
  openGraph: {
    title: 'Blog de Bienestar y Belleza - Glisé',
    description: 'Consejos, guías y novedades del mundo de la belleza y el bienestar.',
  },
};

export default async function PaginaPrincipalBlog() {
  const posts = await getAllBlogPosts();

  return <BlogPageClient posts={posts} />;
}
