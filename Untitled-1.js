// scripts/migrate-cloudinary-to-firebase.js
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { db } from '../lib/firebaseAdmin.js';
import { getStorage } from 'firebase-admin/storage';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback a .env estándar

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar Storage Bucket
// Asegúrate de que esta variable esté en tu .env: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!bucketName) {
  console.error('❌ Error: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET no está definido en las variables de entorno.');
  process.exit(1);
}

const bucket = admin.storage().bucket(bucketName);

/**
 * Descarga una imagen de una URL y devuelve un Buffer
 */
async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al descargar imagen: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Extrae el nombre del archivo de una URL de Cloudinary
 */
function getFileNameFromUrl(url) {
  try {
    const urlParts = url.split('/');
    let fileName = urlParts[urlParts.length - 1];
    // Eliminar parámetros de consulta si existen
    fileName = fileName.split('?')[0];
    return fileName;
  } catch (e) {
    return `image-${Date.now()}.jpg`;
  }
}

/**
 * Sube un buffer a Firebase Storage
 */
async function uploadToFirebase(buffer, destinationPath, contentType) {
  const file = bucket.file(destinationPath);
  await file.save(buffer, {
    metadata: {
      contentType: contentType,
      cacheControl: 'public, max-age=31536000',
    },
    public: true, // Hacerlo público para obtener URL simple (opcional según reglas)
  });
  
  // Obtener URL firmada pública o URL nativa si es público
  // Nota: Para reglas públicas, podemos construir la URL directamente:
  // https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=media
  const encodedPath = encodeURIComponent(destinationPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

async function migrateProducts() {
  console.log('🚀 Iniciando migración de Cloudinary a Firebase Storage...');
  
  try {
    const productsSnapshot = await db.collection('products').get();
    let updatedCount = 0;
    let errorCount = 0;

    console.log(`📦 Encontrados ${productsSnapshot.size} productos. Procesando...`);

    for (const doc of productsSnapshot.docs) {
      const product = doc.data();
      const updates = {};
      let needsUpdate = false;
      const productId = doc.id;

      // 1. Migrar imagen principal
      if (product.image && product.image.includes('cloudinary.com')) {
        try {
          console.log(`🔄 Migrando imagen principal del producto: ${product.name || productId}`);
          const buffer = await downloadImage(product.image);
          const fileName = getFileNameFromUrl(product.image);
          // Usar estructura limpia: products/[id]/[filename]
          const storagePath = `products/${productId}/${fileName}`;
          
          const newUrl = await uploadToFirebase(buffer, storagePath, 'image/jpeg'); // Asumimos jpeg o detectamos extensión
          updates.image = newUrl;
          needsUpdate = true;
          console.log(`   ✅ Principal migrada`);
        } catch (err) {
          console.error(`   ❌ Error migrando imagen principal ${productId}:`, err.message);
          errorCount++;
        }
      }

      // 2. Migrar galería de imágenes
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const newImages = [];
        let galleryChanged = false;

        for (const [index, imgUrl] of product.images.entries()) {
          if (imgUrl && imgUrl.includes('cloudinary.com')) {
            try {
              console.log(`   🔄 Migrando imagen galería ${index + 1}/${product.images.length}`);
              const buffer = await downloadImage(imgUrl);
              const fileName = getFileNameFromUrl(imgUrl);
              const storagePath = `products/${productId}/gallery-${index}-${fileName}`;
              
              const newUrl = await uploadToFirebase(buffer, storagePath, 'image/jpeg');
              newImages.push(newUrl);
              galleryChanged = true;
            } catch (err) {
              console.error(`   ❌ Error migrando imagen galería ${index}:`, err.message);
              newImages.push(imgUrl); // Mantener original si falla
              errorCount++;
            }
          } else {
            newImages.push(imgUrl);
          }
        }

        if (galleryChanged) {
          updates.images = newImages;
          needsUpdate = true;
          console.log(`   ✅ Galería migrada`);
        }
      }

      // Guardar cambios en Firestore
      if (needsUpdate) {
        await db.collection('products').doc(productId).update(updates);
        updatedCount++;
        console.log(`💾 Producto ${productId} actualizado en Firestore.\n`);
      }
    }

    console.log('--------------------------------------------------');
    console.log('🎉 Migración completada.');
    console.log(`✅ Productos actualizados: ${updatedCount}`);
    console.log(`❌ Errores encontrados: ${errorCount}`);

  } catch (error) {
    console.error('🔥 Error fatal durante la migración:', error);
  }
}

migrateProducts();
