# 🎯 Cambios en la Sección de Mejores Ofertas - Versión 2.0 (Estilo Walmart)

## 📋 Resumen Ejecutivo

La sección "Mejores Ofertas" ha sido completamente rediseñada para implementar un modelo de **tarjetas de categoría** tipo Walmart. En lugar de mostrar un carrusel lineal de productos individuales, ahora se presentan **5 tarjetas contenedoras** (una por cada categoría principal), cada una con un grid interno de **2x2 con 4 productos destacados**.

---

## 🎨 Cambio Visual

### Antes ❌
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Prod 1  │ │ Prod 2  │ │ Prod 3  │ │ Prod 4  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
Carrusel lineal de productos sueltos
```

### Después ✅
```
┌──────────────────────────────────┐
│  Dermocosméticos        Ver todo │
├──────────────────────────────────┤
│  ┌────────┐  ┌────────┐         │
│  │ Prod 1 │  │ Prod 2 │         │
│  ├────────┤  ├────────┤         │
│  │ Prod 3 │  │ Prod 4 │         │
│  └────────┘  └────────┘         │
└──────────────────────────────────┘
Tarjeta contenedora con grid 2x2
```

---

## 📁 Archivos Modificados/Creados

### 1. **app/page.js** (ACTUALIZADO)
**Cambio clave**: La lógica de obtención de datos ahora agrupa productos por categoría
```javascript
const categoryGroupedProducts = mainCategories.map(categoryName => {
  // Por cada categoría, obtiene exactamente 4 productos
  return {
    categoryName,
    categorySlug,
    linkToAll,
    products: [Prod1, Prod2, Prod3, Prod4]
  };
});
```

**Categorías incluidas** (en orden):
1. Dermocosméticos
2. Cuidado Facial
3. Cuidado Corporal
4. Naturales y Homeopáticos
5. Capilares

---

### 2. **components/BestOffers.jsx** (REESCRITO)
**Nueva responsabilidad**: Manejar el carrusel de categorías (no productos)

**Características**:
- ✅ Detección automática de móvil vs desktop
- ✅ Navegación por categorías (no por productos)
- ✅ Touch events para móvil (swipe)
- ✅ Flechas de navegación para desktop
- ✅ Indicadores de posición (dots) en móvil
- ✅ Transiciones suaves (300ms)

**Props esperados**:
```javascript
<BestOffers products={categoryGroupedProducts} />
// Nota: 'products' ahora contiene CATEGORÍAS, no productos individuales
```

---

### 3. **components/CategoryCard.jsx** (NUEVO)
**Responsabilidad**: Renderizar una tarjeta de categoría individual

**Estructura**:
```
┌─────────────────────────┐
│ Header (Título + Link)  │ ← categoryName + linkToAll
├─────────────────────────┤
│     Grid 2x2            │ ← 4 productos
│  ┌──┐ ┌──┐              │
│  │1 │ │2 │              │
│  ├──┤ ├──┤              │
│  │3 │ │4 │              │
│  └──┘ └──┘              │
└─────────────────────────┘
```

**Estilos**:
- Fondo gris claro: `#f2f8fd`
- Border: 1px solid `#e0e0e0`
- Border-radius: `0.75rem` (12px)
- Padding: `12px` interno
- Hover effect: Sombra delicada

---

### 4. **components/MiniProductCard.jsx** (NUEVO)
**Responsabilidad**: Tarjeta simplificada de producto (versión mini)

**Diferencias con OfferProductCard**:
| Feature | OfferProductCard | MiniProductCard |
|---------|------------------|-----------------|
| Altura imagen | 170px | 120px |
| Altura total | 300px | ~180px |
| Nombre líneas | 2 | 1 |
| Tamaño texto | Grande | Pequeño (11px) |
| Contexto | Vista individual | Dentro grid 2x2 |

**Elementos**:
- Imagen: 120px altura
- Botón favoritos: 32px
- Precio: $XX⁷⁶ (sin "Ahora")
- Nombre: 1 línea máximo

---

### 5. **app/globals.css** (ACTUALIZADO)
**Nuevas clases CSS**:
- `.category-carousel-mobile` - Carrusel móvil con scroll snap
- `.category-card` - Tarjeta contenedora gris
- `.category-card-header` - Header con título y link
- `.category-card-grid` - Grid 2x2 de productos
- `.mini-product-card` - Tarjeta mini de producto
- `.carousel-dot` - Indicadores de posición
- `.carousel-nav-button` - Botones de navegación

---

## 📐 Layout Responsivo

### DESKTOP (≥ 768px)

**Estado**:
```
┌─────────────────────────────────────────────┐
│  Mejores Ofertas              Ver todo      │
├─────────────────────────────────────────────┤
│  ← │ [TARJETA 1] [TARJETA 2] [TARJETA 3] │ →
│     │ Dermocos... │ Cuidado... │ Corporales │
│     │ (Grid 2x2)  │ (Grid 2x2) │ (Grid 2x2) │
└─────────────────────────────────────────────┘
```

**Especificaciones**:
- Muestra **4 tarjetas** por defecto
- Ancho tarjeta: Calculado automáticamente (~ 300-350px)
- Gap entre tarjetas: `24px`
- Flechas: Visibles si hay más categorías
- Navegación: Flecha izquierda/derecha (1 categoría por clic)

### TABLET (768px - 1023px)

**Especificaciones**:
- Muestra **3 tarjetas** en la vista
- Ancho tarjeta: ~33% del contenedor
- Gap: 20px
- Flechas: Visibles si hay más de 3 categorías

### MÓVIL (< 768px)

**Estado**:
```
┌────────────────────┐
│  Mejores Ofertas   │ Ver todo
├────────────────────┤
│                    │
│  ┌──────────────┐  │  ← Tarjeta gris (85-90% ancho)
│  │ Dermocos     │  │
│  │ Ver todo     │  │
│  ├─────┬─────┐ │  │  ← Grid 2x2
│  │ P1  │ P2  │ │  │
│  ├─────┼─────┤ │  │
│  │ P3  │ P4  │ │  │
│  └─────┴─────┘ │  │
│  └──────────────┘  │
│                    │
│  ● ○ ○ ○ ○         │  ← Indicadores
└────────────────────┘
```

**Especificaciones**:
- Ancho tarjeta: **85-90% del viewport**
- Altura tarjeta: Automática según grid
- Navegación: **Swipe táctil** (drag horizontal)
- Snap: `scroll-snap-type: x mandatory`
- Indicadores: Dots interactivos
- Sin flechas de navegación

---

## 🔄 Estructura de Datos

### Input a BestOffers

```javascript
[
  {
    categoryName: "Dermocosméticos",
    categorySlug: "dermocosmeticos",
    linkToAll: "/categoria/Dermocosméticos",
    products: [
      {
        id: "prod-1",
        slug: "producto-1",
        name: "Producto 1",
        price: 49990,
        image: "/img1.jpg",
        images: ["/img1.jpg"],
        // ... más propiedades
      },
      // ... 3 productos más
    ]
  },
  // ... más 4 categorías
]
```

### Output: Renderizado

Cada categoría renderiza una **CategoryCard**, que a su vez renderiza 4 **MiniProductCard** en un grid 2x2.

---

## 🎯 Flujo de Datos

```
page.js (obtiene datos)
    ↓
Agrupa en 5 categorías
    ↓
Obtiene 4 productos por categoría
    ↓
Pasa array de categorías a BestOffers
    ↓
BestOffers renderiza según screen size
    ├─→ MÓVIL: 1 categoría visible, swipe
    └─→ DESKTOP: 4 categorías visibles, flechas
```

---

## 🎯 Comportamiento por Pantalla

### MÓVIL

1. El usuario ve **1 tarjeta gris** completamente visible
2. Se ve una **pequeña parte** de la siguiente tarjeta (incentivando scroll)
3. **Swipe izquierda**: Va a la siguiente categoría
4. **Swipe derecha**: Va a la categoría anterior
5. **Dots**: Clicables para ir directamente a cualquier categoría
6. **Snap automático**: Al soltar, se centra en la tarjeta más cercana

### DESKTOP

1. El usuario ve **hasta 4 tarjetas** en una fila
2. Si hay más de 4 categorías, aparecen **flechas** de navegación
3. **Clic en flecha izquierda**: Avanza 1 categoría a la izquierda
4. **Clic en flecha derecha**: Avanza 1 categoría a la derecha
5. Las **flechas desaparecen** en los extremos
6. **Transición suave**: 300ms para cambio de vista

---

## 🎨 Paleta de Colores

| Color | Uso |
|-------|-----|
| `#f2f8fd` | Fondo tarjeta categoría |
| `#ffffff` | Fondo tarjetas mini productos |
| `#e0e0e0` | Bordes |
| `#0071ce` | Link "Ver todo", hover |
| `#0F7F0F` | Fondo flecha en hover, indicator activo |
| `#333333` | Textos oscuros |
| `#2e2e2e` | Nombres de productos |
| `#cccccc` | Borde flechas |
| `#d0d0d0` | Borde botón favoritos, dots inactivos |

---

## ✅ Checklist de Verificación

- [x] Desktop muestra múltiples tarjetas de categoría
- [x] Cada tarjeta contiene exactamente 4 productos en grid 2x2
- [x] Flechas de navegación en desktop
- [x] Móvil muestra 1 tarjeta (85-90% ancho)
- [x] Swipe funciona en móvil
- [x] Indicadores (dots) en móvil
- [x] Header con nombre de categoría + "Ver todo"
- [x] MiniProductCard muestra imagen, precio y nombre
- [x] Botón de favoritos en cada producto
- [x] Transiciones suaves (300ms)
- [x] Responsive en todos los breakpoints
- [x] Sin importar OfferProductCard (ya no se usa)

---

## 🚀 Cómo Usar

**En `page.js`** ya está implementado automáticamente:
```javascript
import BestOffers from "@/components/BestOffers";

// Los datos se preparan automáticamente:
const categoryGroupedProducts = mainCategories.map(categoryName => {
  // Lógica de agrupación...
});

// Se renderiza:
<BestOffers products={categoryGroupedProducts} />
```

---

## 🔍 Notas Técnicas

1. **No se usa OfferProductCard**: Reemplazado por MiniProductCard
2. **Agrupación automática**: El server agrupa por categoría en `page.js`
3. **Mobile-first**: La detección de pantalla es responsiva
4. **Scroll snap**: Solo en móvil para UX mejorada
5. **Favoritos**: Usa el hook `useFavorites()` existente
6. **Slugs**: Los productos ya tienen slug generado automáticamente

---

## 📱 Ejemplo en Código

```jsx
// Móvil ve esto al cargar:
Tarjeta 1: Dermocosméticos [4 productos 2x2]
Tarjeta 2: (parcialmente visible)

// Desktop ve esto al cargar:
Tarjeta 1: Dermocosméticos [4 productos 2x2]
Tarjeta 2: Cuidado Facial [4 productos 2x2]
Tarjeta 3: Cuidado Corporal [4 productos 2x2]
Tarjeta 4: Naturales [4 productos 2x2]
```

---

**Última actualización**: 27 de enero de 2026
**Versión**: 2.0 - Tarjetas de Categoría (Estilo Walmart)


---

## 📁 Archivos Modificados

### 1. **BestOffers.jsx**
   - **Ubicación**: `components/BestOffers.jsx`
   - **Cambios principales**:
     - Implementación de grid de 4 columnas en desktop
     - Navegación mediante flechas laterales (desktop)
     - Carrusel táctil de 1 producto en móvil
     - Indicadores de posición (dots) en móvil
     - Lógica mejorada de cálculo de índices y visibilidad de flechas

### 2. **OfferProductCard.jsx**
   - **Ubicación**: `components/OfferProductCard.jsx`
   - **Cambios principales**:
     - Tarjetas rediseñadas con altura de 300px
     - Imagen del producto: 170px de alto (con object-fit: contain)
     - Botón de favoritos circular en esquina superior derecha
     - Precio sin texto "Ahora" (solo $XX⁷⁶)
     - Badge "Precio reducido" con borde azul (no fondo amarillo)
     - Nombre truncado a 2 líneas máximas
     - Eliminación de precio anterior tachado
     - Estilos limpios y modernos

### 3. **globals.css**
   - **Ubicación**: `app/globals.css`
   - **Cambios principales**:
     - Estilos responsivos para el carrusel
     - Media queries para desktop, tablet y móvil
     - Clases de utilidad para consistencia de diseño
     - Transiciones suaves y efectos hover

---

## 🎨 Especificaciones de Diseño

### Desktop (1024px+)

- **Grid**: 4 columnas iguales
- **Gap**: 1rem (16px)
- **Navegación**: Flechas laterales (izquierda y derecha)
- **Desplazamiento**: De 4 en 4 productos
- **Máximo visible**: 8 productos (2 filas)
- **Tarjeta ancho**: 25% del contenedor
- **Tarjeta alto**: 300px

### Tablet (768px - 1023px)

- **Grid**: 3 columnas
- **Gap**: 1rem (16px)
- **Navegación**: Flechas laterales
- **Tarjeta ancho**: ~33% del contenedor

### Móvil (< 768px)

- **Carrusel**: 1 producto visible
- **Ancho**: 90% de la pantalla (con 5% padding a cada lado)
- **Máximo ancho**: 340px
- **Navegación**: Swipe táctil
- **Indicadores**: Dots (bolitas) debajo del carrusel
- **Sin flechas**

---

## 🎯 Estructura de Tarjeta

```
┌─────────────────────────────────┐
│  [Liquidación] [🤍] (arriba)   │ ← Badge + Botón favoritos
│                                 │
│                                 │
│        [IMAGEN PRODUCTO]        │ ← 170px altura
│                                 │
│                                 │
├─────────────────────────────────┤
│                                 │
│  $1.500⁷⁶                       │ ← Precio sin "Ahora"
│  Nombre del Producto...         │ ← Máx 2 líneas
│                                 │
└─────────────────────────────────┘
```

### Elementos de la Tarjeta

| Elemento | Especificación |
|----------|---|
| **Imagen** | 170px alto, object-fit: contain, fondo blanco |
| **Botón Favoritos** | 36px, esquina superior derecha, borde gris |
| **Badge** | "Precio reducido", borde azul (#0071ce), sin fondo |
| **Precio** | $XX⁷⁶ (sin "Ahora", sin precio anterior) |
| **Nombre** | 14px, gris oscuro (#2e2e2e), máx 2 líneas |
| **Tarjeta** | Borde #e0e0e0, border-radius 8px, shadow en hover |

---

## 🔄 Lógica de Navegación

### Desktop

```javascript
// Cada clic avanza 4 productos
currentIndexDesktop += 4  // Siguiente
currentIndexDesktop -= 4  // Anterior

// Las flechas se ocultan cuando:
// - Flecha izquierda: currentIndexDesktop === 0
// - Flecha derecha: No hay más productos por mostrar
```

### Móvil

```javascript
// Cada swipe avanza 1 producto
currentIndexMobile += 1  // Swipe izquierda
currentIndexMobile -= 1  // Swipe derecha

// Los dots se actualizan automáticamente
// El usuario puede hacer clic en un dot para ir directo a ese producto
```

---

## 📐 Breakpoints

| Pantalla | Ancho | Productos/Fila | Navegación |
|----------|-------|---|---|
| Desktop | ≥ 1024px | 4 | Flechas |
| Tablet | 768px - 1023px | 3 | Flechas |
| Móvil | < 768px | 1 | Swipe + Dots |

---

## ✅ Checklist de Verificación

- [x] Desktop muestra 4 productos por fila
- [x] Flechas en los lados para navegar
- [x] Flechas desplazan de 4 en 4 productos
- [x] Las flechas se ocultan en los extremos
- [x] Móvil muestra 1 producto centrado
- [x] Swipe funciona en móvil
- [x] Indicadores (dots) en móvil
- [x] Precio NO muestra anterior ni "Ahora"
- [x] Centavos en superíndice (⁷⁶)
- [x] Nombre truncado a 2 líneas
- [x] Botón corazón en esquina superior derecha
- [x] Header con título y "Ver todo"
- [x] Tarjetas con borde sutil
- [x] Efecto shadow en hover
- [x] Badge "Precio reducido" con estilo correcto

---

## 🚀 Cómo Usar

El componente `BestOffers` se usa pasando un array de productos:

```jsx
<BestOffers products={mejoresOfertasData} />
```

Cada producto debe tener:
```javascript
{
  id: "producto-id",
  slug: "nombre-del-producto",
  name: "Nombre completo del producto",
  price: 1500.76,
  image: "/ruta/imagen.jpg",
  images: ["/ruta/imagen.jpg"],
  // Opcional:
  oldPrice: 2500,
  isClearance: false,
  isFeatured: false,
  popularity: 85
}
```

---

## 🎨 Colores Principales

| Color | Uso |
|-------|-----|
| `#F5F5F5` | Fondo de la sección |
| `#ffffff` | Fondo de tarjetas |
| `#e0e0e0` | Borde de tarjetas |
| `#0071ce` | Links, badges, hover de flechas |
| `#0F7F0F` | Fondo de flechas en hover |
| `#333333` | Títulos |
| `#2e2e2e` | Texto de productos |
| `#cccccc` | Borde de flechas |

---

## 🔧 Transiciones y Animaciones

- **Duración de transiciones**: 300ms
- **Easing**: ease-out / ease-in
- **Hover effects**: Cambio de shadow, color y borde
- **Touch**: Smooth scroll con snap points

---

## 📱 Responsive Features

- Detección automática de screen size
- Ajuste dinámico del layout
- Touch events para móvil
- Indicadores visuales de posición
- Navegación accesible con aria-labels

---

**Última actualización**: 27 de enero de 2026
