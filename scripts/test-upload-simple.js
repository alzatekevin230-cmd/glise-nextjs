// scripts/test-upload-simple.js
// Test simple para verificar que el upload funciona

import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

console.log('\n🧪 Test Simple de Upload a Cloudinary\n');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Verificar credenciales
if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Faltan credenciales!');
  process.exit(1);
}

// Verificar que el API Secret no tenga espacios
const apiSecretTrimmed = apiSecret.trim();
if (apiSecret !== apiSecretTrimmed) {
  console.warn('⚠️ El API Secret tiene espacios al inicio/final. Corrigiendo...');
}

console.log('📋 Credenciales:');
console.log(`  Cloud Name: ${cloudName}`);
console.log(`  API Key: ${apiKey.substring(0, 10)}...`);
console.log(`  API Secret: ${apiSecretTrimmed.substring(0, 10)}... (longitud: ${apiSecretTrimmed.length})`);

// Configurar Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecretTrimmed,
  secure: true,
});

// Intentar subir una imagen de prueba
const testImagePath = resolve(__dirname, '../ProyectoGlise/public/nat/bel1.webp');

if (!fs.existsSync(testImagePath)) {
  console.error(`❌ Imagen de prueba no encontrada: ${testImagePath}`);
  process.exit(1);
}

console.log('\n🚀 Intentando subir imagen de prueba...');
console.log(`📁 Ruta: ${testImagePath}\n`);

try {
  // Upload MUY simple - solo lo esencial
  const result = await cloudinary.uploader.upload(testImagePath, {
    folder: 'test',
    resource_type: 'image',
  });

  console.log('✅ ¡ÉXITO! Imagen subida correctamente:');
  console.log(`   URL: ${result.secure_url}`);
  console.log(`   Public ID: ${result.public_id}`);
  console.log('\n🎉 Cloudinary funciona correctamente!');
  
} catch (error) {
  console.error('\n❌ Error al subir:');
  console.error(`   Mensaje: ${error.message}`);
  console.error(`   HTTP Code: ${error.http_code || 'N/A'}`);
  
  if (error.message.includes('Invalid Signature')) {
    console.error('\n🔍 Diagnóstico de Invalid Signature:');
    console.error('   1. Verifica que el API Secret sea correcto (sin espacios)');
    console.error('   2. Verifica que las credenciales coincidan con el Dashboard');
    console.error('   3. Intenta regenerar el API Secret en Cloudinary Dashboard');
  }
  
  process.exit(1);
}
