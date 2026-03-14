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

/**
 * Transforma la URL de una imagen para usar la versión optimizada con tamaño específico
 * @param {string} url - URL de la imagen original
 * @param {string} size - Tamaño de la imagen (por defecto '400x400')
 * @returns {string} - URL transformada con el tamaño especificado
 */
export function getImageUrl(url, size = '400x400') {
  if (!url) return '';
  
  // Si la URL ya tiene un tamaño (ej: _400x400.webp), reemplazarlo
  const sizePattern = /_\d+x\d+\.webp/;
  if (sizePattern.test(url)) {
    return url.replace(sizePattern, `_${size}.webp`);
  }
  
  // Separar URL base y query string (para manejar Firebase Storage y otras URLs con parámetros)
  const [urlBase, ...queryParts] = url.split('?');
  const queryString = queryParts.length > 0 ? '?' + queryParts.join('?') : '';
  
  // Si la URL base termina con .webp, reemplazar con el tamaño
  if (urlBase.endsWith('.webp')) {
    return urlBase.replace('.webp', `_${size}.webp`) + queryString;
  }
  
  // Si no es .webp, intentar convertir a .webp y agregar tamaño
  // Esto maneja casos donde la URL podría ser .png, .jpg, etc.
  const urlWithoutExt = urlBase.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  return `${urlWithoutExt}_${size}.webp${queryString}`;
}