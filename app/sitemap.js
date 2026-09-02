// app/sitemap.js (o donde lo tengas ubicado)
import { getHomePageData } from '@/lib/data';
import { getImageUrl } from '@/lib/imageUtils';

export default async function sitemap() {
  const baseUrl = 'https://glise.com.co';

  // 1. Obtenemos todos los productos y artículos del blog
  const { products, blogPosts } = await getHomePageData();

  // 2. Definimos las rutas estáticas principales
  const staticRoutes = [
    '',
    '/sobre-nosotros',
    '/contacto',
    '/blog',
    '/politicas',
    '/politica-devoluciones',
    '/politicas-de-envio',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 3. Definimos las rutas de las categorías
  const categories = [
    'all',
    'Dermocosméticos',
    'Cuidado Infantil',
    'Milenario',
    'Cuidado y Belleza',
    'Naturales y Homeopáticos'
  ].map((category) => ({
    url: `${baseUrl}/categoria/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 4. Mapeamos dinámicamente los productos (incluyendo imágenes para Google Images)
  const productRoutes = (products || []).map((product) => {
    const rawImages = [product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean);
    // Quitamos duplicados y limitamos a 5 imágenes por producto (límite recomendado por Google)
    const images = [...new Set(rawImages)].slice(0, 5).map((img) => getImageUrl(img, '700x700'));

    return {
      url: `${baseUrl}/producto/${product.slug || product.id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      ...(images.length > 0 ? { images } : {}),
    };
  });

  // 🔥 5. NUEVO: Mapeamos dinámicamente los artículos del blog
  const blogRoutes = (blogPosts || []).map((post) => {
    const image = post.imageUrl ? getImageUrl(post.imageUrl, '1200x630') : null;

    return {
      url: `${baseUrl}/blog/${post.slug || post.id}`, // <-- Ajusta '/blog/' si tu ruta es distinta
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly', // Los artículos suelen cambiar menos frecuentemente que los productos
      priority: 0.6,
      ...(image ? { images: [image] } : {}),
    };
  });

  // Combinamos TODO (incluyendo el blog) y se lo entregamos a Next.js
  return [...staticRoutes, ...categories, ...productRoutes, ...blogRoutes];
}