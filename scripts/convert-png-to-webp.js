import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertPngToWebp() {
  const dermoDir = path.join(__dirname, '..', 'public', 'dermo');
  
  try {
    // Leer todos los archivos PNG en la carpeta dermo
    const files = fs.readdirSync(dermoDir);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
    
    console.log(`Encontradas ${pngFiles.length} imágenes PNG para convertir...`);
    
    let convertedCount = 0;
    let errorCount = 0;
    
    for (const pngFile of pngFiles) {
      try {
        const inputPath = path.join(dermoDir, pngFile);
        const outputPath = path.join(dermoDir, pngFile.replace('.png', '.webp'));
        
        // Convertir PNG a WebP con alta calidad
        await sharp(inputPath)
          .webp({ quality: 90, effort: 6 })
          .toFile(outputPath);
        
        console.log(`✓ Convertido: ${pngFile} → ${pngFile.replace('.png', '.webp')}`);
        convertedCount++;
        
      } catch (error) {
        console.error(`✗ Error convirtiendo ${pngFile}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Conversión completada:`);
    console.log(`- Convertidas exitosamente: ${convertedCount}`);
    console.log(`- Errores: ${errorCount}`);
    
    if (convertedCount > 0) {
      console.log(`\n¿Deseas eliminar los archivos PNG originales? (y/n)`);
    }
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Función para eliminar archivos PNG
async function deletePngFiles() {
  const dermoDir = path.join(__dirname, '..', 'public', 'dermo');
  
  try {
    const files = fs.readdirSync(dermoDir);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
    
    console.log(`\n🗑️  Eliminando ${pngFiles.length} archivos PNG originales...`);
    
    let deletedCount = 0;
    
    for (const pngFile of pngFiles) {
      try {
        const filePath = path.join(dermoDir, pngFile);
        fs.unlinkSync(filePath);
        console.log(`✓ Eliminado: ${pngFile}`);
        deletedCount++;
      } catch (error) {
        console.error(`✗ Error eliminando ${pngFile}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Eliminación completada: ${deletedCount} archivos PNG eliminados`);
    
  } catch (error) {
    console.error('Error eliminando archivos:', error.message);
  }
}

// Ejecutar el script
convertPngToWebp().then(() => {
  // Después de la conversión, eliminar automáticamente los PNG
  deletePngFiles();
});

export { convertPngToWebp, deletePngFiles };
