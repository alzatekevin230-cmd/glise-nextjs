// lib/mongodb.js
// Configuración de conexión a MongoDB Atlas

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor agrega MONGODB_URI a tus variables de entorno');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usar variable global para evitar múltiples conexiones
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En producción, crear nueva conexión
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Función helper para obtener la base de datos
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB_NAME || 'glise');
}

// Función helper para obtener una colección
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
