const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log("CRITICAL: .env.local does not exist.");
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));

const requiredKeys = [
  // Firebase Admin
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  
  // Resend (Email)
  'RESEND_API_KEY',
  'CONTACT_TO_EMAIL',
  'CONTACT_DOMAIN_NAME',

  // Wompi (Pagos)
  'WOMPI_PUBLIC_KEY',
  'WOMPI_INTEGRITY_KEY',
  'WOMPI_EVENTS_SECRET',

  // Coordinadora (Logística)
  'COORDINADORA_APIKEY',
  'COORDINADORA_PASSWORD',
  'COORDINADORA_NIT',
  'COORDINADORA_GUIAS_ID_CLIENTE',
  'COORDINADORA_GUIAS_USUARIO',
  'COORDINADORA_GUIAS_CLAVE',
  'COORDINADORA_GUIAS_ID_ROTULO'
];

const missing = [];
const present = [];

requiredKeys.forEach(key => {
  if (!envConfig[key] || envConfig[key].trim() === '') {
    missing.push(key);
  } else {
    present.push(key);
  }
});

console.log(JSON.stringify({ missing, present_count: present.length }, null, 2));
