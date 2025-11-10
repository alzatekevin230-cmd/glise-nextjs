// Script para redimensionar banners de escritorio
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public', 'imagenespagina');

// Dimensiones óptimas para banners de escritorio
// 1920px de ancho cubre el 95% de monitores
// Altura proporcional al aspect ratio 1440:380 (aprox 3.79:1)
const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 506; // 1920 / 3.79

const desktopBanners = [
  ['baner1.webp', 'Banner escritorio 1'],
  ['baner2.webp', 'Banner escritorio 2'],
  ['baner3.webp', 'Banner escritorio 3'],
  ['baner4.webp', 'Banner escritorio 4'],
  ['baner5.webp', 'Banner escritorio 5'],
];

async function resizeBanner(filename, description) {
  const inputPath = path.join(publicDir, filename);
  const outputFilename = filename.replace('.webp', '-optimized.webp');
  const outputPath = path.join(publicDir, outputFilename);
  
  try {
    await fs.access(inputPath);
    
    // Verificar si ya existe
    try {
      await fs.access(outputPath);
      console.log(`⏭️  Ya existe ${outputFilename}`);
      return { success: false, error: 'exists' };
    } catch {
      // Continuar
    }
    
    const metadata = await sharp(inputPath).metadata();
    const originalSize = (await fs.stat(inputPath)).size;
    
    console.log(`\n📸 ${description} (${filename})`);
    console.log(`   Original: ${metadata.width}x${metadata.height} (${(originalSize / 1024).toFixed(1)} KB)`);
    
    // Redimensionar
    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);
    
    const newSize = (await fs.stat(outputPath)).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`   Nuevo: ${TARGET_WIDTH}x${TARGET_HEIGHT} (${(newSize / 1024).toFixed(1)} KB)`);
    console.log(`   💾 Guardado como: ${outputFilename}`);
    console.log(`   ✅ Ahorro: ${savings}%`);
    
    return { success: true, savings: originalSize - newSize };
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⚠️  ${filename} no encontrado`);
      return { success: false, error: 'not_found' };
    }
    console.error(`❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🖥️  OPTIMIZANDO BANNERS DE ESCRITORIO\n');
  console.log(`📐 Dimensiones objetivo: ${TARGET_WIDTH}x${TARGET_HEIGHT}px`);
  console.log(`📁 Carpeta: ${publicDir}`);
  console.log('━'.repeat(70));
  
  let totalSavings = 0;
  let successCount = 0;
  
  for (const [filename, description] of desktopBanners) {
    const result = await resizeBanner(filename, description);
    if (result.success) {
      totalSavings += result.savings;
      successCount++;
    }
  }
  
  console.log('\n' + '━'.repeat(70));
  console.log(`\n✅ Proceso completado!`);
  console.log(`📊 Banners procesados: ${successCount}/${desktopBanners.length}`);
  console.log(`💾 Ahorro total: ${(totalSavings / 1024).toFixed(1)} KB (${(totalSavings / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`\n💡 Para aplicar: node scripts/apply-desktop-optimized.js`);
}

main().catch(console.error);




