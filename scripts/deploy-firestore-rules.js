#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Desplegando reglas de Firestore...');

try {
  // Verificar que existe el archivo de reglas
  const rulesPath = path.join(process.cwd(), 'firestore.rules');
  if (!fs.existsSync(rulesPath)) {
    console.error('❌ No se encontró el archivo firestore.rules');
    process.exit(1);
  }

  // Desplegar las reglas usando Firebase CLI
  console.log('📝 Desplegando reglas de seguridad...');
  execSync('firebase deploy --only firestore:rules', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ Reglas de Firestore desplegadas exitosamente!');
  console.log('🔒 Ahora los usuarios autenticados pueden acceder a sus órdenes');

} catch (error) {
  console.error('❌ Error desplegando reglas:', error.message);
  console.log('\n💡 Asegúrate de tener Firebase CLI instalado y estar autenticado:');
  console.log('   npm install -g firebase-tools');
  console.log('   firebase login');
  console.log('   firebase use glise-58e2b');
  process.exit(1);
}
