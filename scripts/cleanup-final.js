import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanupFinal() {
  const mile3Dir = path.join(__dirname, '..', 'public', 'mile3');
  
  try {
    console.log('🧹 Limpieza final - eliminando todo y dejando solo las imágenes optimizadas...');
    
    // Leer todos los archivos en la carpeta
    const files = fs.readdirSync(mile3Dir);
    
    let deletedCount = 0;
    let keptCount = 0;
    
    // Lista de nombres finales que queremos mantener
    const finalNames = [
      'almendras120ml.webp',
      'almendras500ml.webp', 
      'arboldete120ml.webp',
      'arboldete20m.webp',
      'argan120ml.webp',
      'castor120ml.webp',
      'castor500ml.webp',
      'coco120ml.webp',
      'coco500ml.webp',
      'dulces500ml.webp',
      'eucalipto120ml.webp',
      'eucalipto20ml.webp',
      'glicerina500ml.webp',
      'jojoba120ml.webp',
      'lavanda120ml.webp',
      'lavanda22ml.webp',
      'macadamia120ml.webp',
      'menta120ml.webp',
      'menta20ml.webp',
      'mineral120ml.webp',
      'mineral500ml.webp',
      'naranja120ml.webp',
      'naranja22ml.webp',
      'oregano20ml.webp',
      'pata120ml.webp',
      'pata500ml.webp',
      'ricino120ml.webp',
      'ricino500ml.webp',
      'romero120ml.webp',
      'romero20ml.webp',
      'semillas120ml.webp',
      'vitamina120ml.webp',
      'vitamina18ml.webp'
    ];
    
    for (const file of files) {
      const filePath = path.join(mile3Dir, file);
      
      // Mantener solo los archivos que están en nuestra lista final
      if (finalNames.includes(file)) {
        console.log(`✅ Mantenido: ${file}`);
        keptCount++;
      } else {
        // Eliminar todos los demás archivos
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Eliminado: ${file}`);
          deletedCount++;
        } catch (error) {
          console.log(`⚠️  No se pudo eliminar: ${file}`);
        }
      }
    }
    
    console.log(`\n🎉 Limpieza final completada:`);
    console.log(`- Archivos eliminados: ${deletedCount}`);
    console.log(`- Archivos mantenidos: ${keptCount}`);
    
    // Mostrar el estado final
    const finalFiles = fs.readdirSync(mile3Dir);
    const webpFiles = finalFiles.filter(file => file.endsWith('.webp'));
    
    console.log(`\n📁 Estado final de la carpeta mile3:`);
    console.log(`- Total de archivos WebP: ${webpFiles.length}`);
    
    // Calcular el tamaño total
    let totalSize = 0;
    for (const file of webpFiles) {
      const stats = fs.statSync(path.join(mile3Dir, file));
      totalSize += stats.size;
    }
    
    console.log(`- Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Solo quedan las imágenes optimizadas con nombres limpios ✨`);
    
  } catch (error) {
    console.error('Error en la limpieza:', error.message);
  }
}

// Ejecutar el script
cleanupFinal();













