// scripts/migrate-products-to-cloudinary.js
// Script para migrar productos de Firebase Storage a Cloudinary
// Replica la funcionalidad de ProyectoGlise/public/subir.js

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs/promises';
import { config } from 'dotenv';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno PRIMERO
const envPath = resolve(__dirname, '../.env.local');
config({ path: envPath });

// Verificar que las variables estén cargadas
console.log('\n🔍 Verificando variables de entorno...');
console.log(`  Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌'}`);
console.log(`  API Key: ${process.env.CLOUDINARY_API_KEY ? '✅' : '❌'}`);
console.log(`  API Secret: ${process.env.CLOUDINARY_API_SECRET ? '✅' : '❌'}\n`);

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Faltan variables de entorno de Cloudinary!');
  console.error('💡 Asegúrate de tener .env.local con:');
  console.error('   CLOUDINARY_CLOUD_NAME=...');
  console.error('   CLOUDINARY_API_KEY=...');
  console.error('   CLOUDINARY_API_SECRET=...');
  process.exit(1);
}

// Importar Cloudinary DESPUÉS de cargar variables
import { uploadImage, uploadProductImage } from '../lib/cloudinary.js';

// Configurar require para ESM
const require = createRequire(import.meta.url);

// Ruta a los archivos originales del proyecto
const PROJECT_GLISE_PATH = path.join(__dirname, '../ProyectoGlise/public');

// Cargar datos de productos (similar a subir.js)
let products;
try {
  // Importar productos desde el archivo original
  // Convertir ruta a URL válida para ESM
  const dataPath = path.join(PROJECT_GLISE_PATH, 'data.js');
  const dataUrl = pathToFileURL(dataPath).href;
  const dataModule = await import(dataUrl);
  products = dataModule.products;
  console.log(`✅ Cargados ${products.length} productos desde data.js`);
} catch (error) {
  console.error('❌ Error al cargar productos:', error);
  process.exit(1);
}

// Inicializar Firebase Admin (solo para leer Firestore)
let db;
try {
  // Intentar cargar service account
  const serviceAccountPath = path.join(PROJECT_GLISE_PATH, 'serviceAccountKey.json');
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  db = getFirestore();
  console.log('✅ Conectado a Firebase Admin');
} catch (error) {
  console.warn('⚠️ No se pudo conectar a Firebase Admin:', error.message);
  console.log('ℹ️ Solo se subirán imágenes a Cloudinary, no se actualizará Firestore');
}

// Función para crear slug (igual que en subir.js)
function createSlug(text) {
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

/**
 * Sube una imagen local a Cloudinary
 * @param {string} imagePath - Ruta local de la imagen (ej: 'nat/bel1.webp')
 * @param {string} category - Categoría del producto
 * @param {string} productName - Nombre del producto
 * @returns {Promise<string>} URL de Cloudinary
 */
async function uploadLocalImageToCloudinary(imagePath, category, productName) {
  try {
    // Construir ruta completa del archivo local
    const fullPath = path.join(PROJECT_GLISE_PATH, imagePath);
    
    // Verificar que el archivo existe
    try {
      await fs.access(fullPath);
    } catch (error) {
      console.error(`❌ Imagen no encontrada: ${imagePath}`);
      return null;
    }

    // Subir a Cloudinary (opciones simplificadas - sin tags para evitar errores de firma)
    const url = await uploadProductImage(fullPath, category, productName, {
      overwrite: false, // No sobrescribir si ya existe
      // NO incluir tags ni context (causan problemas de firma)
    });

    console.log(`  ✅ Subida: ${imagePath} → ${url}`);
    return url;
  } catch (error) {
    console.error(`❌ Error al subir ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Procesa un producto: sube imágenes y actualiza datos
 */
async function processProduct(producto) {
  try {
    const data = { ...producto };

    // 1. Generar slug
    data.slug = createSlug(producto.name);

    // 2. Procesar imagen principal
    if (producto.image) {
      const url = await uploadLocalImageToCloudinary(
        producto.image,
        producto.category,
        producto.name
      );
      
      if (url) {
        data.image = url;
      } else {
        console.warn(`  ⚠️ No se pudo subir imagen principal: ${producto.image}`);
        // Mantener la ruta original si falla
      }
    }

    // 3. Procesar array de imágenes
    if (producto.images && Array.isArray(producto.images)) {
      const imagePromises = producto.images.map(img =>
        uploadLocalImageToCloudinary(img, producto.category, producto.name)
      );
      
      const urls = await Promise.all(imagePromises);
      const validUrls = urls.filter(url => url !== null);
      
      if (validUrls.length > 0) {
        data.images = validUrls;
      } else {
        console.warn(`  ⚠️ No se pudieron subir imágenes del array para: ${producto.name}`);
        delete data.images;
      }
    }

    // 4. Actualizar en Firestore si está conectado
    if (db) {
      const id = producto.id?.toString();
      if (id) {
        // Actualizar solo campos de imagen (no sobrescribir todo)
        const updateData = {
          slug: data.slug,
          ...(data.image && { image: data.image }),
          ...(data.images && { images: data.images }),
        };

        await db.collection('products').doc(id).update(updateData);
        console.log(`✅ Actualizado en Firestore: ${producto.name} (ID: ${id})`);
      }
    }

    return data;
  } catch (error) {
    console.error(`❌ Error procesando ${producto.name}:`, error.message);
    return null;
  }
}

/**
 * Función principal: procesa todos los productos
 */
async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos a Cloudinary...\n');
  console.log(`📦 Total de productos: ${products.length}\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Procesar productos uno por uno (para no saturar Cloudinary)
  for (let i = 0; i < products.length; i++) {
    const producto = products[i];
    console.log(`\n[${i + 1}/${products.length}] Procesando: ${producto.name}`);

    try {
      const result = await processProduct(producto);
      if (result) {
        successCount++;
      } else {
        errorCount++;
        errors.push({ product: producto.name, reason: 'Error en procesamiento' });
      }
    } catch (error) {
      errorCount++;
      errors.push({ product: producto.name, reason: error.message });
      console.error(`❌ Error fatal:`, error.message);
    }

    // Pequeño delay para no saturar Cloudinary
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms entre productos
    }
  }

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Productos procesados exitosamente: ${successCount}`);
  console.log(`❌ Productos con errores: ${errorCount}`);
  console.log(`📦 Total: ${products.length}`);

  if (errors.length > 0) {
    console.log('\n⚠️ Errores encontrados:');
    errors.forEach(({ product, reason }) => {
      console.log(`  - ${product}: ${reason}`);
    });
  }

  console.log('\n🎉 Migración completada!');
  
  // Cerrar conexión de Firebase
  if (db) {
    await admin.app().delete();
  }
}

// Ejecutar migración
migrateProducts()
  .then(() => {
    console.log('\n✅ Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal en el script:', error);
    process.exit(1);
  });
