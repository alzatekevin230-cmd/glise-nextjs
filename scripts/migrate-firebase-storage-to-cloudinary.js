// scripts/migrate-firebase-storage-to-cloudinary.js
// Script para migrar imágenes existentes de Firebase Storage a Cloudinary
// Útil si ya tienes productos en Firestore con URLs de Firebase Storage

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import fs from 'fs';
import { uploadImage, uploadProductImage } from '../lib/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

// Inicializar Firebase Admin
let db, bucket;
try {
  const serviceAccountPath = path.join(__dirname, '../ProyectoGlise/public/serviceAccountKey.json');
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: serviceAccount.project_id + '.appspot.com',
  });
  
  db = getFirestore();
  bucket = getStorage().bucket();
  console.log('✅ Conectado a Firebase Admin');
} catch (error) {
  console.error('❌ Error al conectar a Firebase:', error);
  process.exit(1);
}

/**
 * Descarga una imagen desde una URL y la devuelve como Buffer
 */
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Error al descargar: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Extrae información de la ruta de Firebase Storage
 * Ejemplo: products/nat/bel1.webp
 */
function extractPathFromFirebaseURL(url) {
  try {
    // Formato: https://firebasestorage.googleapis.com/v0/b/bucket/o/path?alt=media&token=...
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1]);
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Migra una imagen de Firebase Storage a Cloudinary
 */
async function migrateImageFromFirebase(firebaseURL, productId, category, productName) {
  try {
    // Descargar imagen desde Firebase
    console.log(`  📥 Descargando: ${firebaseURL}`);
    const imageBuffer = await downloadImage(firebaseURL);

    // Subir a Cloudinary
    console.log(`  ☁️ Subiendo a Cloudinary...`);
    const cloudinaryURL = await uploadProductImage(
      imageBuffer,
      category,
      productName,
      {
        overwrite: false,
        invalidate: false,
        tags: ['product', category?.toLowerCase(), 'migrated-from-firebase'],
        context: {
          originalFirebaseURL: firebaseURL,
          productId: productId.toString(),
        },
      }
    );

    console.log(`  ✅ Migrada: ${cloudinaryURL}`);
    return cloudinaryURL;
  } catch (error) {
    console.error(`  ❌ Error al migrar imagen:`, error.message);
    return null;
  }
}

/**
 * Migra todos los productos de Firestore
 */
async function migrateAllProducts() {
  try {
    console.log('📦 Obteniendo productos de Firestore...');
    const productsSnapshot = await db.collection('products').get();

    if (productsSnapshot.empty) {
      console.log('⚠️ No hay productos en Firestore');
      return;
    }

    console.log(`✅ Encontrados ${productsSnapshot.size} productos\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < productsSnapshot.docs.length; i++) {
      const doc = productsSnapshot.docs[i];
      const productData = doc.data();
      const productId = doc.id;

      console.log(`\n[${i + 1}/${productsSnapshot.size}] Procesando: ${productData.name || productId}`);

      try {
        const updates = {};
        let hasUpdates = false;

        // Migrar imagen principal
        if (productData.image && productData.image.includes('firebasestorage')) {
          console.log('  🖼️ Migrando imagen principal...');
          const newURL = await migrateImageFromFirebase(
            productData.image,
            productId,
            productData.category,
            productData.name
          );

          if (newURL) {
            updates.image = newURL;
            hasUpdates = true;
          }
        }

        // Migrar array de imágenes
        if (productData.images && Array.isArray(productData.images)) {
          console.log(`  🖼️ Migrando ${productData.images.length} imágenes adicionales...`);
          const migratedImages = [];

          for (const imageURL of productData.images) {
            if (imageURL.includes('firebasestorage')) {
              const newURL = await migrateImageFromFirebase(
                imageURL,
                productId,
                productData.category,
                productData.name
              );
              if (newURL) {
                migratedImages.push(newURL);
              } else {
                // Mantener la original si falla
                migratedImages.push(imageURL);
              }
            } else {
              // Ya no es de Firebase, mantenerla
              migratedImages.push(imageURL);
            }
          }

          if (migratedImages.length > 0) {
            updates.images = migratedImages;
            hasUpdates = true;
          }
        }

        // Actualizar en Firestore solo si hay cambios
        if (hasUpdates) {
          await db.collection('products').doc(productId).update(updates);
          console.log(`  ✅ Actualizado en Firestore`);
          successCount++;
        } else {
          console.log(`  ⏭️ Sin cambios (no hay URLs de Firebase Storage)`);
        }

        // Pequeño delay
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        errorCount++;
        errors.push({ product: productData.name || productId, reason: error.message });
        console.error(`  ❌ Error:`, error.message);
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Productos migrados: ${successCount}`);
    console.log(`❌ Productos con errores: ${errorCount}`);
    console.log(`📦 Total procesados: ${productsSnapshot.size}`);

    if (errors.length > 0) {
      console.log('\n⚠️ Errores encontrados:');
      errors.forEach(({ product, reason }) => {
        console.log(`  - ${product}: ${reason}`);
      });
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
    throw error;
  }
}

// Ejecutar migración
console.log('🚀 Iniciando migración de Firebase Storage → Cloudinary...\n');

migrateAllProducts()
  .then(() => {
    console.log('\n✅ Migración completada!');
    return admin.app().delete();
  })
  .then(() => {
    console.log('✅ Conexión de Firebase cerrada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
