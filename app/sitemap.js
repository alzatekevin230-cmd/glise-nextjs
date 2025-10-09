// app/sitemap.js
import { getAllProducts, getAllBlogPosts, createSlug } from '@/lib/data';

export default async function sitemap() {
  const baseUrl = 'https://glise.com.co';
  
  // Obtener todos los productos y posts
  const products = await getAllProducts();
  const blogPosts = await getAllBlogPosts();

  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categoria/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politicas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-devoluciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // URLs de productos
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/producto/${createSlug(product.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // URLs de posts del blog
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${createSlug(post.title)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Categorías únicas
  const categories = [...new Set(products.map(p => p.category))];
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/categoria/${createSlug(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Marcas únicas
  const brands = [...new Set(products.map(p => p.laboratorio))];
  const brandUrls = brands.map((brand) => ({
    url: `${baseUrl}/marca/${createSlug(brand)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticUrls, ...productUrls, ...blogUrls, ...categoryUrls, ...brandUrls];
}

