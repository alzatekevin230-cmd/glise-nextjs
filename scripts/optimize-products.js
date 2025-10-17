const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración
const PRODUCTS_DATA_FILE = '../spa/data.js'; // Ruta a tu archivo data.js del SPA
const OUTPUT_DIR = './optimized-products';
const QUALITY = 85;

// Estadísticas
let totalProducts = 0;
let optimizedProducts = 0;
let originalSize = 0;
let newSize = 0;

console.log('🚀 Iniciando optimización de productos...\n');

// Función para obtener el tamaño del archivo en MB
function getFileSizeInMB(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

// Función para convertir imagen a WebP
async function convertImageToWebP(inputPath, outputPath) {
  try {
    const originalSizeMB = getFileSizeInMB(inputPath);
    originalSize += originalSizeMB;
    
    await sharp(inputPath)
      .webp({ 
        quality: QUALITY,
        effort: 6
      })
      .toFile(outputPath);
    
    const newSizeMB = getFileSizeInMB(outputPath);
    newSize += newSizeMB;
    
    const savings = ((originalSizeMB - newSizeMB) / originalSizeMB * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% reducción)`);
    
    optimizedProducts++;
    return true;
  } catch (error) {
    console.error(`❌ Error convirtiendo ${inputPath}:`, error.message);
    return false;
  }
}

// Función para procesar un producto
async function processProduct(product) {
  totalProducts++;
  
  console.log(`\n📦 Procesando: ${product.name}`);
  
  // Crear directorio para el producto
  const productDir = path.join(OUTPUT_DIR, product.id.toString());
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }
  
  // Convertir imagen principal
  if (product.imageUrl) {
    const originalPath = path.join('../spa', product.imageUrl);
    const webpPath = path.join(productDir, 'image.webp');
    
    await convertImageToWebP(originalPath, webpPath);
    
    // Actualizar la URL en el producto
    product.imageUrl = `/products/${product.id}/image.webp`;
  }
  
  // Convertir imágenes adicionales si existen
  if (product.additionalImages && product.additionalImages.length > 0) {
    product.additionalImages = [];
    
    for (let i = 0; i < product.additionalImages.length; i++) {
      const originalPath = path.join('../spa', product.additionalImages[i]);
      const webpPath = path.join(productDir, `image_${i + 1}.webp`);
      
      const success = await convertImageToWebP(originalPath, webpPath);
      if (success) {
        product.additionalImages.push(`/products/${product.id}/image_${i + 1}.webp`);
      }
    }
  }
  
  return product;
}

// Función principal
async function optimizeAllProducts() {
  try {
    // Verificar que existe el archivo data.js
    if (!fs.existsSync(PRODUCTS_DATA_FILE)) {
      console.error(`❌ No se encontró el archivo: ${PRODUCTS_DATA_FILE}`);
      console.log('💡 Asegúrate de que la ruta al archivo data.js del SPA sea correcta');
      return;
    }
    
    // Crear directorio de salida
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Leer y procesar el archivo data.js
    console.log('📖 Leyendo archivo data.js...');
    const dataContent = fs.readFileSync(PRODUCTS_DATA_FILE, 'utf8');
    
    // Extraer los productos del archivo (esto puede necesitar ajustes según tu estructura)
    const productsMatch = dataContent.match(/export\s+(?:const|let|var)\s+products\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!productsMatch) {
      console.error('❌ No se pudo extraer el array de productos del archivo data.js');
      return;
    }
    
    // Evaluar el array de productos (⚠️ Nota: En producción usar un parser más seguro)
    const products = eval(productsMatch[1]);
    
    console.log(`📦 Encontrados ${products.length} productos\n`);
    
    // Procesar cada producto
    const optimizedProductsData = [];
    
    for (const product of products) {
      const optimizedProduct = await processProduct(product);
      optimizedProductsData.push(optimizedProduct);
    }
    
    // Guardar productos optimizados
    const outputData = `// Productos optimizados - Generado automáticamente
export const products = ${JSON.stringify(optimizedProductsData, null, 2)};
`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, 'products-optimized.js'), outputData);
    
    // Mostrar resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE OPTIMIZACIÓN');
    console.log('='.repeat(60));
    console.log(`📦 Productos procesados: ${totalProducts}`);
    console.log(`✅ Imágenes optimizadas: ${optimizedProducts}`);
    console.log(`💾 Tamaño original: ${originalSize.toFixed(2)} MB`);
    console.log(`💾 Tamaño final: ${newSize.toFixed(2)} MB`);
    
    if (originalSize > 0) {
      const totalSavings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      const savedMB = (originalSize - newSize).toFixed(2);
      console.log(`💰 Espacio ahorrado: ${savedMB} MB (${totalSavings}% reducción)`);
    }
    
    console.log('\n📁 Archivos generados:');
    console.log(`   - ${OUTPUT_DIR}/products-optimized.js (datos actualizados)`);
    console.log(`   - ${OUTPUT_DIR}/*/ (imágenes WebP por producto)`);
    
    console.log('\n📝 PRÓXIMOS PASOS:');
    console.log('1. Revisar los productos optimizados');
    console.log('2. Subir las imágenes WebP a Firebase Storage');
    console.log('3. Actualizar los productos en Firebase con las nuevas URLs');
    console.log('4. Ejecutar el script subir.js con los datos optimizados');
    
  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar la optimización
optimizeAllProducts();
