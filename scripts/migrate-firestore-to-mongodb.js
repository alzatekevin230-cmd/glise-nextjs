// scripts/migrate-firestore-to-mongodb.js
// Script para migrar datos de Firestore a MongoDB

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDatabase } from '../lib/mongodb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = getFirestore();
const db = await getDatabase();

console.log('\n🚀 Iniciando migración Firestore → MongoDB\n');

// Función para crear índices
async function createIndexes() {
  console.log('📊 Creando índices...\n');
  
  const products = db.collection('products');
  const blogPosts = db.collection('blogPosts');
  const orders = db.collection('orders');
  const reviews = db.collection('reviews');
  const users = db.collection('users');
  
  try {
    // Índices para products
    await products.createIndex({ id: 1 }, { unique: true });
    await products.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await products.createIndex({ category: 1 });
    await products.createIndex({ laboratorio: 1 });
    console.log('✅ Índices de products creados');
    
    // Índices para blogPosts
    await blogPosts.createIndex({ id: 1 }, { unique: true });
    await blogPosts.createIndex({ slug: 1 }, { unique: true, sparse: true });
    console.log('✅ Índices de blogPosts creados');
    
    // Índices para orders
    await orders.createIndex({ orderId: 1 }, { unique: true });
    await orders.createIndex({ userId: 1 });
    await orders.createIndex({ status: 1 });
    await orders.createIndex({ createdAt: -1 });
    console.log('✅ Índices de orders creados');
    
    // Índices para reviews
    await reviews.createIndex({ productId: 1 });
    await reviews.createIndex({ userId: 1 });
    console.log('✅ Índices de reviews creados');
    
    // Índices para users
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('✅ Índices de users creados');
    
  } catch (error) {
    console.error('⚠️ Error creando índices (puede que ya existan):', error.message);
  }
}

// Migrar productos
async function migrateProducts() {
  console.log('\n📦 Migrando productos...\n');
  
  const productsRef = firestore.collection('products');
  const snapshot = await productsRef.get();
  
  const products = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    products.push({
      id: data.id || parseInt(doc.id),
      ...data,
      _firestoreId: doc.id, // Guardar ID original por si acaso
    });
  });
  
  if (products.length === 0) {
    console.log('⚠️ No hay productos para migrar');
    return;
  }
  
  const productsCollection = db.collection('products');
  
  // Insertar en lotes de 100
  let inserted = 0;
  for (let i = 0; i < products.length; i += 100) {
    const batch = products.slice(i, i + 100);
    
    try {
      await productsCollection.insertMany(batch, { ordered: false });
      inserted += batch.length;
      console.log(`✅ ${inserted}/${products.length} productos migrados`);
    } catch (error) {
      // Si hay duplicados, actualizar uno por uno
      for (const product of batch) {
        try {
          await productsCollection.replaceOne({ id: product.id }, product, { upsert: true });
          inserted++;
        } catch (e) {
          console.error(`❌ Error con producto ${product.id}:`, e.message);
        }
      }
      console.log(`✅ ${inserted}/${products.length} productos migrados`);
    }
  }
  
  console.log(`\n✅ Productos migrados: ${inserted}/${products.length}`);
}

// Migrar blog posts
async function migrateBlogPosts() {
  console.log('\n📝 Migrando blog posts...\n');
  
  const blogRef = firestore.collection('blogPosts');
  const snapshot = await blogRef.orderBy('id', 'asc').get();
  
  const posts = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    posts.push({
      id: data.id || parseInt(doc.id),
      ...data,
      _firestoreId: doc.id,
    });
  });
  
  if (posts.length === 0) {
    console.log('⚠️ No hay blog posts para migrar');
    return;
  }
  
  const blogCollection = db.collection('blogPosts');
  
  let inserted = 0;
  for (const post of posts) {
    try {
      await blogCollection.replaceOne({ id: post.id }, post, { upsert: true });
      inserted++;
    } catch (error) {
      console.error(`❌ Error con post ${post.id}:`, error.message);
    }
  }
  
  console.log(`\n✅ Blog posts migrados: ${inserted}/${posts.length}`);
}

// Migrar usuarios
async function migrateUsers() {
  console.log('\n👤 Migrando usuarios...\n');
  
  const usersRef = firestore.collection('users');
  const snapshot = await usersRef.get();
  
  const users = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    users.push({
      _id: doc.id, // Usar Firebase UID como _id
      email: data.email,
      name: data.name,
      favorites: data.favorites || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      ...data,
    });
  });
  
  if (users.length === 0) {
    console.log('⚠️ No hay usuarios para migrar');
    return;
  }
  
  const usersCollection = db.collection('users');
  
  let inserted = 0;
  for (const user of users) {
    try {
      await usersCollection.replaceOne({ _id: user._id }, user, { upsert: true });
      inserted++;
    } catch (error) {
      console.error(`❌ Error con usuario ${user._id}:`, error.message);
    }
  }
  
  console.log(`\n✅ Usuarios migrados: ${inserted}/${users.length}`);
}

// Migrar pedidos
async function migrateOrders() {
  console.log('\n📦 Migrando pedidos...\n');
  
  // Migrar pedidos de subcolecciones users/{uid}/orders
  const usersRef = firestore.collection('users');
  const usersSnapshot = await usersRef.get();
  
  const orders = [];
  
  for (const userDoc of usersSnapshot.docs) {
    const ordersRef = userDoc.ref.collection('orders');
    const ordersSnapshot = await ordersRef.get();
    
    ordersSnapshot.forEach(orderDoc => {
      const data = orderDoc.data();
      orders.push({
        _id: orderDoc.id,
        orderId: data.orderId,
        userId: userDoc.id, // Referencia al usuario
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
  }
  
  if (orders.length === 0) {
    console.log('⚠️ No hay pedidos para migrar');
    return;
  }
  
  const ordersCollection = db.collection('orders');
  
  let inserted = 0;
  for (const order of orders) {
    try {
      await ordersCollection.replaceOne({ orderId: order.orderId }, order, { upsert: true });
      inserted++;
    } catch (error) {
      console.error(`❌ Error con pedido ${order.orderId}:`, error.message);
    }
  }
  
  console.log(`\n✅ Pedidos migrados: ${inserted}/${orders.length}`);
}

// Migrar reseñas
async function migrateReviews() {
  console.log('\n⭐ Migrando reseñas...\n');
  
  const reviewsRef = firestore.collection('reviews');
  const snapshot = await reviewsRef.get();
  
  const reviews = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    reviews.push({
      _id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    });
  });
  
  if (reviews.length === 0) {
    console.log('⚠️ No hay reseñas para migrar');
    return;
  }
  
  const reviewsCollection = db.collection('reviews');
  
  let inserted = 0;
  for (const review of reviews) {
    try {
      await reviewsCollection.replaceOne({ _id: review._id }, review, { upsert: true });
      inserted++;
    } catch (error) {
      console.error(`❌ Error con reseña ${review._id}:`, error.message);
    }
  }
  
  console.log(`\n✅ Reseñas migradas: ${inserted}/${reviews.length}`);
}

// Función principal
async function migrate() {
  try {
    // Crear índices primero
    await createIndexes();
    
    // Migrar datos
    await migrateProducts();
    await migrateBlogPosts();
    await migrateUsers();
    await migrateOrders();
    await migrateReviews();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 MIGRACIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log('\n✅ Todos los datos han sido migrados a MongoDB');
    console.log('💡 Verifica los datos en MongoDB Atlas\n');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
  }
}

migrate();
