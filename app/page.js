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

// Lazy load de componentes pesados con Swiper (sin ssr: false en Next.js 15)
const ShopByBrand = dynamic(() => import('@/components/ShopByBrand'), { loading: () => <div className="h-64" /> });
const RecommendedProducts = dynamic(() => import('@/components/RecommendedProducts'), { loading: () => <div className="h-64" /> });
const GliseProducts = dynamic(() => import('@/components/GliseProducts'), { loading: () => <div className="h-64" /> });
const NaturalProductsSection = dynamic(() => import('@/components/NaturalProductsSection'), { loading: () => <div className="h-64" /> });
const ArticulosBlog = dynamic(() => import('@/components/ArticulosBlog'), { loading: () => <div className="h-64" /> });
const ProductosVistosRecientemente = dynamic(() => import('@/components/ProductosVistosRecientemente'), { loading: () => <div className="h-32" /> });

// ISR: Revalidar cada 10 minutos (página principal)
export const revalidate = 600;

export default async function HomePage() {
  const { products: allProducts, blogPosts } = await getHomePageData();

  const featuredProductsData = allProducts.filter(p => [143, 58, 123, 74, 95, 7, 183, 151].includes(p.id));
  const gliseProductsData = allProducts.filter(p => p.laboratorio === 'GLISÉ');
  const naturalProductsData = allProducts.filter(p => p.category === 'Naturales y Homeopáticos');

  return (
    <main>
      {/* Breadcrumbs puede ir aquí si se usa en home en el futuro */}
      <div className="container mx-auto px-2 sm:px-6 pt-4 mb-8">

        {/* Barra de Contacto para Escritorio */}
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
      <MobilePromo />
      <FeaturedCategories />
      <BestOffers />
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