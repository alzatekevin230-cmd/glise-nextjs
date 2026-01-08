// lib/storageUtils.js
// Utilidades para manejar Cloudinary (Reemplaza Firebase Storage)

import { 
  uploadImage as uploadToCloudinary, 
  uploadMultipleImages as uploadMultipleToCloudinary,
  getImageURL as getCloudinaryURL,
  uploadProductImage as uploadProductToCloudinary,
  generateUniqueFileName,
  deleteImage as deleteFromCloudinary,
} from './cloudinary.js';

/**
 * Sube una imagen a Cloudinary con metadatos de caché optimizados
 * @param {File|Blob|Buffer|string} file - Archivo a subir
 * @param {string} path - Ruta/carpeta en Cloudinary (ej: 'products/belleza')
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} URL de la imagen optimizada
 */
export async function uploadImageWithCache(file, path, options = {}) {
  try {
    // Cloudinary maneja caché automáticamente con CDN
    // Además optimiza automáticamente (WebP, AVIF, calidad)
    const url = await uploadToCloudinary(file, path, {
      invalidate: options.invalidate || false,
      overwrite: options.overwrite || false,
      tags: options.tags || [],
      context: {
        uploadedAt: new Date().toISOString(),
        ...options.customMetadata,
      },
      ...options,
    });
    
    console.log('✅ Imagen subida a Cloudinary:', path);
    return url;
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    throw error;
  }
}

/**
 * Sube múltiples imágenes en paralelo
 * @param {Array<{file: File|Buffer|string, path: string, options?: Object}>} uploads - Array de archivos y rutas
 * @returns {Promise<Array<string>>} URLs de las imágenes
 */
export async function uploadMultipleImages(uploads) {
  try {
    const formattedUploads = uploads.map(({ file, path, options }) => ({
      file,
      folder: path,
      options: options || {},
    }));
    
    const urls = await uploadMultipleToCloudinary(formattedUploads);
    console.log(`✅ ${urls.length} imágenes subidas exitosamente`);
    return urls;
  } catch (error) {
    console.error('❌ Error al subir múltiples imágenes:', error);
    throw error;
  }
}

/**
 * Obtiene la URL de una imagen de Cloudinary
 * @param {string} publicId - Public ID de la imagen en Cloudinary (o URL completa)
 * @param {Object} transformations - Transformaciones opcionales
 * @returns {string} URL de la imagen (puede incluir transformaciones)
 */
export async function getImageURL(publicId, transformations = {}) {
  try {
    // Cloudinary genera URLs automáticamente optimizadas
    return getCloudinaryURL(publicId, transformations);
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
// Re-exportar la función de cloudinary para compatibilidad
export { generateUniqueFileName };

/**
 * Sube una imagen de producto con estructura específica
 * @param {File|Buffer|string} file - Archivo a subir
 * @param {string} category - Categoría del producto
 * @param {string} productName - Nombre del producto
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} URL de la imagen
 */
export async function uploadProductImage(file, category, productName, options = {}) {
  try {
    return await uploadProductToCloudinary(file, category, productName, options);
  } catch (error) {
    console.error('❌ Error al subir imagen de producto:', error);
    throw error;
  }
}

/**
 * Elimina una imagen de Cloudinary
 * @param {string} publicId - Public ID de la imagen (o URL completa)
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export async function deleteImage(publicId) {
  try {
    return await deleteFromCloudinary(publicId);
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error);
    throw error;
  }
}

// Exportar funciones compatibles con Firebase Storage
export { uploadImageWithCache as uploadImage };
// uploadProductImage ya está exportado arriba (línea 97), no hace falta exportarlo de nuevo
