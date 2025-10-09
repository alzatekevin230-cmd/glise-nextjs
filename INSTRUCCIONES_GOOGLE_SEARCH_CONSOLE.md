# 📋 Instrucciones para Google Search Console

## Paso 1: Acceder a Google Search Console

1. Ve a: https://search.google.com/search-console
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Agregar propiedad"**

## Paso 2: Verificar tu sitio web

### Opción A: Prefijo de URL (Recomendado)
1. Selecciona **"Prefijo de URL"**
2. Ingresa: `https://glise.com.co`
3. Haz clic en **"Continuar"**

### Métodos de verificación:

**Método 1: Archivo HTML (Más fácil)**
1. Google te dará un archivo HTML para descargar
2. Súbelo a la carpeta `public/` de tu proyecto
3. Haz commit y deploy
4. Haz clic en "Verificar" en Search Console

**Método 2: Meta tag HTML**
1. Google te dará un meta tag como: `<meta name="google-site-verification" content="..." />`
2. Añádelo en `app/layout.js` dentro de `<head>`
3. Haz commit y deploy
4. Haz clic en "Verificar"

**Método 3: Google Analytics** (si ya lo tienes)
1. Conecta tu cuenta de Google Analytics
2. Verificación automática

## Paso 3: Enviar el Sitemap

Una vez verificado:

1. En el menú lateral, ve a **"Sitemaps"**
2. En "Agregar un nuevo sitemap", escribe: `sitemap.xml`
3. Haz clic en **"Enviar"**
4. Espera unos minutos y verifica que aparezca como "Correcto"

## Paso 4: Solicitar indexación de páginas importantes

1. Ve a **"Inspección de URL"** en el menú lateral
2. Pega la URL de tu página principal: `https://glise.com.co`
3. Haz clic en **"Solicitar indexación"**
4. Repite con otras páginas importantes:
   - `https://glise.com.co/blog`
   - `https://glise.com.co/categoria/all`
   - Productos destacados
   - Artículos del blog más importantes

## ⏱️ Tiempos de espera

- **Verificación**: Inmediata
- **Procesamiento del sitemap**: 1-2 días
- **Indexación inicial**: 3-7 días
- **Indexación completa**: 2-4 semanas

## 🔍 Monitoreo

Revisa regularmente:
- **Cobertura**: Cuántas páginas están indexadas
- **Rendimiento**: Clics, impresiones, CTR
- **Mejoras**: Problemas de usabilidad móvil
- **Errores**: Enlaces rotos, páginas no encontradas

## ⚠️ Problemas comunes

1. **"Sitemap no encontrado"**: Verifica que `https://glise.com.co/sitemap.xml` funcione
2. **"Páginas excluidas"**: Normal al principio, Google decide qué indexar
3. **"Error de servidor"**: Verifica que tu hosting esté funcionando

## 📊 Otras herramientas útiles

- **Bing Webmaster Tools**: https://www.bing.com/webmasters
  - Importa los datos desde Google Search Console
- **Google Analytics**: Para seguimiento de tráfico detallado
- **PageSpeed Insights**: Para optimización de velocidad

## 🎯 Tips adicionales

1. Publica contenido regularmente en el blog
2. Asegúrate de que todas las imágenes tengan alt text
3. Usa títulos descriptivos en cada página
4. Añade descripciones meta únicas para cada producto
5. Crea enlaces internos entre productos y artículos relacionados

---

**¿Necesitas ayuda?** Escríbeme por WhatsApp o correo.

