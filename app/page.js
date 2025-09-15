// app/page.js
import { getHomePageData } from "@/lib/data";
import MainBanner from "@/components/MainBanner";
import MobilePromo from "@/components/MobilePromo";
import FeaturedCategories from "@/components/FeaturedCategories";
import BestOffers from "@/components/BestOffers";
import ShopByBrand from "@/components/ShopByBrand";
import FeaturedProductsBanner from "@/components/FeaturedProductsBanner";
import RecommendedProducts from "@/components/RecommendedProducts";
import GliseProductsBanner from "@/components/GliseProductsBanner";
import GliseProducts from "@/components/GliseProducts";
import NaturalProductsSection from "@/components/NaturalProductsSection";
import ArticulosBlog from "@/components/ArticulosBlog";
import ProductosVistosRecientemente from "@/components/ProductosVistosRecientemente"; 

export default async function HomePage() {
  const { products: allProducts, blogPosts } = await getHomePageData();

  const featuredProductsData = allProducts.filter(p => [143, 58, 123, 74, 95, 7, 183, 151].includes(p.id));
  const gliseProductsData = allProducts.filter(p => p.laboratorio === 'GLISÉ');
  const naturalProductsData = allProducts.filter(p => p.category === 'Naturales y Homeopáticos');

  return (
    <>
      <main>
        {/* --- INICIO DE LA CORRECCIÓN DE ESPACIADO --- */}
        {/* Cambiamos py-8 (padding arriba y abajo) por pt-8 (solo padding arriba) y mb-8 (margen abajo) */}
        <div className="container mx-auto px-2 sm:px-6 pt-8 mb-8">
          
          {/* Barra de Contacto para Escritorio */}
          <div className="hidden md:flex bg-cyan-600 text-white text-sm mb-4 rounded-lg shadow-md items-center justify-center text-center p-2">
            <div className="flex items-center gap-2">
              <i className="fas fa-comment-dots"></i>
              <span className="font-medium">¿Tienes dudas? Escríbenos y estaremos encantados de ayudarte</span>
              <a href="https://wa.me/573217973158" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 ml-4 font-bold hover:underline">
                <i className="fab fa-whatsapp"></i>
                ¡Chatea ahora!
              </a>
            </div>
          </div>
          
          <MainBanner />

        </div>
        {/* --- FIN DE LA CORRECCIÓN --- */}

        <MobilePromo />
        <FeaturedCategories />
        <BestOffers />
        <ShopByBrand />
        <FeaturedProductsBanner />
        <RecommendedProducts products={featuredProductsData} />
        <GliseProductsBanner />
        <GliseProducts products={gliseProductsData} />
        <NaturalProductsSection products={naturalProductsData} />
        <ProductosVistosRecientemente allProducts={allProducts} />
        <ArticulosBlog posts={blogPosts} />
      </main>
    </>
  );
}