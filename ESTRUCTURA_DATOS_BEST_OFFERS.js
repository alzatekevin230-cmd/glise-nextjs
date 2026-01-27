/**
 * ESTRUCTURA DE DATOS - MEJORES OFERTAS v2.0
 * Ejemplo completo de cómo se estructura y agrupa los datos
 */

// ============================================================
// INPUT: Array de productos desde Firestore
// ============================================================
const allProducts = [
  {
    id: "dermo-1",
    slug: "crema-facial-hidratante",
    name: "Crema Facial Hidratante Premium",
    category: "Dermocosméticos",
    price: 49990,
    image: "/img/dermocos-1.jpg",
    images: ["/img/dermocos-1.jpg"],
    stock: 15,
    oldPrice: 79990,
    popularity: 85
  },
  {
    id: "dermo-2",
    slug: "serum-antienvejecimiento",
    name: "Sérum Antienvejecimiento Activo",
    category: "Dermocosméticos",
    price: 59990,
    image: "/img/dermocos-2.jpg",
    images: ["/img/dermocos-2.jpg"],
    stock: 12,
    oldPrice: 89990,
    popularity: 90
  },
  // ... más productos
];

// ============================================================
// PROCESSING: Agrupación en page.js
// ============================================================
const mainCategories = [
  'Dermocosméticos',
  'Cuidado Facial',
  'Cuidado Corporal',
  'Naturales y Homeopáticos',
  'Capilares'
];

const categoryGroupedProducts = mainCategories.map(categoryName => {
  const categoryProducts = allProducts
    .filter(p => {
      if (!p.stock) return false;
      if (p.category !== categoryName) return false;
      return true;
    })
    .sort((a, b) => {
      // Priorizar productos en oferta
      const aDiscount = (a.oldPrice || a.originalPrice || 0) - a.price;
      const bDiscount = (b.oldPrice || b.originalPrice || 0) - b.price;
      if (aDiscount !== bDiscount) return bDiscount - aDiscount;
      // Luego por popularidad
      return (b.popularity || 0) - (a.popularity || 0);
    })
    .slice(0, 4) // Exactamente 4 productos
    .map(p => ({
      ...p,
      oldPrice: p.oldPrice || p.originalPrice || (p.price * 1.15)
    }));

  return {
    categoryName,
    categorySlug: categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''),
    linkToAll: `/categoria/${encodeURIComponent(categoryName)}`,
    products: categoryProducts
  };
}).filter(group => group.products.length > 0);

// ============================================================
// OUTPUT: Estructura pasada a BestOffers
// ============================================================
const expectedOutput = [
  {
    categoryName: "Dermocosméticos",
    categorySlug: "dermocosmeticos",
    linkToAll: "/categoria/Dermocosméticos",
    products: [
      {
        id: "dermo-1",
        slug: "crema-facial-hidratante",
        name: "Crema Facial Hidratante Premium",
        category: "Dermocosméticos",
        price: 49990,
        image: "/img/dermocos-1.jpg",
        images: ["/img/dermocos-1.jpg"],
        stock: 15,
        oldPrice: 79990,
        popularity: 85
      },
      {
        id: "dermo-2",
        slug: "serum-antienvejecimiento",
        name: "Sérum Antienvejecimiento Activo",
        category: "Dermocosméticos",
        price: 59990,
        image: "/img/dermocos-2.jpg",
        images: ["/img/dermocos-2.jpg"],
        stock: 12,
        oldPrice: 89990,
        popularity: 90
      },
      {
        id: "dermo-3",
        slug: "mascarilla-hidratante",
        name: "Mascarilla Hidratante Nocturna",
        category: "Dermocosméticos",
        price: 39990,
        image: "/img/dermocos-3.jpg",
        images: ["/img/dermocos-3.jpg"],
        stock: 20,
        oldPrice: 59990,
        popularity: 75
      },
      {
        id: "dermo-4",
        slug: "contorno-ojos",
        name: "Contorno de Ojos Corrector",
        category: "Dermocosméticos",
        price: 44990,
        image: "/img/dermocos-4.jpg",
        images: ["/img/dermocos-4.jpg"],
        stock: 8,
        oldPrice: 69990,
        popularity: 80
      }
    ]
  },
  {
    categoryName: "Cuidado Facial",
    categorySlug: "cuidado-facial",
    linkToAll: "/categoria/Cuidado%20Facial",
    products: [
      // ... 4 productos de esta categoría
    ]
  },
  {
    categoryName: "Cuidado Corporal",
    categorySlug: "cuidado-corporal",
    linkToAll: "/categoria/Cuidado%20Corporal",
    products: [
      // ... 4 productos de esta categoría
    ]
  },
  {
    categoryName: "Naturales y Homeopáticos",
    categorySlug: "naturales-y-homeopaticos",
    linkToAll: "/categoria/Naturales%20y%20Homeopáticos",
    products: [
      // ... 4 productos de esta categoría
    ]
  },
  {
    categoryName: "Capilares",
    categorySlug: "capilares",
    linkToAll: "/categoria/Capilares",
    products: [
      // ... 4 productos de esta categoría
    ]
  }
];

// ============================================================
// RENDERIZADO JERÁRQUICO
// ============================================================
/**
 * BestOffers recibe: Array de 5 categorías
 *
 * Para cada categoría:
 *   → CategoryCard recibe: { categoryName, linkToAll, products }
 *       Para cada producto en la categoría (4 productos):
 *         → MiniProductCard recibe: { product }
 *
 * Resultado visual:
 *
 * MÓVIL (1 tarjeta visible, 85-90% ancho, swipe):
 * ┌────────────────────────────────────┐
 * │ Dermocosméticos         Ver todo   │
 * ├────────────────────────────────────┤
 * │ ┌───────────┐ ┌───────────┐      │
 * │ │ Prod 1    │ │ Prod 2    │      │
 * │ │ $49990⁸⁰  │ │ $59990⁸⁰  │      │
 * │ │ Crema...  │ │ Sérum...  │      │
 * │ ├───────────┤ ├───────────┤      │
 * │ │ Prod 3    │ │ Prod 4    │      │
 * │ │ $39990⁸⁰  │ │ $44990⁸⁰  │      │
 * │ │ Mascarill │ │ Contorno  │      │
 * │ └───────────┘ └───────────┘      │
 * └────────────────────────────────────┘
 * • ○ ○ ○ ○ (indicadores)
 *
 * DESKTOP (múltiples tarjetas, grid automático):
 * ← │[Dermocos][Cuidado Facial][Corporal][Naturales]│ →
 *    Cada una con su grid 2x2
 */

export { categoryGroupedProducts };
