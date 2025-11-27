import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createHDImages() {
  const sourceDir = path.join(__dirname, '..', 'public', 'mile3');
  const targetDir = path.join(__dirname, '..', 'public', 'mile3_hd');
  
  // Crear directorio HD si no existe
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  try {
    console.log('🖼️  Creando versiones HD de las imágenes...');
    
    // Leer todos los archivos WebP en la carpeta mile3
    const files = fs.readdirSync(sourceDir);
    const webpFiles = files.filter(file => file.toLowerCase().endsWith('.webp'));
    
    console.log(`Encontradas ${webpFiles.length} imágenes para convertir a HD...`);
    
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
        
        // Crear versión HD (1200x1200px)
        await sharp(inputPath)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: false, // Permitir ampliar si es necesario
            background: { r: 255, g: 255, b: 255, alpha: 0 } // Fondo transparente
          })
          .webp({ 
            quality: 85,  // Mayor calidad para HD
            effort: 6,    // Máximo esfuerzo de compresión
            lossless: false
          })
          .toFile(outputPath);
        
        // Obtener el nuevo tamaño
        const newStats = fs.statSync(outputPath);
        totalSizeAfter += newStats.size;
        
        const sizeIncrease = ((newStats.size - originalStats.size) / originalStats.size * 100).toFixed(1);
        
        console.log(`   ✓ HD creado: 1200x1200px`);
        console.log(`   ✓ Nuevo peso: ${(newStats.size / 1024).toFixed(2)} KB`);
        console.log(`   ✓ Aumento: ${sizeIncrease}%`);
        
        processedCount++;
        
      } catch (error) {
        console.error(`✗ Error procesando ${webpFile}:`, error.message);
      }
    }
    
    const totalIncrease = ((totalSizeAfter - totalSizeBefore) / totalSizeBefore * 100).toFixed(1);
    
    console.log(`\n🎉 Proceso HD completado:`);
    console.log(`- Imágenes procesadas: ${processedCount}`);
    console.log(`- Peso total antes: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Peso total después: ${(totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Aumento total: ${totalIncrease}%`);
    console.log(`- Espacio adicional: ${((totalSizeAfter - totalSizeBefore) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n📁 Las imágenes HD están en: ${targetDir}`);
    console.log(`💡 Ahora puedes usar estas imágenes HD para escritorio`);
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Ejecutar el script
createHDImages();
















