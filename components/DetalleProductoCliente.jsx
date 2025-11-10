// components/DetalleProductoCliente.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useProductos } from '@/contexto/ContextoProductos';
import toast from 'react-hot-toast';
import ProductosRelacionados from './ProductosRelacionados';
import ProductosVistosRecientemente from './ProductosVistosRecientemente';
import { useModal } from '@/contexto/ContextoModal';
import { useFavorites } from '@/hooks/useFavorites';
import ImageWithZoom from './ImageWithZoom';
import ResenasProducto from './ResenasProducto';
import Breadcrumbs from './Breadcrumbs';

// Ayudante para detectar tamaño de pantalla
import { useWindowSize } from './hooks/useWindowSize';
import { FaTruck, FaChevronDown, FaShippingFast, FaGift, FaShieldAlt, FaUndo, FaArrowRight, FaChevronLeft, FaChevronRight, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';

// Componente de información de envío
const EnvioInfoAccordion = () => (
  <div className="my-4">
    <details className="shipping-policy-accordion">
      <summary className="shipping-policy-title">
        <FaTruck className="mr-3 text-cyan-600" />
        <span>Información de envío y garantías</span>
        <FaChevronDown className="icon-arrow" />
      </summary>
      <div className="shipping-policy-content">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FaShippingFast className="text-blue-600 mt-1 text-lg" />
            <div>
              <p className="font-semibold text-gray-800">Envíos a todo Colombia</p>
              <p className="text-sm text-gray-600">Entrega en 2-5 días hábiles (principales ciudades)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <FaGift className="text-green-600 mt-1 text-lg" />
            <div>
              <p className="font-semibold text-green-600">Envío GRATIS</p>
              <p className="text-sm text-gray-600">En compras superiores a $250.000</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-cyan-600 mt-1 text-lg" />
            <div>
              <p className="font-semibold text-gray-800">Compra 100% segura</p>
              <p className="text-sm text-gray-600">Garantía de satisfacción de 30 días</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaUndo className="text-purple-600 mt-1 text-lg" />
            <div>
              <p className="font-semibold text-gray-800">Devoluciones fáciles</p>
              <p className="text-sm text-gray-600">Si no estás satisfecho, te devolvemos tu dinero</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a href="/politica-devoluciones" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2">
            Ver política completa de envíos y devoluciones
            <FaArrowRight />
          </a>
        </div>
      </div>
    </details>
  </div>
);

// Componentes del carrusel (solo para móvil)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// --- COMPONENTES AUXILIARES (NO CAMBIAN) ---
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-800 text-right uppercase">{value}</span>
  </div>
);
const Thumbnail = ({ src, isActive, onClick }) => (
    <div className={`relative w-20 h-20 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? 'border-blue-600' : 'border-transparent hover:border-gray-400'}`} onClick={onClick}>
        <Image src={src} alt="miniatura de producto" fill sizes="80px" className="object-cover rounded-md" />
    </div>
);
const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

export default function DetalleProductoCliente({ product, relatedProducts }) {
  const { agregarAlCarrito, MAX_QUANTITY_PER_ITEM } = useCarrito();
  const { openLightbox } = useModal();
  const { allProducts, loadProducts } = useProductos();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  
  const favorite = isFavorite(product.id);

  const getInitialImages = () => {
    if (!product) return { all: [] };
    const all = [product.image, ...(product.images || [])].filter(Boolean);
    return { all };
  };

  const { all: allImages } = getInitialImages();
  const [activeImage, setActiveImage] = useState(allImages.length > 0 ? allImages[0] : 'https://placehold.co/600x600');
  const [quantity, setQuantity] = useState(1);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Cargar productos para el carrusel de vistos recientemente
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (product && product.id) {
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedIds = [product.id, ...viewedIds.filter(id => String(id) !== String(product.id))].slice(0, 20);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedIds));
      const newImages = [product.image, ...(product.images || [])].filter(Boolean);
      if (newImages.length > 0) setActiveImage(newImages[0]);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!isDesktop && swiperInstance && allImages.length > 0) {
      const activeIndex = allImages.findIndex(img => img === activeImage);
      if (swiperInstance.realIndex !== activeIndex && activeIndex !== -1) {
        swiperInstance.slideToLoop(activeIndex);
      }
    }
  }, [activeImage, allImages, swiperInstance, isDesktop]);

  // Helper para abrir lightbox con todas las imágenes
  const handleOpenLightbox = (imageUrl) => {
    openLightbox(imageUrl, allImages);
  };

  // ================================================================
  // === LÓGICA DE CARRITO Y CANTIDAD (AHORA COMPLETA) ===
  // ================================================================
  const handleAddToCart = () => {
    const result = agregarAlCarrito({ ...product }, quantity);
    
    if (result.success) {
      toast.success(result.isNew ? `🛒 ${quantity}x ${product.name} añadido al carrito!` : `✅ Cantidad actualizada en el carrito`, {
        duration: 2500,
        style: {
          background: '#22c55e',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
      // Resetear cantidad a 1 después de agregar
      setQuantity(1);
    } else if (result.reason === 'max_limit') {
      toast.error(`⚠️ Máximo ${result.max} unidades por producto en el carrito`, {
        duration: 3000,
      });
    }
  };

  const increaseQuantity = () => {
      const maxLimit = Math.min(product.stock, MAX_QUANTITY_PER_ITEM);
      
      if(quantity < maxLimit) {
          setQuantity(q => q + 1);
      } else if (quantity >= MAX_QUANTITY_PER_ITEM) {
          toast.error(`⚠️ Máximo ${MAX_QUANTITY_PER_ITEM} unidades por producto`, {
            duration: 2000,
          });
      } else {
          toast.error(`Solo quedan ${product.stock} unidades en stock`, {
            duration: 2000,
          });
      }
  };
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  
  // Lógica de flechas para la VISTA DE ESCRITORIO
  const handleNextImage = () => {
      const activeImageIndex = allImages.findIndex(img => img === activeImage);
      const nextIndex = (activeImageIndex + 1) % allImages.length;
      setActiveImage(allImages[nextIndex]);
  };
  const handlePrevImage = () => {
      const activeImageIndex = allImages.findIndex(img => img === activeImage);
      const prevIndex = (activeImageIndex - 1 + allImages.length) % allImages.length;
      setActiveImage(allImages[prevIndex]);
  };

  if (!product) return <div>Cargando detalles del producto...</div>;

  // components/DetalleProductoCliente.jsx

  const renderGallery = () => {
    if (width === undefined) {
      return <div className="w-full aspect-square bg-gray-100 rounded-lg"></div>; // Placeholder
    }

    if (isDesktop) {
      // ================================================================
      // === VERSIÓN PARA ESCRITORIO (AHORA CON PUNTOS PERSONALIZADOS) ===
      // ================================================================
      return (
        <div className="flex-grow flex flex-col">
          <div className="relative w-full group">
            <ImageWithZoom src={activeImage} alt={product.name} openLightbox={handleOpenLightbox} priority />
            
            {/* --- INICIO DEL CÓDIGO PARA LOS PUNTOS --- */}
            {allImages.length > 1 && (
              <div className="custom-dots-container">
                {allImages.map((imgSrc) => (
                  <button
                    key={imgSrc}
                    onClick={() => setActiveImage(imgSrc)}
                    className={`custom-dot ${imgSrc === activeImage ? 'active' : ''}`}
                    aria-label={`Ir a la imagen ${allImages.indexOf(imgSrc) + 1}`}
                  />
                ))}
              </div>
            )}
            {/* --- FIN DEL CÓDIGO PARA LOS PUNTOS --- */}

            {allImages.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" aria-label="Imagen anterior"><FaChevronLeft /></button>
                <button onClick={handleNextImage} className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" aria-label="Siguiente imagen"><FaChevronRight /></button>
              </>
            )}
          </div>
        </div>
      );
    } else {
      // ============================================================
      // === VERSIÓN PARA MÓVIL (SIN CAMBIOS) ===
      // ============================================================
      return (
        <div className="flex-1">
          <div className="relative w-full aspect-square group">
            <Swiper modules={[Pagination]} pagination={{ clickable: true }} loop={allImages.length > 1} onSwiper={setSwiperInstance} onSlideChange={(swiper) => { if (allImages.length > 0) setActiveImage(allImages[swiper.realIndex]); }} allowTouchMove={allImages.length > 1} className="product-gallery-carousel h-full">
              {allImages.map((imgSrc) => (
                <SwiperSlide key={imgSrc} className="h-full"><ImageWithZoom src={imgSrc} alt={`${product.name}`} openLightbox={handleOpenLightbox} priority={imgSrc === allImages[0]} /></SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      );
    }
  };

  // Generar breadcrumbs para la página de producto
  // Elimina todo el código relacionado con Breadcrumbs y breadcrumbItems
  // El render retorna ahora desde <div className="grid grid-cols-1 md:flex ..."> en adelante, sin el <Breadcrumbs ... />

  return (
    <>
      <div className="grid grid-cols-1 md:flex md:gap-12 md:items-start">
        <div className="md:w-1/2 flex flex-col md:flex-row gap-4"> 
          {allImages.length > 1 && (
            <div className="hidden md:flex flex-col gap-3">
              {allImages.map((imgSrc) => (<Thumbnail key={imgSrc} src={imgSrc} isActive={imgSrc === activeImage} onClick={() => setActiveImage(imgSrc)} />))}
            </div>
          )}
          {renderGallery()}
          {allImages.length > 1 && (
            <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((imgSrc) => (<Thumbnail key={imgSrc} src={imgSrc} isActive={imgSrc === activeImage} onClick={() => setActiveImage(imgSrc)} />))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:w-1/2">
            <p className="text-sm text-gray-500 uppercase tracking-wider mt-4 md:mt-0">{product.category}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 my-2">{product.name}</h1>
            <div className="my-4">
                <span className="text-3xl lg:text-4xl font-bold text-blue-600">{formatPrice(product.price)}</span>
            </div>
            
            <EnvioInfoAccordion />
            
            <div className="flex-grow my-4 overflow-y-auto pr-2 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            <div className="my-4 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Detalles del producto</h3>
                <div>
                  {product.laboratorio && <DetailRow label="Laboratorio" value={product.laboratorio} />}
                  {product.viaAdministracion && <DetailRow label="Vía de administración" value={product.viaAdministracion} />}
                  {product.presentacionFarmaceutica && <DetailRow label="Presentación" value={product.presentacionFarmaceutica} />}
                </div>
            </div>
            <div className="mt-auto">
                <div className="my-4 text-lg">
                    {product.stock > 0 ? (
                        product.stock <= 10 ? ( <p className="font-semibold text-blue-600 text-right">¡Quedan solo {product.stock} unidades!</p> ) :
                        ( <p className="font-semibold text-green-600">En stock</p> )
                    ) : ( <p className="font-semibold text-red-600">Agotado</p> )}
                </div>
                {product.stock > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="quantity-selector">
                            <button onClick={decreaseQuantity} className="quantity-btn">-</button>
                            <span className="quantity-input">{quantity}</span>
                            <button onClick={increaseQuantity} className="quantity-btn">+</button>
                        </div>
                        <button onClick={handleAddToCart} className="flex-grow bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-lg gap-3">
                            <FaShoppingCart />
                            Agregar al Carrito
                        </button>
                        <button
                            onClick={() => toggleFavorite(product.id)}
                            className="flex-shrink-0 w-14 h-14 rounded-lg font-bold transition-all duration-200 flex items-center justify-center hover:scale-110"
                            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                            {favorite ? (
                                <FaHeart className="text-red-500" style={{width: '28px', height: '28px', minWidth: '28px', minHeight: '28px'}} />
                            ) : (
                                <FaRegHeart className="text-gray-600 hover:text-red-500 transition-colors" style={{width: '28px', height: '28px', minWidth: '28px', minHeight: '28px'}} />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
      <div className="mt-16">
        <ProductosRelacionados products={relatedProducts} />
        <ProductosVistosRecientemente currentProductId={product.id} allProducts={allProducts} />
      </div>
      <ResenasProducto productId={product.id} />
    </>
  );
}