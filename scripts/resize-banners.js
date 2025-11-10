// Script para redimensionar banners a las dimensiones correctas
// Esto reduce el tamaño de descarga sin usar el optimizador de Vercel

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public', 'imagenespagina');

// Configuración de dimensiones según PageSpeed Insights
// Formato: [archivo, ancho_deseado, alto_deseado, descripción]
const imagesToResize = [
  // Banners móviles principales (693x520)
  ['banermovil1.webp', 693, 520, 'Banner móvil 1'],
  ['banermovil2.webp', 693, 520, 'Banner móvil 2'],
  ['banermovil3.webp', 693, 520, 'Banner móvil 3'],
  ['banermovil4 .webp', 693, 520, 'Banner móvil 4'],
  ['banermovil5.webp', 693, 520, 'Banner móvil 5'],
  
  // Banners anchos (693x385)
  ['banereucerin.webp', 693, 385, 'Banner Eucerin'],
  ['banerdenivea.webp', 693, 385, 'Banner Nivea'],
  
  // Tarjetas de ofertas principales (693x693 y 693x520)
  ['ofertainicio1.webp', 693, 520, 'Oferta inicio 1'],
  ['ofertainicio2.webp', 693, 693, 'Oferta inicio 2'],
  
  // Banners medianos (693x404)
  ['pdestacadosmovil.webp', 693, 404, 'Productos destacados móvil'],
  ['ofertacreatiana.webp', 693, 404, 'Oferta creatina'],
  
  // Tarjetas verticales pequeñas (333x665)
  ['tarjetatopic.webp', 333, 665, 'Tarjeta Topic'],
  ['ofertalavanda.webp', 333, 665, 'Oferta Lavanda'],
  
  // Tarjetas de ofertas pequeñas (333x499)
  ['tarjetaofertas.webp', 333, 499, 'Tarjeta ofertas 1'],
  ['tarjetaofertas2.webp', 333, 499, 'Tarjeta ofertas 2'],
  
  // Iconos de categorías (196x196)
  ['catetodos.webp', 196, 196, 'Categoría Todos'],
  ['catenatural.webp', 196, 196, 'Categoría Natural'],
  ['catebelleza.webp', 196, 196, 'Categoría Belleza'],
  ['catemilenario.webp', 196, 196, 'Categoría Milenario'],
  
  // Logos (dimensiones proporcionales)
  ['logodeglise.webp', 292, 140, 'Logo Glisé'],
  ['logoinstagram.webp', 70, 70, 'Logo Instagram'],
];

async function resizeImage(filename, width, height, description) {
  const inputPath = path.join(publicDir, filename);
  const outputFilename = filename.replace('.webp', '-optimized.webp');
  const outputPath = path.join(publicDir, outputFilename);
  
  try {
    // Verificar si el archivo existe
    await fs.access(inputPath);
    
    // Verificar si ya existe el archivo optimizado
    try {
      await fs.access(outputPath);
      console.log(`⏭️  Ya existe ${outputFilename}, omitiendo...`);
      return { success: false, error: 'already_exists' };
    } catch {
      // No existe, continuar
    }
    
    // Obtener info de la imagen original
    const metadata = await sharp(inputPath).metadata();
    const originalSize = (await fs.stat(inputPath)).size;
    
    console.log(`\n📸 ${description} (${filename})`);
    console.log(`   Original: ${metadata.width}x${metadata.height} (${(originalSize / 1024).toFixed(1)} KB)`);
    
    // Redimensionar y optimizar
    await sharp(inputPath)
      .resize(width, height, {
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
    
    console.log(`   Nuevo: ${width}x${height} (${(newSize / 1024).toFixed(1)} KB)`);
    console.log(`   💾 Guardado como: ${outputFilename}`);
    console.log(`   ✅ Ahorro: ${savings}%`);
    
    return { success: true, savings: originalSize - newSize, outputFilename };
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⚠️  ${filename} no encontrado, omitiendo...`);
      return { success: false, error: 'not_found' };
    }
    console.error(`❌ Error procesando ${filename}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🎨 REDIMENSIONANDO BANNERS PARA OPTIMIZACIÓN DE RENDIMIENTO\n');
  console.log('📁 Carpeta:', publicDir);
  console.log('━'.repeat(70));
  
  let totalSavings = 0;
  let successCount = 0;
  
  for (const [filename, width, height, description] of imagesToResize) {
    const result = await resizeImage(filename, width, height, description);
    if (result.success) {
      totalSavings += result.savings;
      successCount++;
    }
  }
  
  console.log('\n' + '━'.repeat(70));
  console.log(`\n✅ Proceso completado!`);
  console.log(`📊 Imágenes procesadas: ${successCount}/${imagesToResize.length}`);
  console.log(`💾 Ahorro total: ${(totalSavings / 1024).toFixed(1)} KB (${(totalSavings / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`\n💡 Los archivos optimizados tienen el sufijo "-optimized.webp"`);
  console.log(`💡 Reemplaza manualmente los archivos originales con los optimizados`);
  console.log(`💡 O ejecuta: node scripts/apply-optimized.js`);
}

main().catch(console.error);

