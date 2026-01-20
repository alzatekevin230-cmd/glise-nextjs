// scripts/restore-original-urls.js
// Script para restaurar las URLs originales de Firebase Storage usando data.js como fuente de verdad

import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// 1. Configuración de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!bucketName) {
  console.error('❌ Error: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET no definido en .env.local');
  process.exit(1);
}

// 2. Inicializar Firebase Admin
// Usamos importación dinámica para evitar problemas de orden de carga
async function initFirebase() {
    // Importar la instancia ya configurada si es posible, o configurarla aquí
    // Para asegurar compatibilidad con el script anterior, la configuramos manualmente si no existe
    if (!admin.apps.length) {
        // Intentar cargar service account si existe, o usar credenciales de entorno
        try {
            const serviceAccount = await import('../ProyectoGlise/public/serviceAccountKey.json', { assert: { type: 'json' } });
             admin.initializeApp({
                credential: admin.credential.cert(serviceAccount.default),
            });
        } catch (e) {
            // Fallback a variables de entorno si serviceAccountKey no está disponible/válido
             if (process.env.FIREBASE_PRIVATE_KEY) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n'),
                    }),
                });
             } else {
                 // Si no hay credenciales, intentar usar la configuración por defecto (si se ejecuta en Google Cloud)
                 // O importar el módulo que ya lo hace
                 const { db: dbModule } = await import('../lib/firebaseAdmin.js');
                 return dbModule;
             }
        }
    }
    return admin.firestore();
}

// 3. Cargar datos originales
async function loadOriginalData() {
    const dataPath = path.resolve(__dirname, '../ProyectoGlise/public/data.js');
    const dataUrl = pathToFileURL(dataPath).href;
    try {
        const module = await import(dataUrl);
        return module.products;
    } catch (error) {
        console.error('❌ Error cargando data.js:', error);
        process.exit(1);
    }
}

// 4. Construir URL de Firebase Storage
function getFirebaseStorageURL(relativePath) {
    if (!relativePath) return null;
    
    // CORRECCIÓN: Agregar el prefijo 'products/' que existe en el bucket
    // Verificamos si ya lo tiene para no duplicarlo (por si acaso)
    const fullPath = relativePath.startsWith('products/') ? relativePath : `products/${relativePath}`;
    
    // Codificar la ruta (las barras / se convierten en %2F)
    const encodedPath = encodeURIComponent(fullPath);
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

async function restoreUrls() {
    console.log('🚀 Iniciando restauración de URLs originales...');
    console.log(`📦 Bucket: ${bucketName}`);

    const db = await initFirebase();
    const originalProducts = await loadOriginalData();
    
    // Crear mapa para búsqueda rápida por ID
    // Convertimos IDs a string para asegurar coincidencia con Firestore
    const productsMap = new Map(originalProducts.map(p => [String(p.id), p]));
    const productsByNameMap = new Map(originalProducts.map(p => [p.name.trim().toLowerCase(), p]));

    console.log(`📚 Cargados ${originalProducts.length} productos originales de data.js`);

    // Obtener productos de Firestore
    const snapshot = await db.collection('products').get();
    console.log(`🔥 Encontrados ${snapshot.size} productos en Firestore. Procesando...`);

    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;

    for (const doc of snapshot.docs) {
        const firestoreProduct = doc.data();
        const docId = doc.id;
        
        // Intentar encontrar el producto original por ID
        // Asumimos que el ID del documento en Firestore es el mismo ID numérico o tenemos un campo 'id'
        let original = productsMap.get(docId);
        
        // Si no coincide por ID del documento, buscar por campo 'id' dentro del documento
        if (!original && firestoreProduct.id) {
            original = productsMap.get(String(firestoreProduct.id));
        }

        // Si aún no coincide, intentar por nombre
        if (!original && firestoreProduct.name) {
             original = productsByNameMap.get(firestoreProduct.name.trim().toLowerCase());
        }

        if (!original) {
            console.warn(`⚠️ No se encontró referencia original para: ${firestoreProduct.name} (ID: ${docId})`);
            notFoundCount++;
            continue;
        }

        const updates = {};
        let needsUpdate = false;

        // A. Restaurar imagen principal
        if (original.image) {
            const originalUrl = getFirebaseStorageURL(original.image);
            // Actualizar si la actual es de cloudinary o es diferente
            if (firestoreProduct.image !== originalUrl) {
                updates.image = originalUrl;
                needsUpdate = true;
                // console.log(`   Imagen principal: ${original.image}`);
            }
        }

        // B. Restaurar galería
        if (original.images && Array.isArray(original.images)) {
            const originalUrls = original.images.map(path => getFirebaseStorageURL(path));
            
            // Comparación simple de arrays (JSON.stringify) para ver si cambió
            if (JSON.stringify(firestoreProduct.images) !== JSON.stringify(originalUrls)) {
                updates.images = originalUrls;
                needsUpdate = true;
                // console.log(`   Galería: ${original.images.length} imágenes`);
            }
        }

        if (needsUpdate) {
            await db.collection('products').doc(docId).update(updates);
            updatedCount++;
            console.log(`✅ Restaurado: ${original.name}`);
        } else {
            skippedCount++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Restauración finalizada');
    console.log(`✅ Actualizados: ${updatedCount}`);
    console.log(`⏭️ Sin cambios: ${skippedCount}`);
    console.log(`⚠️ No encontrados en data.js: ${notFoundCount}`);
}

restoreUrls().catch(console.error);
