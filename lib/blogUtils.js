// lib/blogUtils.js

/**
 * Procesa el contenido HTML del blog y agrega IDs a los headings
 * para permitir la navegación con Table of Contents
 */
export function processContentWithIds(htmlContent) {
  if (!htmlContent) return '';
  
  let headingIndex = 0;
  
  // Reemplazar h2 y h3 con versiones que tienen ID
  const processedContent = htmlContent
    .replace(/<h2>(.*?)<\/h2>/gi, (match, content) => {
      const id = `heading-${headingIndex++}`;
      return `<h2 id="${id}" class="scroll-mt-24">${content}</h2>`;
    })
    .replace(/<h3>(.*?)<\/h3>/gi, (match, content) => {
      const id = `heading-${headingIndex++}`;
      return `<h3 id="${id}" class="scroll-mt-24">${content}</h3>`;
    });
  
  return processedContent;
}

/**
 * Genera el structured data (JSON-LD) para un artículo de blog
 * Mejora el SEO según las mejores prácticas de Schema.org
 */
export function generateBlogPostSchema(post, url) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.imageUrl,
    "author": {
      "@type": "Organization",
      "name": "Glisé",
      "url": "https://glise.com.co"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Glisé",
      "logo": {
        "@type": "ImageObject",
        "url": "https://glise.com.co/imagenespagina/logodeglise.webp"
      }
    },
    "datePublished": post.publishedAt || post.createdAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.publishedAt || post.createdAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  // Agregar categoría si existe
  if (post.category) {
    schema.articleSection = post.category;
  }

  return schema;
}

/**
 * Calcula el tiempo estimado de lectura basado en el contenido
 * @param {string} content - Contenido HTML del artículo
 * @returns {string} - Tiempo de lectura formateado (ej: "5 min")
 */
export function calculateReadingTime(content) {
  if (!content) return '3 min';
  
  // Eliminar tags HTML y contar palabras
  const plainText = content.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/).length;
  
  // Promedio de 200 palabras por minuto
  const minutes = Math.ceil(words / 200);
  
  return `${minutes} min`;
}

/**
 * Formatea una fecha en español
 * @param {Date|string|object} date - Fecha a formatear
 * @returns {string} - Fecha formateada (ej: "15 Ene 2025")
 */
export function formatDate(date) {
  if (!date) return 'Recientemente';
  
  // Si es un timestamp de Firestore
  if (date.seconds) {
    date = new Date(date.seconds * 1000);
  } else if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('es-ES', options).replace('.', '');
}

