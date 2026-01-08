// scripts/test-cloudinary.js
// Script para verificar la configuración de Cloudinary

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../.env.local') });

console.log('\n🔍 Verificando configuración de Cloudinary...\n');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const status = {
  cloud_name: cloudName ? '✅ Presente' : '❌ Faltante',
  api_key: apiKey ? '✅ Presente' : '❌ Faltante',
  api_secret: apiSecret ? '✅ Presente' : '❌ Faltante',
};

console.log('📋 Variables de entorno:');
console.log(`  Cloud Name: ${status.cloud_name}`);
console.log(`  API Key: ${status.api_key}`);
console.log(`  API Secret: ${status.api_secret}`);

if (cloudName && apiKey && apiSecret) {
  console.log('\n✅ Todas las variables están configuradas!');
  console.log(`\n📝 Cloud Name: ${cloudName}`);
  console.log(`📝 API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`📝 API Secret: ${apiSecret.substring(0, 10)}...`);
  
  // Intentar configurar Cloudinary
  try {
    const cloudinary = await import('cloudinary');
    cloudinary.v2.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    
    console.log('\n✅ Cloudinary configurado correctamente!');
    console.log('\n🚀 Puedes proceder con la migración.');
  } catch (error) {
    console.error('\n❌ Error al configurar Cloudinary:', error.message);
    console.log('\n💡 Asegúrate de haber instalado cloudinary:');
    console.log('   npm install cloudinary');
  }
} else {
  console.log('\n❌ Faltan variables de entorno!');
  console.log('\n💡 Agrega estas variables a .env.local:');
  console.log('   CLOUDINARY_CLOUD_NAME=tu-cloud-name');
  console.log('   CLOUDINARY_API_KEY=tu-api-key');
  console.log('   CLOUDINARY_API_SECRET=tu-api-secret');
  console.log('\n📚 Revisa GUIA-SETUP-CLOUDINARY.md para más detalles.');
}

console.log('\n');
