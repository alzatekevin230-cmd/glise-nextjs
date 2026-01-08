// lib/cloudinary.js
// Configuración y utilidades de Cloudinary para reemplazar Firebase Storage

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Función para configurar Cloudinary (lazy - solo cuando se necesita)
let isConfigured = false;

function ensureConfigured() {
  if (isConfigured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true, // Usar HTTPS
  });

  isConfigured = true;
}

/**
 * Convierte un Buffer a Stream (necesario para Cloudinary)
 */
function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Sube una imagen a Cloudinary con optimizaciones automáticas
 * @param {File|Buffer|string} file - Archivo a subir (File, Buffer o ruta local)
 * @param {string} folder - Carpeta en Cloudinary (ej: 'products/nat')
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} URL de la imagen optimizada
 */
export async function uploadImage(file, folder, options = {}) {
  ensureConfigured(); // Asegurar que está configurado antes de usar
  try {
    // Opciones MÍNIMAS - solo lo esencial para evitar problemas de firma
    const uploadOptions = {
      folder: folder || 'glise',
      resource_type: 'image',
      // Solo optimizaciones básicas (sin transformaciones complejas)
      fetch_format: 'auto',
      quality: 'auto',
      // NO incluir transformation, tags, context, invalidate (causan problemas de firma)
      // Solo lo mínimo necesario
    };

    let result;

    // Si es una ruta local (string)
    if (typeof file === 'string') {
      result = await cloudinary.uploader.upload(file, uploadOptions);
    }
    // Si es un File (frontend)
    else if (file instanceof File || (file && file.stream)) {
      // En Node.js necesitamos convertir File a Buffer primero
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const stream = bufferToStream(buffer);
      
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
    }
    // Si es un Buffer
    else if (Buffer.isBuffer(file)) {
      const stream = bufferToStream(file);
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
    }
    else {
      throw new Error('Formato de archivo no soportado. Debe ser File, Buffer o string (ruta)');
    }

    console.log(`✅ Imagen subida a Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error al subir imagen a Cloudinary:', error);
    throw error;
  }
}

/**
 * Sube múltiples imágenes en paralelo
 * @param {Array<{file: File|Buffer|string, folder: string, options?: Object}>} uploads - Array de archivos y configuraciones
 * @returns {Promise<Array<string>>} URLs de las imágenes
 */
export async function uploadMultipleImages(uploads) {
  try {
    const uploadPromises = uploads.map(({ file, folder, options }) =>
      uploadImage(file, folder, options).catch(error => {
        console.error('❌ Error en una imagen:', error);
        return null; // Retorna null para las que fallan
      })
    );

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(url => url !== null);
    
    console.log(`✅ ${validUrls.length}/${urls.length} imágenes subidas exitosamente`);
    return validUrls;
  } catch (error) {
    console.error('❌ Error al subir múltiples imágenes:', error);
    throw error;
  }
}

/**
 * Obtiene la URL de una imagen de Cloudinary con transformaciones
 * @param {string} publicId - Public ID de la imagen en Cloudinary
 * @param {Object} transformations - Transformaciones a aplicar
 * @returns {string} URL de la imagen transformada
 */
export function getImageURL(publicId, transformations = {}) {
  ensureConfigured(); // Asegurar que está configurado antes de usar
  try {
    // Si es una URL completa, extraer el publicId
    if (publicId.includes('cloudinary.com')) {
      // Extraer publicId de URL completa
      const urlParts = publicId.split('/');
      const versionIndex = urlParts.findIndex(p => /^v\d+$/.test(p));
      if (versionIndex > 0) {
        publicId = urlParts.slice(versionIndex + 1).join('/').split('.')[0];
      }
    }

    const defaultTransformations = {
      fetch_format: 'auto',
      quality: 'auto:good',
      ...transformations,
    };

    return cloudinary.url(publicId, defaultTransformations);
  } catch (error) {
    console.error('❌ Error al generar URL:', error);
    throw error;
  }
}

/**
 * Genera un nombre único para un archivo
 * @param {string} originalName - Nombre original del archivo
 * @param {string} prefix - Prefijo opcional
 * @returns {string} Nombre único
 */
export function generateUniqueFileName(originalName, prefix = '') {
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
  
  const prefixPart = prefix ? `${prefix}_` : '';
  return `${prefixPart}${cleanName}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Sube una imagen de producto con estructura específica
 * @param {File|Buffer|string} file - Archivo a subir
 * @param {string} category - Categoría del producto
 * @param {string} productName - Nombre del producto
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} URL de la imagen
 */
export async function uploadProductImage(file, category, productName, options = {}) {
  // Normalizar nombre de carpeta
  const folderName = category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const folder = `products/${folderName}`;
  
  return uploadImage(file, folder, {
    tags: ['product', category.toLowerCase(), productName.toLowerCase()],
    context: {
      category,
      productName,
      originalName: file?.name || 'unknown',
    },
    ...options,
  });
}

/**
 * Elimina una imagen de Cloudinary
 * @param {string} publicId - Public ID de la imagen
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export async function deleteImage(publicId) {
  ensureConfigured(); // Asegurar que está configurado antes de usar
  try {
    // Si es una URL completa, extraer el publicId
    if (publicId.includes('cloudinary.com')) {
      const urlParts = publicId.split('/');
      const versionIndex = urlParts.findIndex(p => /^v\d+$/.test(p));
      if (versionIndex > 0) {
        publicId = urlParts.slice(versionIndex + 1).join('/').split('.')[0];
      }
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Imagen eliminada: ${publicId}`);
    return result;
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error);
    throw error;
  }
}

/**
 * Busca imágenes en Cloudinary
 * @param {Object} options - Opciones de búsqueda
 * @returns {Promise<Array>} Array de imágenes encontradas
 */
export async function searchImages(options = {}) {
  ensureConfigured(); // Asegurar que está configurado antes de usar
  try {
    const { folder, tags, maxResults = 50, ...restOptions } = options;
    
    const query = {
      max_results: maxResults,
      ...restOptions,
    };

    if (folder) {
      query.expression = `folder:${folder}/*`;
    }

    if (tags && tags.length > 0) {
      const tagsExpression = tags.map(tag => `tags:${tag}`).join(' AND ');
      query.expression = query.expression
        ? `${query.expression} AND ${tagsExpression}`
        : tagsExpression;
    }

    const result = await cloudinary.search.expression(query.expression || '*').execute();
    return result.resources;
  } catch (error) {
    console.error('❌ Error al buscar imágenes:', error);
    throw error;
  }
}

export default cloudinary;
