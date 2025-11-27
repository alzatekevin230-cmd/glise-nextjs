// Script para reemplazar las imágenes originales con las optimizadas
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public', 'imagenespagina');

async function applyOptimized() {
  console.log('🔄 APLICANDO IMÁGENES OPTIMIZADAS\n');
  console.log('📁 Carpeta:', publicDir);
  console.log('━'.repeat(70));
  
  try {
    const files = await fs.readdir(publicDir);
    const optimizedFiles = files.filter(f => f.endsWith('-optimized.webp'));
    
    let appliedCount = 0;
    
    for (const optimizedFile of optimizedFiles) {
      const originalFile = optimizedFile.replace('-optimized.webp', '.webp');
      const optimizedPath = path.join(publicDir, optimizedFile);
      const originalPath = path.join(publicDir, originalFile);
      const backupPath = path.join(publicDir, `${originalFile}.original`);
      
      try {
        // Verificar que el archivo optimizado existe
        await fs.access(optimizedPath);
        
        // Crear backup del original si no existe
        try {
          await fs.access(backupPath);
          console.log(`⏭️  Backup ya existe para ${originalFile}`);
        } catch {
          await fs.copyFile(originalPath, backupPath);
          console.log(`💾 Backup creado: ${originalFile}.original`);
        }
        
        // Reemplazar el original con el optimizado
        await fs.copyFile(optimizedPath, originalPath);
        console.log(`✅ ${originalFile} reemplazado con versión optimizada`);
        
        // Eliminar el archivo optimizado temporal
        await fs.unlink(optimizedPath);
        
        appliedCount++;
      } catch (error) {
        console.error(`❌ Error aplicando ${optimizedFile}:`, error.message);
      }
    }
    
    console.log('\n' + '━'.repeat(70));
    console.log(`\n✅ Proceso completado!`);
    console.log(`📊 Archivos aplicados: ${appliedCount}/${optimizedFiles.length}`);
    console.log(`\n💡 Los archivos originales se guardaron como .original`);
    console.log(`💡 Para restaurar: rename <archivo>.webp.original <archivo>.webp`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

applyOptimized().catch(console.error);












