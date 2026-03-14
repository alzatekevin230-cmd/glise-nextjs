import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertImages() {
  const sourceDir = path.join(__dirname, '..', 'imagenes a web');
  
  if (!fs.existsSync(sourceDir)) {
    console.error(`Directory not found: ${sourceDir}`);
    return;
  }
  
  try {
    console.log('🖼️  Convirtiendo imágenes PNG a WebP...');
    
    const files = fs.readdirSync(sourceDir);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
    
    console.log(`Encontradas ${pngFiles.length} imágenes PNG para convertir...`);
    
    let processedCount = 0;
    
    for (const file of pngFiles) {
      try {
        const inputPath = path.join(sourceDir, file);
        const outputFileName = file.replace(/\.png$/i, '.webp');
        const outputPath = path.join(sourceDir, outputFileName);
        
        console.log(`
📸 Procesando: ${file}`);
        
        await sharp(inputPath) // Use the sharp instance correctly
          .webp({
            quality: 80, // Calidad entre 75-85% como solicitado
            effort: 6
          })
          .toFile(outputPath);
          
        // Delete original file after successful conversion
        fs.unlinkSync(inputPath);
        console.log(`   ✓ Convertido a: ${outputFileName} y original eliminado`);
        
        processedCount++;
        
      } catch (error) {
        console.error(`✗ Error procesando ${file}:`, error.message);
      }
    }
    
    console.log(`
🎉 Proceso completado: ${processedCount} imágenes convertidas y originales eliminados.`);
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

convertImages();
