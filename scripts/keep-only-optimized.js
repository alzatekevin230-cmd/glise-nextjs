import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function keepOnlyOptimized() {
  const mile3Dir = path.join(__dirname, '..', 'public', 'mile3');
  
  try {
    console.log('🧹 Manteniendo solo las imágenes optimizadas...');
    
    // Leer todos los archivos en la carpeta
    const files = fs.readdirSync(mile3Dir);
    
    let deletedCount = 0;
    let keptCount = 0;
    
    for (const file of files) {
      const filePath = path.join(mile3Dir, file);
      
      // Mantener solo los archivos que empiecen con "optimized_"
      if (file.startsWith('optimized_') && file.endsWith('.webp')) {
        // Renombrar quitando el prefijo "optimized_"
        const newName = file.replace('optimized_', '');
        const newPath = path.join(mile3Dir, newName);
        
        try {
          // Si ya existe un archivo con el nombre final, eliminarlo primero
          if (fs.existsSync(newPath)) {
            fs.unlinkSync(newPath);
          }
          
          fs.renameSync(filePath, newPath);
          console.log(`✅ Mantenido y renombrado: ${file} → ${newName}`);
          keptCount++;
        } catch (error) {
          console.log(`⚠️  No se pudo renombrar: ${file}`);
        }
      } else if (file.endsWith('.webp')) {
        // Eliminar todos los demás archivos .webp
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Eliminado: ${file}`);
          deletedCount++;
        } catch (error) {
          console.log(`⚠️  No se pudo eliminar: ${file}`);
        }
      }
    }
    
    console.log(`\n🎉 Limpieza completada:`);
    console.log(`- Archivos eliminados: ${deletedCount}`);
    console.log(`- Archivos optimizados mantenidos: ${keptCount}`);
    
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
    console.log(`- Solo quedan las imágenes optimizadas ✨`);
    
  } catch (error) {
    console.error('Error en la limpieza:', error.message);
  }
}

// Ejecutar el script
keepOnlyOptimized();










