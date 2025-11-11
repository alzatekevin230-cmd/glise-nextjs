import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanupMile3() {
  const mile3Dir = path.join(__dirname, '..', 'public', 'mile3');
  
  try {
    console.log('🧹 Limpiando archivos temporales y duplicados...');
    
    // Leer todos los archivos en la carpeta
    const files = fs.readdirSync(mile3Dir);
    
    let deletedCount = 0;
    let renamedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(mile3Dir, file);
      
      // Eliminar archivos temporales
      if (file.startsWith('temp_')) {
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Eliminado archivo temporal: ${file}`);
          deletedCount++;
        } catch (error) {
          console.log(`⚠️  No se pudo eliminar: ${file}`);
        }
      }
      
      // Eliminar archivos con _XX_XXzon en el nombre (archivos originales con sufijos)
      const namePattern = /_\d+_\d+zon\.webp$/;
      if (namePattern.test(file)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Eliminado archivo con sufijo: ${file}`);
          deletedCount++;
        } catch (error) {
          console.log(`⚠️  No se pudo eliminar: ${file}`);
        }
      }
      
      // Renombrar archivos optimized_ a su nombre final
      if (file.startsWith('optimized_')) {
        const newName = file.replace('optimized_', '');
        const newPath = path.join(mile3Dir, newName);
        
        try {
          // Si ya existe un archivo con el nombre final, eliminarlo primero
          if (fs.existsSync(newPath)) {
            fs.unlinkSync(newPath);
          }
          
          fs.renameSync(filePath, newPath);
          console.log(`📝 Renombrado: ${file} → ${newName}`);
          renamedCount++;
        } catch (error) {
          console.log(`⚠️  No se pudo renombrar: ${file}`);
        }
      }
    }
    
    console.log(`\n🎉 Limpieza completada:`);
    console.log(`- Archivos eliminados: ${deletedCount}`);
    console.log(`- Archivos renombrados: ${renamedCount}`);
    
    // Mostrar el estado final
    const finalFiles = fs.readdirSync(mile3Dir);
    const webpFiles = finalFiles.filter(file => file.endsWith('.webp'));
    
    console.log(`\n📁 Estado final de la carpeta mile3:`);
    console.log(`- Total de archivos WebP: ${webpFiles.length}`);
    console.log(`- Archivos optimizados y listos para usar`);
    
    // Calcular el tamaño total
    let totalSize = 0;
    for (const file of webpFiles) {
      const stats = fs.statSync(path.join(mile3Dir, file));
      totalSize += stats.size;
    }
    
    console.log(`- Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('Error en la limpieza:', error.message);
  }
}

// Ejecutar el script
cleanupMile3();










