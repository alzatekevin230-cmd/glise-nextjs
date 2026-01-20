// lib/storageUtils.js
// Utilidades para manejar Firebase Storage (Reemplaza Cloudinary)

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebaseClient';

/**
 * Genera un nombre de archivo único
 * @param {string} originalName - Nombre original del archivo
 * @returns {string} Nombre único
 */
export function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
  // Sanitizar nombre
  const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${safeName}-${timestamp}-${random}.${extension}`;
}

/**
 * Sube una imagen a Firebase Storage
 * @param {File|Blob} file - Archivo a subir
 * @param {string} path - Ruta/carpeta en Storage (ej: 'products/belleza')
 * @param {Object} options - Opciones adicionales (cacheControl, metadata)
 * @returns {Promise<string>} URL de descarga de la imagen
 */
export async function uploadImage(file, path, options = {}) {
  try {
    // Si path termina en /, generamos un nombre. Si no, usamos el path como nombre completo.
    let fullPath = path;
    if (!path.includes('.') && file.name) {
       const fileName = generateUniqueFileName(file.name);
       fullPath = path.endsWith('/') ? `${path}${fileName}` : `${path}/${fileName}`;
    }

    const storageRef = ref(storage, fullPath);
    
    // Metadatos opcionales
    const metadata = {
      cacheControl: options.cacheControl || 'public, max-age=31536000', // Cache por 1 año por defecto
      contentType: file.type,
      customMetadata: options.customMetadata || {}
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log('✅ Imagen subida a Firebase Storage:', snapshot.ref.fullPath);
    
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('❌ Error al subir imagen a Firebase:', error);
    throw error;
  }
}

// Alias para compatibilidad con código existente que usa uploadImageWithCache
export const uploadImageWithCache = uploadImage;

/**
 * Sube una imagen de producto con estructura específica
 * @param {File|Blob} file - Archivo a subir
 * @param {string} category - Categoría del producto
 * @param {string} productName - Nombre del producto
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} URL de la imagen
 */
export async function uploadProductImage(file, category, productName, options = {}) {
  try {
    // Sanitizar nombres para la ruta
    const safeCategory = category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const safeProduct = productName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    const path = `products/${safeCategory}/${safeProduct}`;
    return await uploadImage(file, path, options);
  } catch (error) {
    console.error('❌ Error al subir imagen de producto:', error);
    throw error;
  }
}

/**
 * Sube múltiples imágenes en paralelo
 * @param {Array<{file: File|Blob, path: string, options?: Object}>} uploads - Array de objetos de subida
 * @returns {Promise<Array<string>>} URLs de las imágenes
 */
export async function uploadMultipleImages(uploads) {
  try {
    const uploadPromises = uploads.map(({ file, path, options }) => 
      uploadImage(file, path, options)
    );
    
    const urls = await Promise.all(uploadPromises);
    console.log(`✅ ${urls.length} imágenes subidas exitosamente a Firebase`);
    return urls;
  } catch (error) {
    console.error('❌ Error al subir múltiples imágenes:', error);
    throw error;
  }
}

/**
 * Obtiene la URL de una imagen (Simplemente retorna la URL si ya es absoluta, 
 * o intenta resolverla si es un path relativo de storage)
 * @param {string} pathOrUrl - Ruta en storage o URL completa
 * @returns {Promise<string>} URL de descarga
 */
export async function getImageURL(pathOrUrl) {
  try {
    if (pathOrUrl.startsWith('http')) {
      return pathOrUrl;
    }
    // Asumimos que es una referencia de storage
    const storageRef = ref(storage, pathOrUrl);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('❌ Error al obtener URL:', error);
    throw error;
  }
}

/**
 * Elimina una imagen de Firebase Storage
 * @param {string} urlOrPath - URL completa o ruta en storage
 * @returns {Promise<void>}
 */
export async function deleteImage(urlOrPath) {
  try {
    let storageRef;
    
    if (urlOrPath.startsWith('http')) {
      // Intentar extraer la referencia de la URL de Firebase
      // Esto es complejo con URLs firmadas, a veces es mejor guardar el path.
      // Por simplicidad, intentamos crear una ref directamente desde la URL
      storageRef = ref(storage, urlOrPath);
    } else {
      storageRef = ref(storage, urlOrPath);
    }

    await deleteObject(storageRef);
    console.log('🗑️ Imagen eliminada de Firebase:', urlOrPath);
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error);
    // No lanzamos error si el objeto no existe (idempotencia)
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}