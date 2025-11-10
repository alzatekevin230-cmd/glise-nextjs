import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeWebpImages() {
  const dermoDir = path.join(__dirname, '..', 'public', 'dermo');
  
  try {
    // Leer todos los archivos WebP en la carpeta dermo
    const files = fs.readdirSync(dermoDir);
    const webpFiles = files.filter(file => file.toLowerCase().endsWith('.webp'));
    
    console.log(`Encontradas ${webpFiles.length} imágenes WebP para optimizar...`);
    
    let optimizedCount = 0;
    let errorCount = 0;
    let totalSizeBefore = 0;
    let totalSizeAfter = 0;
    
    for (const webpFile of webpFiles) {
      try {
        const inputPath = path.join(dermoDir, webpFile);
        const tempPath = path.join(dermoDir, `temp_${webpFile}`);
        
        // Obtener información del archivo original
        const originalStats = fs.statSync(inputPath);
        totalSizeBefore += originalStats.size;
        
        // Obtener metadatos de la imagen
        const metadata = await sharp(inputPath).metadata();
        console.log(`\n📸 Procesando: ${webpFile}`);
        console.log(`   Tamaño original: ${metadata.width}x${metadata.height}px`);
        console.log(`   Peso original: ${(originalStats.size / 1024).toFixed(2)} KB`);
        
        // Determinar el nuevo tamaño (máximo 1200px de ancho, manteniendo proporción)
        let newWidth = metadata.width;
        let newHeight = metadata.height;
        
        if (metadata.width > 1200) {
          newWidth = 1200;
          newHeight = Math.round((metadata.height * 1200) / metadata.width);
        }
        
        // Optimizar la imagen
        await sharp(inputPath)
          .resize(newWidth, newHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ 
            quality: 75,  // Reducir calidad para menor tamaño
            effort: 6,    // Máximo esfuerzo de compresión
            lossless: false
          })
          .toFile(tempPath);
        
        // Reemplazar el archivo original
        fs.renameSync(tempPath, inputPath);
        
        // Obtener el nuevo tamaño
        const newStats = fs.statSync(inputPath);
        totalSizeAfter += newStats.size;
        
        const sizeReduction = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(1);
        
        console.log(`   ✓ Optimizado: ${newWidth}x${newHeight}px`);
        console.log(`   ✓ Nuevo peso: ${(newStats.size / 1024).toFixed(2)} KB`);
        console.log(`   ✓ Reducción: ${sizeReduction}%`);
        
        optimizedCount++;
        
      } catch (error) {
        console.error(`✗ Error optimizando ${webpFile}:`, error.message);
        errorCount++;
      }
    }
    
    const totalReduction = ((totalSizeBefore - totalSizeAfter) / totalSizeBefore * 100).toFixed(1);
    
    console.log(`\n🎉 Optimización completada:`);
    console.log(`- Imágenes optimizadas: ${optimizedCount}`);
    console.log(`- Errores: ${errorCount}`);
    console.log(`- Peso total antes: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Peso total después: ${(totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Reducción total: ${totalReduction}%`);
    console.log(`- Espacio ahorrado: ${((totalSizeBefore - totalSizeAfter) / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Ejecutar el script
optimizeWebpImages();

