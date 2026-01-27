import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertImages() {
  const sourceDir = path.join(__dirname, '..', 'nuevo infantil 2026');
  
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
        
        await sharp(inputPath)
          .webp({
            quality: 80, // Calidad entre 75-85% como solicitado
            effort: 6
          })
          .toFile(outputPath);
          
        processedCount++;
        console.log(`   ✓ Convertido a: ${outputFileName}`);
        
      } catch (error) {
        console.error(`✗ Error procesando ${file}:`, error.message);
      }
    }
    
    console.log(`
🎉 Proceso completado: ${processedCount} imágenes convertidas.`);
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

convertImages();
