import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeMile3Final() {
  const sourceDir = path.join(__dirname, '..', 'public', 'mile3_optimized');
  const targetDir = path.join(__dirname, '..', 'public', 'mile3');
  
  try {
    console.log('🖼️  Optimizando imágenes de mile3_optimized y reemplazando en mile3...');
    
    // Leer todos los archivos WebP en la carpeta mile3_optimized
    const files = fs.readdirSync(sourceDir);
    const webpFiles = files.filter(file => file.toLowerCase().endsWith('.webp'));
    
    console.log(`Encontradas ${webpFiles.length} imágenes para optimizar...`);
    
    let processedCount = 0;
    let totalSizeBefore = 0;
    let totalSizeAfter = 0;
    
    for (const webpFile of webpFiles) {
      try {
        const inputPath = path.join(sourceDir, webpFile);
        const outputPath = path.join(targetDir, webpFile);
        
        // Obtener información del archivo original
        const originalStats = fs.statSync(inputPath);
        totalSizeBefore += originalStats.size;
        
        // Obtener metadatos de la imagen
        const metadata = await sharp(inputPath).metadata();
        console.log(`\n📸 Procesando: ${webpFile}`);
        console.log(`   Tamaño original: ${metadata.width}x${metadata.height}px`);
        console.log(`   Peso original: ${(originalStats.size / 1024).toFixed(2)} KB`);
        
        // Reducir el tamaño de la imagen y optimizar con mayor compresión
        let newWidth = metadata.width;
        let newHeight = metadata.height;
        
        // Para la página de detalle, necesitamos imágenes de alta resolución
        if (metadata.width > 1200) {
          newWidth = 1200;
          newHeight = Math.round((metadata.height * 1200) / metadata.width);
        }
        
        // Optimizar la imagen con alta calidad para detalle
        await sharp(inputPath)
          .resize(newWidth, newHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ 
            quality: 85,  // Alta calidad para detalle
            effort: 6,    // Máximo esfuerzo de compresión
            lossless: false
          })
          .toFile(outputPath);
        
        // Obtener el nuevo tamaño
        const newStats = fs.statSync(outputPath);
        totalSizeAfter += newStats.size;
        
        const sizeReduction = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(1);
        
        console.log(`   ✓ Optimizado: ${metadata.width}x${metadata.height}px`);
        console.log(`   ✓ Nuevo peso: ${(newStats.size / 1024).toFixed(2)} KB`);
        console.log(`   ✓ Reducción: ${sizeReduction}%`);
        
        processedCount++;
        
      } catch (error) {
        console.error(`✗ Error procesando ${webpFile}:`, error.message);
      }
    }
    
    const totalReduction = ((totalSizeBefore - totalSizeAfter) / totalSizeBefore * 100).toFixed(1);
    
    console.log(`\n🎉 Optimización completada:`);
    console.log(`- Imágenes procesadas: ${processedCount}`);
    console.log(`- Peso total antes: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Peso total después: ${(totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Reducción total: ${totalReduction}%`);
    console.log(`- Espacio ahorrado: ${((totalSizeBefore - totalSizeAfter) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n📁 Las imágenes optimizadas están ahora en: ${targetDir}`);
    console.log(`💡 Las imágenes originales de mile3_optimized se mantienen intactas`);
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Ejecutar el script
optimizeMile3Final();
