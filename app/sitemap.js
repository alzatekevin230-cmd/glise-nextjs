import { getHomePageData } from '@/lib/data';

export default async function sitemap() {
  const baseUrl = 'https://glise.com.co';

  // 1. Obtenemos todos los productos y artículos del blog usando tu función existente
  const { products, blogPosts } = await getHomePageData();

  // 2. Definimos las rutas estáticas principales de la tienda
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

  // 4. Mapeamos dinámicamente TODOS tus productos desde Firebase
  const productRoutes = (products || []).map((product) => ({
    url: `${baseUrl}/producto/${product.slug || product.id}`,
    // Si el producto tiene fecha de actualización en BD la usa, si no, usa la fecha actual
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Combinamos todas las listas de URLs y se las entregamos a Next.js
  return [...staticRoutes, ...categories, ...productRoutes];
}