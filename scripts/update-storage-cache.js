// scripts/update-storage-cache.js
// Script para actualizar los metadatos de caché de todas las imágenes en Firebase Storage

import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

const bucket = admin.storage().bucket();

// Configuración de caché óptima (1 año)
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

async function updateStorageCacheHeaders() {
  try {
    console.log('🚀 Iniciando actualización de metadatos de caché...\n');
    
    // Obtener todos los archivos del bucket
    const [files] = await bucket.getFiles();
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    console.log(`📦 Total de archivos encontrados: ${files.length}\n`);
    
    for (const file of files) {
      const fileName = file.name;
      const extension = path.extname(fileName).toLowerCase();
      
      // Solo actualizar archivos de imagen
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'];
      
      if (imageExtensions.includes(extension)) {
        try {
          // Obtener metadatos actuales
          const [metadata] = await file.getMetadata();
          
          // Verificar si ya tiene el cache-control correcto
          if (metadata.cacheControl === CACHE_CONTROL) {
            console.log(`⏭️  Ya optimizado: ${fileName}`);
            skippedCount++;
            continue;
          }
          
          // Actualizar metadatos
          await file.setMetadata({
            cacheControl: CACHE_CONTROL,
            contentType: metadata.contentType || `image/${extension.slice(1)}`
          });
          
          console.log(`✅ Actualizado: ${fileName}`);
          updatedCount++;
          
        } catch (error) {
          console.error(`❌ Error en ${fileName}:`, error.message);
          errorCount++;
        }
      } else {
        // Para archivos no-imagen (HTML, JSON, etc.), usar caché más corto
        try {
          await file.setMetadata({
            cacheControl: 'public, max-age=3600, must-revalidate'
          });
          console.log(`📄 Actualizado (1h): ${fileName}`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Error en ${fileName}:`, error.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n🎉 ¡Proceso completado!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Archivos actualizados: ${updatedCount}`);
    console.log(`⏭️  Archivos omitidos (ya optimizados): ${skippedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('💡 Beneficios:');
    console.log('   • Las imágenes se cachearán por 1 año');
    console.log('   • Usuarios recurrentes cargarán la página instantáneamente');
    console.log(`   • Ahorro estimado: ~534 KiB por visita repetida\n`);
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar el script
updateStorageCacheHeaders()
  .then(() => {
    console.log('✨ Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error al ejecutar el script:', error);
    process.exit(1);
  });

