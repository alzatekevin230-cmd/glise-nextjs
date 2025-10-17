const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración
const IMAGES_DIR = path.join(__dirname, '../public/imagenespagina');
const QUALITY = 85; // Calidad WebP (85% es un buen balance)
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg'];

// Estadísticas
let totalFiles = 0;
let convertedFiles = 0;
let originalSize = 0;
let newSize = 0;
let errors = [];

console.log('🚀 Iniciando conversión de imágenes a WebP...\n');

// Función para obtener el tamaño del archivo en MB
function getFileSizeInMB(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

// Función para convertir una imagen
async function convertImage(filePath, fileName) {
  try {
    const originalSizeMB = getFileSizeInMB(filePath);
    originalSize += originalSizeMB;
    
    // Crear el nombre del archivo WebP
    const nameWithoutExt = path.parse(fileName).name;
    const webpFileName = `${nameWithoutExt}.webp`;
    const webpFilePath = path.join(IMAGES_DIR, webpFileName);
    
    console.log(`📸 Convirtiendo: ${fileName} → ${webpFileName}`);
    
    // Convertir a WebP
    await sharp(filePath)
      .webp({ 
        quality: QUALITY,
        effort: 6 // Máximo esfuerzo de compresión
      })
      .toFile(webpFilePath);
    
    const newSizeMB = getFileSizeInMB(webpFilePath);
    newSize += newSizeMB;
    
    const savings = ((originalSizeMB - newSizeMB) / originalSizeMB * 100).toFixed(1);
    
    console.log(`   ✅ Convertido! ${originalSizeMB.toFixed(2)}MB → ${newSizeMB.toFixed(2)}MB (${savings}% reducción)`);
    
    convertedFiles++;
    
  } catch (error) {
    console.error(`   ❌ Error convirtiendo ${fileName}:`, error.message);
    errors.push({ file: fileName, error: error.message });
  }
}

// Función principal
async function convertAllImages() {
  try {
    // Verificar que el directorio existe
    if (!fs.existsSync(IMAGES_DIR)) {
      throw new Error(`El directorio ${IMAGES_DIR} no existe`);
    }
    
    // Leer todos los archivos del directorio
    const files = fs.readdirSync(IMAGES_DIR);
    
    // Filtrar solo archivos de imagen soportados
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext);
    });
    
    totalFiles = imageFiles.length;
    
    if (totalFiles === 0) {
      console.log('ℹ️  No se encontraron imágenes para convertir.');
      return;
    }
    
    console.log(`📁 Encontradas ${totalFiles} imágenes para convertir\n`);
    
    // Convertir cada imagen
    for (const fileName of imageFiles) {
      const filePath = path.join(IMAGES_DIR, fileName);
      await convertImage(filePath, fileName);
    }
    
    // Mostrar resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE CONVERSIÓN');
    console.log('='.repeat(60));
    console.log(`📁 Archivos procesados: ${totalFiles}`);
    console.log(`✅ Conversiones exitosas: ${convertedFiles}`);
    console.log(`❌ Errores: ${errors.length}`);
    console.log(`💾 Tamaño original: ${originalSize.toFixed(2)} MB`);
    console.log(`💾 Tamaño final: ${newSize.toFixed(2)} MB`);
    
    if (originalSize > 0) {
      const totalSavings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      const savedMB = (originalSize - newSize).toFixed(2);
      console.log(`💰 Espacio ahorrado: ${savedMB} MB (${totalSavings}% reducción)`);
    }
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORES ENCONTRADOS:');
      errors.forEach(err => {
        console.log(`   - ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n🎉 ¡Conversión completada!');
    
    if (convertedFiles > 0) {
      console.log('\n📝 PRÓXIMOS PASOS:');
      console.log('1. Verificar que las imágenes WebP se ven correctamente');
      console.log('2. Actualizar las referencias en el código (data.js, componentes)');
      console.log('3. Opcionalmente, eliminar los archivos originales PNG/JPG');
    }
    
  } catch (error) {
    console.error('💥 Error general:', error.message);
    process.exit(1);
  }
}

// Ejecutar la conversión
convertAllImages();
