// lib/data.js
import { db } from './firebaseAdmin.js';

const NEW_PRODUCT_DAYS = 60;

// Caché en memoria del servidor para respuesta instantánea (0ms)
let cachedProducts = null;
let productsCacheTime = 0;
let cachedBlogPosts = null;
let blogCacheTime = 0;
const cachedReviewStats = new Map();
const MEMORY_CACHE_TTL = 30 * 60 * 1000; // 30 minutos en memoria

// Función para limpiar la memoria al instante cuando actualices un precio o haya una venta
export function clearDataCache() {
  cachedProducts = null;
  productsCacheTime = 0;
  cachedBlogPosts = null;
  blogCacheTime = 0;
  cachedReviewStats.clear();
}

function isProductNew(createTime) {
  if (!createTime) return false;
  const date = typeof createTime.toDate === 'function' ? createTime.toDate() : new Date(createTime);
  if (isNaN(date.getTime())) return false;
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_PRODUCT_DAYS;
}

export function createSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function mapProductDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    slug: data.slug || createSlug(data.name),
    isNew: isProductNew(doc.createTime),
  };
}

export async function getAllProducts() {
  const now = Date.now();
  if (cachedProducts && (now - productsCacheTime) < MEMORY_CACHE_TTL) {
    return cachedProducts;
  }

  try {
    const snapshot = await db.collection('products').get();
    if (snapshot.empty) {
      return [];
    }
    cachedProducts = snapshot.docs.map(mapProductDoc);
    productsCacheTime = now;
    return cachedProducts;
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    return cachedProducts || [];
  }
}

async function getAllBlogPostsRaw() {
  const now = Date.now();
  if (cachedBlogPosts && (now - blogCacheTime) < MEMORY_CACHE_TTL) {
    return cachedBlogPosts;
  }

  try {
    const blogSnapshot = await db.collection('blogPosts').orderBy('id', 'asc').get();
    cachedBlogPosts = blogSnapshot.docs.map(doc => {
      const post = doc.data();
      return {
        ...post,
        slug: post.slug || createSlug(post.title),
      };
    });
    blogCacheTime = now;
    return cachedBlogPosts;
  } catch (error) {
    console.error("Error al obtener los artículos del blog:", error);
    return cachedBlogPosts || [];
  }
}

// Devuelve los artículos sin el HTML pesado (fullContent) para que la portada cargue rápido
export async function getAllBlogPosts() {
  const posts = await getAllBlogPostsRaw();
  return posts.map(({ fullContent, ...summaryPost }) => summaryPost);
}

export async function getHomePageData() {
  try {
    const [products, blogPosts] = await Promise.all([
      getAllProducts(),
      getAllBlogPosts(),
    ]);
    return { products, blogPosts };
  } catch (error) {
    console.error("Error al obtener datos de Firestore:", error);
    return { products: [], blogPosts: [] };
  }
}

export async function getBlogPostById(id) {
  const numericId = parseInt(id);
  const posts = await getAllBlogPostsRaw();
  return posts.find(p => p.id === numericId) || null;
}

export async function getBlogPostBySlug(slug) {
  const posts = await getAllBlogPostsRaw();
  return posts.find(p => p.slug === slug || createSlug(p.title) === slug) || null;
}

export async function getProductsByCategory(categorySlug) {
  const allProducts = await getAllProducts();
  if (categorySlug === 'all') {
    return allProducts;
  }
  const decodedCategory = decodeURIComponent(categorySlug);
  return allProducts.filter(p => p.category === decodedCategory);
}

export async function getProductById(id) {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    console.error("El ID proporcionado no es un número válido:", id);
    return null;
  }
  const allProducts = await getAllProducts();
  return allProducts.find(p => Number(p.id) === numericId) || null;
}

export async function getProductBySlug(slug) {
  const allProducts = await getAllProducts();
  return allProducts.find(p => p.slug === slug) || null;
}

export async function getProductReviewStats(productId) {
  const key = Number(productId);
  const now = Date.now();
  const cached = cachedReviewStats.get(key);
  if (cached && (now - cached.time) < MEMORY_CACHE_TTL) {
    return cached.data;
  }

  try {
    const snapshot = await db.collection('reviews')
      .where('productId', '==', key)
      .select('rating')
      .get();

    if (snapshot.empty) {
      const emptyStats = { average: 0, count: 0 };
      cachedReviewStats.set(key, { data: emptyStats, time: now });
      return emptyStats;
    }
    const ratings = snapshot.docs.map(doc => doc.data().rating || 0);
    const average = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
    const stats = { average: Number(average.toFixed(1)), count: ratings.length };
    cachedReviewStats.set(key, { data: stats, time: now });
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas de reseñas:', error);
    return { average: 0, count: 0 };
  }
}

export async function getRelatedProducts(category, currentProductId) {
  const allProducts = await getAllProducts();
  return allProducts
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 10);
}

export async function getProductsByBrand(brandName) {
  const decodedBrand = decodeURIComponent(brandName);
  const allProducts = await getAllProducts();
  return allProducts.filter(p => p.laboratorio === decodedBrand);
}

export async function getRelatedProductsForBlog(category) {
  const allProducts = await getAllProducts();
  return allProducts
    .filter(p => p.category === category)
    .slice(0, 10);
}

export async function getRelatedBlogPosts(category, currentPostId) {
  const posts = await getAllBlogPosts();
  return posts
    .filter(p => p.category === category && p.id !== currentPostId)
    .slice(0, 3);
}