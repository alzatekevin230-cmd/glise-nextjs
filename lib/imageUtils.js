// lib/imageUtils.js
// Utilidades para manejo de imágenes

/**
 * Convierte automáticamente URLs de imágenes PNG a WebP
 * @param {string} url - URL de la imagen
 * @returns {string} - URL convertida a WebP si es PNG, o la URL original
 */
export function convertToWebP(url) {
  if (!url) return 'https://placehold.co/600x400';
  
  // Si es una URL relativa que termina en .png, convertir a .webp
  if (url.startsWith('/') && url.endsWith('.png')) {
    return url.replace('.png', '.webp');
  }
  
  // Si no empieza con /, agregar /
  if (!url.startsWith('/')) {
    const webpUrl = url.replace('.png', '.webp');
    return `/${webpUrl}`;
  }
  
  return url;
}

/**
 * Procesa la URL de imagen de un post del blog
 * @param {string} imageUrl - URL de la imagen del post
 * @returns {string} - URL procesada y optimizada
 */
export function processBlogImageUrl(imageUrl) {
  return convertToWebP(imageUrl);
}

/**
 * Procesa la URL de imagen de un producto
 * @param {string} imageUrl - URL de la imagen del producto
 * @returns {string} - URL procesada y optimizada
 */
export function processProductImageUrl(imageUrl) {
  return convertToWebP(imageUrl);
}
