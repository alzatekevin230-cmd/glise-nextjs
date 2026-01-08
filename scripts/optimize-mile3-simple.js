import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeMile3Images() {
  const mile3Dir = path.join(__dirname, '..', 'public', 'mile3');
  const outputDir = path.join(__dirname, '..', 'public', 'mile3_optimized');
  
  // Crear directorio de salida si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Leer todos los archivos WebP en la carpeta mile3
    const files = fs.readdirSync(mile3Dir);
    const webpFiles = files.filter(file => file.toLowerCase().endsWith('.webp'));
    
    console.log(`Encontradas ${webpFiles.length} imágenes WebP en mile3 para optimizar...`);
    console.log(`Las imágenes optimizadas se guardarán en: ${outputDir}`);
    
    let optimizedCount = 0;
    let renamedCount = 0;
    let errorCount = 0;
    let totalSizeBefore = 0;
    let totalSizeAfter = 0;
    
    for (const webpFile of webpFiles) {
      try {
        const inputPath = path.join(mile3Dir, webpFile);
        
        // Obtener información del archivo original
        const originalStats = fs.statSync(inputPath);
        totalSizeBefore += originalStats.size;
        
        // Limpiar el nombre del archivo (quitar _12_11zon, _13_11zon, etc.)
        let cleanName = webpFile;
        const namePattern = /_\d+_\d+zon/;
        if (namePattern.test(cleanName)) {
          cleanName = cleanName.replace(namePattern, '');
          console.log(`📝 Renombrando: ${webpFile} → ${cleanName}`);
          renamedCount++;
        }
        
        const outputPath = path.join(outputDir, cleanName);
        
        // Obtener metadatos de la imagen
        const metadata = await sharp(inputPath).metadata();
        console.log(`\n📸 Procesando: ${cleanName}`);
        console.log(`   Tamaño original: ${metadata.width}x${metadata.height}px`);
        console.log(`   Peso original: ${(originalStats.size / 1024).toFixed(2)} KB`);
        
        // Determinar el nuevo tamaño (máximo 800px de ancho, manteniendo proporción)
        let newWidth = metadata.width;
        let newHeight = metadata.height;
        
        if (metadata.width > 800) {
          newWidth = 800;
          newHeight = Math.round((metadata.height * 800) / metadata.width);
        }
        
        // Optimizar la imagen
        await sharp(inputPath)
          .resize(newWidth, newHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ 
            quality: 70,  // Calidad optimizada para web
            effort: 6,    // Máximo esfuerzo de compresión
            lossless: false
          })
          .toFile(outputPath);
        
        // Obtener el nuevo tamaño
        const newStats = fs.statSync(outputPath);
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
    console.log(`- Archivos renombrados: ${renamedCount}`);
    console.log(`- Errores: ${errorCount}`);
    console.log(`- Peso total antes: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Peso total después: ${(totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Reducción total: ${totalReduction}%`);
    console.log(`- Espacio ahorrado: ${((totalSizeBefore - totalSizeAfter) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n📁 Las imágenes optimizadas están en: ${outputDir}`);
    console.log(`💡 Puedes reemplazar las originales con las optimizadas cuando estés listo.`);
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Ejecutar el script
optimizeMile3Images();

















