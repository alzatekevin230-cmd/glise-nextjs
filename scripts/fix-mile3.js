import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixMile3() {
  const sourceDir = path.join(__dirname, '..', 'public', 'mile3_optimized');
  const targetDir = path.join(__dirname, '..', 'public', 'mile3');
  
  // Lista de archivos que queremos mantener (solo los nombres limpios)
  const filesToKeep = [
    'almendras120ml.webp',
    'almendras500ml.webp', 
    'arboldete120ml.webp',
    'arboldete20m.webp',
    'argan120ml.webp',
    'castor120ml.webp',
    'castor500ml.webp',
    'coco120ml.webp',
    'coco500ml.webp',
    'dulces500ml.webp',
    'eucalipto120ml.webp',
    'eucalipto20ml.webp',
    'glicerina500ml.webp',
    'jojoba120ml.webp',
    'lavanda120ml.webp',
    'lavanda22ml.webp',
    'macadamia120ml.webp',
    'menta120ml.webp',
    'menta20ml.webp',
    'mineral120ml.webp',
    'mineral500ml.webp',
    'naranja120ml.webp',
    'naranja22ml.webp',
    'oregano20ml.webp',
    'pata120ml.webp',
    'pata500ml.webp',
    'ricino120ml.webp',
    'ricino500ml.webp',
    'romero120ml.webp',
    'romero20ml.webp',
    'semillas120ml.webp',
    'vitamina120ml.webp',
    'vitamina18ml.webp'
  ];
  
  try {
    console.log('🔧 Arreglando la carpeta mile3...');
    
    // Crear la carpeta mile3 si no existe
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    let copiedCount = 0;
    
    for (const fileName of filesToKeep) {
      const sourcePath = path.join(sourceDir, fileName);
      const targetPath = path.join(targetDir, fileName);
      
      if (fs.existsSync(sourcePath)) {
        // Copiar el archivo
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ Copiado: ${fileName}`);
        copiedCount++;
      } else {
        console.log(`⚠️  No encontrado: ${fileName}`);
      }
    }
    
    console.log(`\n🎉 Proceso completado:`);
    console.log(`- Archivos copiados: ${copiedCount}`);
    console.log(`- Archivos en mile3: ${filesToKeep.length}`);
    
    // Mostrar el estado final
    const finalFiles = fs.readdirSync(targetDir);
    console.log(`\n📁 Archivos finales en mile3:`);
    finalFiles.forEach(file => console.log(`  - ${file}`));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Ejecutar el script
fixMile3();








