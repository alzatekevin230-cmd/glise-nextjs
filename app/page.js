// app/page.js
import { getHomePageData } from "@/lib/data";
import dynamic from 'next/dynamic';
import MainBanner from "@/components/MainBanner";
import MobilePromo from "@/components/MobilePromo";
import FeaturedCategories from "@/components/FeaturedCategories";
import BestOffers from "@/components/BestOffers";
import FeaturedProductsBanner from "@/components/FeaturedProductsBanner";
import GliseProductsBanner from "@/components/GliseProductsBanner";
import { FaCommentDots, FaWhatsapp } from 'react-icons/fa';

const ShopByBrand = dynamic(() => import('@/components/ShopByBrand'), { loading: () => <div className="h-64" /> });
const RecommendedProducts = dynamic(() => import('@/components/RecommendedProducts'), { loading: () => <div className="h-64" /> });
const GliseProducts = dynamic(() => import('@/components/GliseProducts'), { loading: () => <div className="h-64" /> });
const NaturalProductsSection = dynamic(() => import('@/components/NaturalProductsSection'), { loading: () => <div className="h-64" /> });
const ArticulosBlog = dynamic(() => import('@/components/ArticulosBlog'), { loading: () => <div className="h-64" /> });
const ProductosVistosRecientemente = dynamic(() => import('@/components/ProductosVistosRecientemente'), { loading: () => <div className="h-32" /> });

export const revalidate = 600;

export default async function HomePage() {
  const { products: allProducts, blogPosts } = await getHomePageData();

  // Agrupar productos por categoría para la sección "Mejores Ofertas"
  // Categorías principales reales (en orden)
  // 1) Dermocosméticos
  // 2) Infantil
  // 3) Milenario
  // 4) Belleza
  // 5) Naturales y Homeopáticos
  const mainCategories = [
    { label: 'Dermocosméticos', filter: 'Dermocosméticos' },
    { label: 'Infantil', filter: 'Cuidado Infantil' },
    { label: 'Milenario', filter: 'Milenario' },
    { label: 'Belleza', filter: 'Cuidado y Belleza' },
    { label: 'Naturales y Homeopáticos', filter: 'Naturales y Homeopáticos' }
  ];

  // Crear estructura de categorías con 4 productos cada una
  const categoryGroupedProducts = mainCategories.map(({ label, filter }) => {
    const categoryProducts = allProducts
      .filter(p => {
        if (!p.stock) return false;
        if (p.category !== filter) return false;
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
      .slice(0, 4) // Exactamente 4 productos por categoría
      .map(p => ({
        ...p,
        oldPrice: p.oldPrice || p.originalPrice || (p.price * 1.15)
      }));

    const categoryName = label;

    return {
      categoryName,
      categorySlug: categoryName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      linkToAll: `/categoria/${encodeURIComponent(categoryName)}`,
      products: categoryProducts
    };
  }).filter(group => group.products.length > 0); // Solo mostrar categorías con productos

  const bestOffersProducts = categoryGroupedProducts;

  const featuredProductsData = allProducts.filter(p => [143, 58, 123, 74, 95, 7, 183, 151].includes(p.id));
  const gliseProductsData = allProducts.filter(p => p.laboratorio === 'GLISÉ');
  const naturalProductsData = allProducts.filter(p => p.category === 'Naturales y Homeopáticos');

  // Productos destacados para MobilePromo
  const orangeOilProduct = allProducts
    .filter(p => p.name.toLowerCase().includes('naranja') && p.stock > 0)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0] || 
    allProducts.find(p => p.category === 'Milenario' && p.stock > 0);

  const naturalesProduct = allProducts
    .filter(p => p.category === 'Naturales y Homeopáticos' && p.stock > 0)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0] || null;

  return (
    <main>
      <div className="container mx-auto px-2 sm:px-6 pt-4 mb-0">
        <div className="hidden md:flex bg-cyan-600 text-white text-sm mb-4 rounded-lg shadow-md items-center justify-center text-center p-2">
          <div className="flex items-center gap-2">
            <FaCommentDots />
            <span className="font-medium">¿Tienes dudas? Escríbenos y estaremos encantados de ayudarte</span>
            <a href="https://wa.me/573217973158" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 ml-4 font-bold hover:underline">
              <FaWhatsapp />
              ¡Chatea ahora!
            </a>
          </div>
        </div>

        <div className="mt-4">
          <MainBanner />
        </div>
      </div>

      <MobilePromo milenarioProduct={orangeOilProduct} naturalesProduct={naturalesProduct} />
      <FeaturedCategories />
      
      <BestOffers products={bestOffersProducts} />
      
      <ShopByBrand />
      <FeaturedProductsBanner />
      <RecommendedProducts products={featuredProductsData} />
      <GliseProductsBanner />
      <GliseProducts products={gliseProductsData} />
      <NaturalProductsSection products={naturalProductsData} />
      
      <div className="container mx-auto px-2 sm:px-6">
        <ProductosVistosRecientemente allProducts={allProducts} />
      </div>
      
      <ArticulosBlog posts={blogPosts} />
    </main>
  );
}