# 📊 GUÍA VISUAL - Mejores Ofertas v2.0

## 🎯 Vista Rápida

### ANTES (Carrusel Lineal)
```
[Producto 1] [Producto 2] [Producto 3] [Producto 4] ...
```
❌ Productos sueltos sin contexto de categoría

### DESPUÉS (Tarjetas de Categoría)
```
┌─────────────────────────────────────┐
│ Nombre Categoría        Ver todo    │
├─────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐           │
│ │ Producto │ │ Producto │           │
│ │   Grid   │ │   Grid   │           │
│ ├──────────┤ ├──────────┤           │
│ │ Producto │ │ Producto │           │
│ │   Grid   │ │   Grid   │           │
│ └──────────┘ └──────────┘           │
└─────────────────────────────────────┘
```
✅ Agrupación clara por categoría

---

## 📱 MÓVIL

### Comportamiento
```
INICIAL:                          DESPUÉS DE SWIPE →:
┌──────────────────────┐         ┌──────────────────────┐
│ Mejores Ofertas      │         │ Mejores Ofertas      │
│ Ver todo             │         │ Ver todo             │
├──────────────────────┤         ├──────────────────────┤
│ ┌──────────────────┐ │         │ ┌──────────────────┐ │
│ │ Dermocosméticos  │ │         │ │ Cuidado Facial   │ │
│ │ Ver todo         │ │         │ │ Ver todo         │ │
│ ├──────┬──────────┤ │         │ ├──────┬──────────┤ │
│ │ P1   │ P2       │ │         │ │ P1   │ P2       │ │
│ ├──────┼──────────┤ │  ──→     │ ├──────┼──────────┤ │
│ │ P3   │ P4       │ │         │ │ P3   │ P4       │ │
│ └──────┴──────────┘ │         │ └──────┴──────────┘ │
│ ┌──────────────────┐ │         │ ┌──────────────────┐ │
│ │Corporales (hint) │ │         │ │Naturales (hint)  │ │
│ └──────────────────┘ │         │ └──────────────────┘ │
└──────────────────────┘         └──────────────────────┘

● ○ ○ ○ ○                        ○ ● ○ ○ ○
```

**Especificaciones**:
- Ancho tarjeta: **85-90%** del viewport
- Altura automática según grid interno
- Visible: **85-90% tarjeta actual + pequeña parte siguiente**
- Swipe: Drag horizontal (threshold 50px)
- Snap: Centra automáticamente en soltar
- Dots: Clicables para saltar a categoría

---

## 🖥️ DESKTOP

### Comportamiento
```
INICIAL (5 categorías):
← │ [Dermo] [Cuidado F.] [Cuidado C.] [Naturales] │ →

DESPUÉS DE CLIC →:
  │ [Cuidado F.] [Cuidado C.] [Naturales] [Capilares] │

FINAL:
  │ [Cuidado C.] [Naturales] [Capilares] │ ←
```

**Especificaciones**:
- Muestra: **4 categorías** por defecto
- Ancho tarjeta: Automático (responsive grid)
- Gap: **24px** entre tarjetas
- Navegación: 1 categoría por clic
- Flechas: Solo visibles si hay más categorías
- Transición: **300ms** suave

### Layout Grid
```
┌─────────────────────────────────────────────────────┐
│ Mejores Ofertas                         Ver todo    │
├─────────────────────────────────────────────────────┤
│ ← │ [Cat 1]  [Cat 2]  [Cat 3]  [Cat 4] │ →        │
│    │ [2x2]    [2x2]    [2x2]    [2x2]   │         │
│    │ 4 prod.  4 prod.  4 prod.  4 prod. │         │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Estructura Interna de Cada Tarjeta

### CategoryCard (Tarjeta Gris)
```
┌─────────────────────────────────────┐
│ HEADER                              │ ← 48px altura
│ ┌─────────────────────────────────┐ │
│ │ Título Categoría   Ver todo      │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ GRID BODY                           │
│ ┌────────────────┬────────────────┐ │
│ │                │                │ │ ← 120px x 2
│ │ MiniProduct 1  │ MiniProduct 2  │ │
│ │                │                │ │
│ ├────────────────┼────────────────┤ │
│ │                │                │ │
│ │ MiniProduct 3  │ MiniProduct 4  │ │
│ │                │                │ │
│ └────────────────┴────────────────┘ │
│                                     │ ← Padding: 12px
└─────────────────────────────────────┘
  ↑
  Fondo: #f2f8fd (gris azulado claro)
```

### MiniProductCard (Tarjeta Blanca)
```
┌──────────────────┐
│  [♡ botón]      │ ← 32x32px, esquina superior derecha
│                  │
│   [IMAGEN]       │ ← 120px altura, object-fit: contain
│                  │
├──────────────────┤
│ $49990⁸⁰         │ ← Precio sin "Ahora"
│ Crema Hidrat...  │ ← 1 línea máx, truncado
└──────────────────┘
  ↑
  Borde: #e0e0e0
  Padding: 8px
```

---

## 🔄 Flujo de Componentes

```
BestOffers
├── [MÓVIL] Carrusel con swipe
│   ├── for each category:
│   │   └── CategoryCard
│   │       └── MiniProductCard (4x)
│   └── Dots indicadores
│
└── [DESKTOP] Grid con flechas
    ├── PrevButton
    ├── Grid 4 columnas:
    │   └── CategoryCard (×4)
    │       └── MiniProductCard (4x)
    └── NextButton
```

---

## 📐 Dimensiones Exactas

| Elemento | Móvil | Desktop |
|----------|-------|---------|
| Tarjeta contenedora ancho | 85-90vw | Auto (~350px) |
| Tarjeta contenedora gap | - | 24px |
| Grid productos cols | 2 | 2 |
| Imagen producto altura | 120px | 120px |
| Total tarjeta altura | ~250px | ~250px |
| Header altura | 48px | 48px |
| Botón favorito | 32px | 32px |

---

## 🎯 Estados de Interacción

### Hover Tarjeta (Desktop)
```
NORMAL:                          HOVER:
┌─────────────────────┐         ┌─────────────────────┐
│ Categoría           │         │ Categoría           │
│ (Shadow: none)      │  ──→    │ (Shadow: 4px 12px)  │
└─────────────────────┘         └─────────────────────┘
```

### Hover MiniProductCard
```
Box-shadow: 0 2px 6px rgba(0,0,0,0.1)
Escala imagen: +5% (transform: scale(1.05))
```

### Hover Link "Ver todo"
```
Color: #0071ce  ──→  Color: #0056a3
```

### Hover Botón Favoritos
```
Border: #d0d0d0  ──→  Border: #0F7F0F
```

---

## 💾 Estructura de Datos

```javascript
// INPUT a BestOffers
[
  {
    categoryName: "Dermocosméticos",
    categorySlug: "dermocosmeticos",
    linkToAll: "/categoria/Dermocosméticos",
    products: [
      {
        id, slug, name, price,
        image, images, stock,
        oldPrice, popularity, ...
      },
      // ... 3 más
    ]
  },
  // ... 4 más
]
```

---

## 🔄 Responsive Breakpoints

| Breakpoint | Ancho | Productos Visibles | Navegación |
|-----------|-------|---|---|
| Móvil | < 768px | 1 tarjeta | Swipe + Dots |
| Tablet | 768px - 1023px | 2-3 tarjetas | Flechas |
| Desktop Mediano | 1024px - 1279px | 4 tarjetas | Flechas |
| Desktop Grande | ≥ 1280px | 5 tarjetas | Flechas |

---

## ✨ Características Especiales

✅ **Scroll Snap (Móvil)**: `scroll-snap-type: x mandatory` + `scroll-snap-stop: always`
✅ **Touch Optimizado**: `-webkit-overflow-scrolling: touch`
✅ **Transiciones Suaves**: `duration-300` en todos los cambios
✅ **Indicadores Dinámicos**: Dots que reflejan posición actual
✅ **Botones Contextuales**: Flechas solo se muestran si necesarias
✅ **Links Accesibles**: aria-labels en todos los botones

---

## 🚀 Performance

- **Lazy Loading**: Componentes sin lazy loading (no son pesados)
- **Renderizado**: Solo renderiza categorías visibles
- **CSS**: Clases Tailwind optimizadas
- **Imágenes**: Next Image con optimization automático

---

**Versión**: 2.0 - Tarjetas de Categoría Tipo Walmart
**Última actualización**: 27 Enero 2026
