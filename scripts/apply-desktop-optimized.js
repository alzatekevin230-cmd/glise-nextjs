// Script para aplicar banners de escritorio optimizados
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public', 'imagenespagina');

const desktopBanners = [
  'baner1.webp',
  'baner2.webp',
  'baner3.webp',
  'baner4.webp',
  'baner5.webp'
];

async function applyOptimized() {
  console.log('🔄 APLICANDO BANNERS DE ESCRITORIO OPTIMIZADOS\n');
  console.log('📁 Carpeta:', publicDir);
  console.log('━'.repeat(70));
  
  let appliedCount = 0;
  
  for (const banner of desktopBanners) {
    const optimizedFile = banner.replace('.webp', '-optimized.webp');
    const originalPath = path.join(publicDir, banner);
    const optimizedPath = path.join(publicDir, optimizedFile);
    const backupPath = path.join(publicDir, `${banner}.original`);
    
    try {
      // Verificar que existe el optimizado
      await fs.access(optimizedPath);
      
      // Crear backup si no existe
      try {
        await fs.access(backupPath);
        console.log(`⏭️  Backup ya existe para ${banner}`);
      } catch {
        await fs.copyFile(originalPath, backupPath);
        console.log(`💾 Backup creado: ${banner}.original`);
      }
      
      // Reemplazar
      await fs.copyFile(optimizedPath, originalPath);
      console.log(`✅ ${banner} reemplazado con versión optimizada`);
      
      // Eliminar temporal
      await fs.unlink(optimizedPath);
      
      appliedCount++;
    } catch (error) {
      console.error(`❌ Error con ${banner}:`, error.message);
    }
  }
  
  console.log('\n' + '━'.repeat(70));
  console.log(`\n✅ Proceso completado!`);
  console.log(`📊 Archivos aplicados: ${appliedCount}/${desktopBanners.length}`);
  console.log(`\n💡 Los archivos originales se guardaron como .original`);
}

applyOptimized().catch(console.error);












