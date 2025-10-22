# 🚀 Optimización de Caché - Firebase Storage

## 📋 ¿Qué hace esto?

Este sistema optimiza el caché de las imágenes en Firebase Storage para mejorar significativamente el rendimiento de tu sitio web en PageSpeed Insights.

### Beneficios:
- ⚡ **534 KiB** de ahorro en cada visita repetida
- 🎯 Mejor puntuación en **LCP** y **FCP**
- 💰 Menos costos de bandwidth
- 🚀 Carga instantánea para usuarios recurrentes

---

## 🔧 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Verificar que tengas un archivo `.env.local` con tus credenciales de Firebase:**
   ```env
   FIREBASE_PROJECT_ID=tu-project-id
   FIREBASE_CLIENT_EMAIL=tu-client-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-bucket.appspot.com
   ```

---

## 🎯 Uso

### 1. Actualizar imágenes existentes

**Ejecuta este comando UNA VEZ** para actualizar todas tus imágenes existentes:

```bash
npm run update-cache
```

El script va a:
- ✅ Buscar todas las imágenes en Firebase Storage
- ✅ Actualizar sus metadatos de caché a 1 año
- ✅ Mostrar un reporte detallado

**Ejemplo de salida:**
```
🚀 Iniciando actualización de metadatos de caché...

📦 Total de archivos encontrados: 150

✅ Actualizado: products/belleza/serumvitaminac30mlkosmaderm.webp
✅ Actualizado: products/dermo/vitybell.webp
✅ Actualizado: products/milenario/lavanda120ml.webp
...

🎉 ¡Proceso completado!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Archivos actualizados: 148
⏭️  Archivos omitidos (ya optimizados): 2
❌ Errores: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Subir nuevas imágenes con caché optimizado

Cuando subas nuevas imágenes de productos en el futuro, usa la función helper:

```javascript
import { uploadProductImage } from '@/lib/storageUtils';

// Ejemplo: Subir imagen de producto
const file = event.target.files[0]; // Archivo del input
const imageURL = await uploadProductImage(
  file,
  'belleza',  // Categoría
  'Serum Vitamina C'  // Nombre del producto
);

console.log('Imagen subida:', imageURL);
```

**Funciones disponibles:**

```javascript
// 1. Subir una imagen simple
import { uploadImageWithCache } from '@/lib/storageUtils';

const url = await uploadImageWithCache(
  file,
  'products/categoria/imagen.webp'
);

// 2. Subir múltiples imágenes
import { uploadMultipleImages } from '@/lib/storageUtils';

const urls = await uploadMultipleImages([
  { file: file1, path: 'products/cat1/img1.webp' },
  { file: file2, path: 'products/cat2/img2.webp' }
]);

// 3. Obtener URL de una imagen existente
import { getImageURL } from '@/lib/storageUtils';

const url = await getImageURL('products/belleza/imagen.webp');
```

---

## 📊 Verificar Resultados

### 1. En Firebase Console:
1. Ve a **Firebase Console → Storage**
2. Haz clic en cualquier imagen
3. Ve a la pestaña **Metadata**
4. Verifica que `Cache-Control` sea: `public, max-age=31536000, immutable`

### 2. En PageSpeed Insights:
1. Ve a [PageSpeed Insights](https://pagespeed.web.dev/)
2. Analiza tu sitio: `https://glise.com.co`
3. En la sección **"Usar tiempos de vida de caché eficientes"**:
   - ❌ Antes: `1h` (3600 segundos)
   - ✅ Después: `1 año` (31536000 segundos)

### 3. En DevTools del navegador:
1. Abre **Chrome DevTools** (F12)
2. Ve a la pestaña **Network**
3. Recarga la página
4. Haz clic en cualquier imagen
5. Ve a la pestaña **Headers**
6. Busca `cache-control: public, max-age=31536000, immutable`

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si actualizo una imagen?
Cuando actualizas una imagen en Firebase Storage, automáticamente se genera un nuevo token/URL, por lo que los usuarios siempre verán la versión más reciente.

### ¿Necesito ejecutar el script cada vez que subo una imagen?
**No**. Solo ejecuta `npm run update-cache` una vez para las imágenes existentes. Las nuevas imágenes que subas usando `storageUtils.js` ya tendrán el caché optimizado.

### ¿Afecta esto a las imágenes locales de /public?
Las imágenes en `/public/imagenespagina/` ya están optimizadas gracias a la configuración en `firebase.json` y `next.config.mjs`.

### ¿Esto funciona con Vercel/otros hosting?
Sí, el caché se aplica en Firebase Storage independientemente de dónde esté hosteado tu sitio Next.js.

---

## 🛠️ Archivos Modificados

1. **`firebase.json`** - Configuración de headers de caché para hosting
2. **`storage.rules`** - Reglas de seguridad de Storage
3. **`scripts/update-storage-cache.js`** - Script para actualizar metadatos
4. **`lib/storageUtils.js`** - Helper para subir imágenes con caché optimizado
5. **`next.config.mjs`** - Optimizaciones adicionales de Next.js
6. **`app/layout.js`** - Carga asíncrona de Font Awesome
7. **`package.json`** - Nuevo comando `update-cache`

---

## 🎉 ¡Listo!

Ahora tu sitio tendrá un caché optimizado y los usuarios recurrentes experimentarán una carga mucho más rápida.

**Próximos pasos:**
1. ✅ Ejecuta `npm install`
2. ✅ Ejecuta `npm run update-cache`
3. ✅ Prueba en PageSpeed Insights
4. ✅ ¡Disfruta de las mejoras! 🚀

