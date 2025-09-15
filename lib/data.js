import { db } from './firebaseAdmin.js';

// --- NUEVA FUNCIÓN UTILITARIA PARA CREAR SLUGS ---
export function createSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Quita acentos
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-') // Reemplaza espacios con -
    .replace(/[^\w\-]+/g, '') // Quita caracteres especiales
    .replace(/\-\-+/g, '-'); // Quita guiones duplicados
}

// lib/data.js

// lib/data.js

export async function getHomePageData() {
  try {
    const productsSnapshot = await db.collection('products').get();
    const allProducts = productsSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Añadimos el slug a los productos
      slug: createSlug(doc.data().name) 
    }));

    const blogSnapshot = await db.collection('blogPosts').orderBy('id', 'asc').get();
    
    // ===== ESTA ES LA CORRECCIÓN CLAVE =====
    // Ahora también añadimos el slug a cada post del blog
    const allBlogPosts = blogSnapshot.docs.map(doc => {
      const post = doc.data();
      return {
        ...post,
        slug: createSlug(post.title)
      }
    });

    return { products: allProducts, blogPosts: allBlogPosts };
  } catch (error) {
    console.error("Error al obtener datos de Firestore:", error);
    return { products: [], blogPosts: [] };
  }
}
export async function getAllBlogPosts() {
  try {
    const blogSnapshot = await db.collection('blogPosts').orderBy('id', 'asc').get();
    const allBlogPosts = blogSnapshot.docs.map(doc => doc.data());
    return allBlogPosts;
  } catch (error) {
    console.error("Error al obtener los artículos del blog:", error);
    return [];
  }
}

export async function getBlogPostById(id) {
  try {
    const postsRef = db.collection('blogPosts');
    const q = postsRef.where("id", "==", parseInt(id));
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Error al obtener el artículo del blog:", error);
    return null;
  }
}
export async function getBlogPostBySlug(slug) {
  try {
    const postsRef = db.collection('blogPosts');
    // Buscamos un documento donde el campo 'slug' sea exactamente igual al slug de la URL
    const q = postsRef.where("slug", "==", slug);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.warn(`No se encontró ningún post con el slug: ${slug}`);
      return null;
    }
    // Devolvemos los datos del primer post que coincida
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Error al obtener el artículo del blog por slug:", error);
    return null;
  }
}

export async function getProductsByCategory(categorySlug) {
  try {
    let q;
    if (categorySlug === 'all') {
      q = db.collection('products');
    } else {
      const decodedCategory = decodeURIComponent(categorySlug);
      q = db.collection('products').where('category', '==', decodedCategory);
    }
    const snapshot = await q.get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
        console.error("El ID proporcionado no es un número válido:", id);
        return null;
    }

    const productsRef = db.collection('products');
    const q = productsRef.where("id", "==", numericId);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.warn(`No se encontró ningún producto con el CAMPO id: ${numericId}`);
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };

  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return null;
  }
}

// --- FUNCIÓN NUEVA PARA USAR CON LAS URLS AMIGABLES ---
export async function getProductBySlug(slug) {
  try {
    const productsRef = db.collection('products');
    const q = productsRef.where("slug", "==", slug);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.warn(`No se encontró ningún producto con el slug: ${slug}`);
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error al obtener el producto por slug:", error);
    return null;
  }
}

export async function getAllProducts() {
    try {
        const snapshot = await db.collection('products').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener todos los productos:", error);
        return [];
    }
}

export async function getRelatedProducts(category, currentProductId) {
  try {
    const productsRef = db.collection("products");
    const q = productsRef.where("category", "==", category);
    const snapshot = await q.get();

    if (snapshot.empty) {
      return [];
    }
    
    // Filtramos para no incluir el producto actual
    const products = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.id !== currentProductId);

    // Mezcla y toma hasta 10 productos
    return products.sort(() => 0.5 - Math.random()).slice(0, 10);
  } catch (error) {
    console.error("Error al obtener productos relacionados:", error);
    return [];
  }
}

export async function getProductsByBrand(brandName) {
  try {
    const decodedBrand = decodeURIComponent(brandName);
    const productsRef = db.collection('products');
    const q = productsRef.where('laboratorio', '==', decodedBrand);
    const snapshot = await q.get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener productos por marca:", error);
    return [];
  }
}

export async function getRelatedProductsForBlog(category) {
  try {
    const productsRef = db.collection("products");
    const q = productsRef.where("category", "==", category);
    const snapshot = await q.get();

    if (snapshot.empty) {
      return [];
    }
    
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products.sort(() => 0.5 - Math.random()).slice(0, 10);
  } catch (error) {
    console.error("Error al obtener productos relacionados para el blog:", error);
    return [];
  }
}

export async function getRelatedBlogPosts(category, currentPostId) {
  try {
    const postsRef = db.collection("blogPosts");
    const q = postsRef.where("category", "==", category);
    const snapshot = await q.get();

    if (snapshot.empty) {
      return [];
    }
    
    const posts = snapshot.docs
      .map(doc => doc.data())
      .filter(p => p.id !== currentPostId);
      
    return posts.sort(() => 0.5 - Math.random()).slice(0, 3);
  } catch (error) {
    console.error("Error al obtener artículos relacionados:", error);
    return [];
  }
}