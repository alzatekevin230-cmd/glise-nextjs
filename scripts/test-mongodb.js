// scripts/test-mongodb.js
// Script para verificar la conexión a MongoDB

import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDatabase } from '../lib/mongodb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

console.log('\n🧪 Test de Conexión a MongoDB\n');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI no está configurado en .env.local');
  console.error('\n💡 Agrega:');
  console.error('   MONGODB_URI=mongodb+srv://...');
  process.exit(1);
}

try {
  const db = await getDatabase();
  const dbName = db.databaseName;
  
  console.log('✅ Conectado a MongoDB!');
  console.log(`✅ Base de datos: ${dbName}`);
  
  // Listar colecciones
  const collections = await db.listCollections().toArray();
  console.log(`\n📦 Colecciones existentes: ${collections.length}`);
  
  if (collections.length > 0) {
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
  } else {
    console.log('   (ninguna colección aún)');
  }
  
  console.log('\n🎉 MongoDB está listo para usar!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Error al conectar:');
  console.error(`   ${error.message}`);
  
  if (error.message.includes('authentication')) {
    console.error('\n💡 Verifica:');
    console.error('   1. Usuario y contraseña en MONGODB_URI');
    console.error('   2. Usuario tiene permisos de lectura/escritura');
  } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
    console.error('\n💡 Verifica:');
    console.error('   1. Tu IP está en la whitelist de MongoDB Atlas');
    console.error('   2. Network Access configurado correctamente');
  }
  
  process.exit(1);
}
