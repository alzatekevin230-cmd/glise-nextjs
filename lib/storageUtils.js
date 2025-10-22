// lib/storageUtils.js
// Utilidades para manejar Firebase Storage con caché optimizado

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebaseClient';

const storage = getStorage(app);

/**
 * Sube una imagen a Firebase Storage con metadatos de caché optimizados
 * @param {File|Blob} file - Archivo a subir
 * @param {string} path - Ruta en Storage (ej: 'products/belleza/imagen.webp')
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} URL de descarga de la imagen
 */
export async function uploadImageWithCache(file, path, options = {}) {
  try {
    // Crear referencia al archivo
    const storageRef = ref(storage, path);
    
    // Metadatos optimizados para caché
    const metadata = {
      contentType: file.type || 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable', // 1 año
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        ...options.customMetadata
      }
    };
    
    // Subir archivo con metadatos
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ Imagen subida con caché optimizado:', path);
    
    return downloadURL;
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    throw error;
  }
}

/**
 * Sube múltiples imágenes en paralelo
 * @param {Array<{file: File, path: string}>} uploads - Array de archivos y rutas
 * @returns {Promise<Array<string>>} URLs de descarga
 */
export async function uploadMultipleImages(uploads) {
  try {
    const uploadPromises = uploads.map(({ file, path, options }) => 
      uploadImageWithCache(file, path, options)
    );
    
    const urls = await Promise.all(uploadPromises);
    console.log(`✅ ${urls.length} imágenes subidas exitosamente`);
    
    return urls;
  } catch (error) {
    console.error('❌ Error al subir múltiples imágenes:', error);
    throw error;
  }
}

/**
 * Obtiene la URL de una imagen de Firebase Storage
 * @param {string} path - Ruta en Storage
 * @returns {Promise<string>} URL de descarga
 */
export async function getImageURL(path) {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('❌ Error al obtener URL:', error);
    throw error;
  }
}

/**
 * Genera un nombre de archivo único
 * @param {string} originalName - Nombre original del archivo
 * @returns {string} Nombre único
 */
export function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(`.${extension}`, '');
  
  // Limpiar nombre: remover espacios, caracteres especiales, etc.
  const cleanName = nameWithoutExt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]/g, ''); // Solo letras y números
  
  return `${cleanName}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Ejemplo de uso para subir imagen de producto
 */
export async function uploadProductImage(file, category, productName) {
  const uniqueName = generateUniqueFileName(file.name);
  const path = `products/${category}/${uniqueName}`;
  
  return uploadImageWithCache(file, path, {
    customMetadata: {
      category,
      productName,
      originalName: file.name
    }
  });
}

