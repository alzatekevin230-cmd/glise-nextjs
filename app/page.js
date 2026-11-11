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
import Link from 'next/link';

export const metadata = {
  alternates: {
    canonical: 'https://glise.com.co'
  }
};

// Este es el esqueleto de carga elegante (Skeleton Loader)
const SectionSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-md w-48 mb-6 mx-auto sm:mx-0"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[300px] flex flex-col">
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

// Las cargas dinámicas usando el nuevo esqueleto
const ShopByBrand = dynamic(() => import('@/components/ShopByBrand'), { loading: () => <SectionSkeleton /> });
const RecommendedProducts = dynamic(() => import('@/components/RecommendedProducts'), { loading: () => <SectionSkeleton /> });
const GliseProducts = dynamic(() => import('@/components/GliseProducts'), { loading: () => <SectionSkeleton /> });
const NaturalProductsSection = dynamic(() => import('@/components/NaturalProductsSection'), { loading: () => <SectionSkeleton /> });
const ArticulosBlog = dynamic(() => import('@/components/ArticulosBlog'), { loading: () => <SectionSkeleton /> });
const ProductosVistosRecientemente = dynamic(() => import('@/components/ProductosVistosRecientemente'), { loading: () => <SectionSkeleton /> });

// Caché de 24 horas (se actualiza al instante con /api/actualizar o al vender en Wompi)
export const revalidate = 86400;

export default async function HomePage() {
  const { products: allProducts, blogPosts } = await getHomePageData();

  // Versión ligera de productos (sin descripciones pesadas) para reducir uso de CPU y memoria
  const lightProducts = allProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.oldPrice || p.originalPrice || null,
    originalPrice: p.originalPrice || null,
    image: p.image,
    images: Array.isArray(p.images) && p.images.length > 0 ? [p.images[0]] : [],
    stock: p.stock,
    category: p.category,
    laboratorio: p.laboratorio,
    popularity: p.popularity || 0,
    isNew: p.isNew || false
  }));

  const mainCategories = [
    { label: 'Dermocosméticos', filter: 'Dermocosméticos' },
    { label: 'Infantil', filter: 'Cuidado Infantil' },
    { label: 'Milenario', filter: 'Milenario' },
    { label: 'Belleza', filter: 'Cuidado y Belleza' },
    { label: 'Naturales y Homeopáticos', filter: 'Naturales y Homeopáticos' }
  ];

  const categoryGroupedProducts = mainCategories.map(({ label, filter }) => {
    const categoryProducts = lightProducts
      .filter(p => {
        if (!p.stock) return false;
        if (p.category !== filter) return false;
        return true;
      })
      .sort((a, b) => {
        const aDiscount = (a.oldPrice || a.originalPrice || 0) - a.price;
        const bDiscount = (b.oldPrice || b.originalPrice || 0) - b.price;
        if (aDiscount !== bDiscount) return bDiscount - aDiscount;
        return (b.popularity || 0) - (a.popularity || 0);
      })
      .slice(0, 4)
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
  }).filter(group => group.products.length > 0);

  const bestOffersProducts = categoryGroupedProducts;
  const featuredProductsData = lightProducts.filter(p => [143, 58, 123, 74, 95, 7, 183, 151].includes(Number(p.id)));
  const gliseProductsData = lightProducts.filter(p => p.laboratorio === 'GLISÉ');
  const naturalProductsData = lightProducts.filter(p => p.category === 'Naturales y Homeopáticos');

  const orangeOilProduct = lightProducts
    .filter(p => p.name.toLowerCase().includes('naranja') && p.stock > 0)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0] ||
    lightProducts.find(p => p.category === 'Milenario' && p.stock > 0);

  const naturalesProduct = lightProducts
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
      <FeaturedCategories />
      <MobilePromo milenarioProduct={orangeOilProduct} naturalesProduct={naturalesProduct} />

      <BestOffers products={bestOffersProducts} />

      <ShopByBrand />
      <FeaturedProductsBanner />
      <RecommendedProducts products={featuredProductsData} />
      <GliseProductsBanner />
      <GliseProducts products={gliseProductsData} />
      <NaturalProductsSection products={naturalProductsData} />

      <div className="container mx-auto px-2 sm:px-6">
        <ProductosVistosRecientemente allProducts={lightProducts} />
      </div>

      <ArticulosBlog posts={blogPosts} />
    </main>
  );
}