// scripts/test-firebase-connection.js
// Script para verificar la conexión a Firebase y si los productos se cargan

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

console.log('\n🔍 Verificando conexión a Firebase...\n');

// Verificar variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log('📋 Variables de entorno:');
console.log(`  FIREBASE_PROJECT_ID: ${projectId ? '✅' : '❌'}`);
console.log(`  FIREBASE_CLIENT_EMAIL: ${clientEmail ? '✅' : '❌'}`);
console.log(`  FIREBASE_PRIVATE_KEY: ${privateKey ? '✅' : '❌'}`);

if (!projectId || !clientEmail || !privateKey) {
  console.error('\n❌ Faltan variables de entorno de Firebase!');
  process.exit(1);
}

// Verificar formato de la clave privada
console.log('\n🔑 Verificando formato de FIREBASE_PRIVATE_KEY:');
console.log(`  Longitud: ${privateKey.length} caracteres`);

// Verificar que tenga el formato correcto (debe empezar con -----BEGIN PRIVATE KEY-----)
if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
  console.error('⚠️ ADVERTENCIA: La clave privada no parece tener el formato correcto');
  console.error('   Debe empezar con: -----BEGIN PRIVATE KEY-----');
  console.error('   Debe terminar con: -----END PRIVATE KEY-----');
}

// Verificar saltos de línea
const hasNewlines = privateKey.includes('\\n') || privateKey.includes('\n');
console.log(`  Tiene saltos de línea: ${hasNewlines ? '✅' : '⚠️ (puede ser normal si está en una línea)'}`);

// Intentar inicializar Firebase
try {
  console.log('\n🚀 Inicializando Firebase Admin...');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });

  console.log('✅ Firebase Admin inicializado correctamente');

  // Intentar conectar a Firestore
  const db = getFirestore();
  console.log('✅ Conectado a Firestore');

  // Intentar leer productos
  console.log('\n📦 Intentando leer productos de Firestore...');
  const productsSnapshot = await db.collection('products').limit(5).get();

  if (productsSnapshot.empty) {
    console.error('❌ No se encontraron productos en Firestore!');
    console.error('   Verifica que:');
    console.error('   1. Los productos estén en la colección "products"');
    console.error('   2. Las reglas de Firestore permitan lectura');
  } else {
    console.log(`✅ Se encontraron ${productsSnapshot.size} productos (mostrando primeros 5):`);
    productsSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`   ${index + 1}. ${data.name || 'Sin nombre'} (ID: ${doc.id})`);
    });

    // Contar total
    const totalSnapshot = await db.collection('products').count().get();
    const total = totalSnapshot.data().count;
    console.log(`\n📊 Total de productos en Firestore: ${total}`);
  }

  console.log('\n✅ Conexión a Firebase funciona correctamente!');
  process.exit(0);

} catch (error) {
  console.error('\n❌ Error al conectar a Firebase:');
  console.error(`   Tipo: ${error.name}`);
  console.error(`   Mensaje: ${error.message}`);
  
  if (error.message.includes('private_key')) {
    console.error('\n💡 Problema con FIREBASE_PRIVATE_KEY:');
    console.error('   1. Verifica que la clave esté completa');
    console.error('   2. Debe incluir -----BEGIN PRIVATE KEY----- y -----END PRIVATE KEY-----');
    console.error('   3. En Vercel, copia la clave completa con todos los saltos de línea');
    console.error('   4. Si está en una línea, debe tener \\n para los saltos de línea');
  } else if (error.message.includes('credential')) {
    console.error('\n💡 Problema con credenciales:');
    console.error('   1. Verifica FIREBASE_PROJECT_ID');
    console.error('   2. Verifica FIREBASE_CLIENT_EMAIL');
    console.error('   3. Verifica FIREBASE_PRIVATE_KEY');
  }

  process.exit(1);
}
