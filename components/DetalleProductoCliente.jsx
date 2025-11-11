// components/DetalleProductoCliente.jsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useCarrito } from '@/contexto/ContextoCarrito';
import { useProductos } from '@/contexto/ContextoProductos';
import toast from 'react-hot-toast';
import ProductosRelacionados from './ProductosRelacionados';
import ProductosVistosRecientemente from './ProductosVistosRecientemente';
import { useModal } from '@/contexto/ContextoModal';
import ImageWithZoom from './ImageWithZoom';
import ResenasProducto from './ResenasProducto';
import Breadcrumbs from './Breadcrumbs';

// Ayudante para detectar tamaño de pantalla
import { useWindowSize } from './hooks/useWindowSize';
import { FaTruck, FaChevronDown, FaShippingFast, FaGift, FaShieldAlt, FaUndo, FaArrowRight, FaChevronLeft, FaChevronRight, FaShoppingCart, FaSpinner } from 'react-icons/fa';

// Componente de información de envío mejorado
const EnvioInfoAccordion = () => (
  <div className="my-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-sm">
    <details className="group">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <FaTruck className="text-cyan-600 text-xl" />
          <span className="text-lg font-semibold text-gray-800">Información de envío y garantías</span>
        </div>
        <FaChevronDown className="icon-arrow text-cyan-600 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <FaShippingFast className="text-blue-600 mt-1 text-lg flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">Envíos a todo Colombia</p>
              <p className="text-sm text-gray-600">Entrega en 2-5 días hábiles (principales ciudades)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaGift className="text-green-600 mt-1 text-lg flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-600">Envío GRATIS</p>
              <p className="text-sm text-gray-600">En compras superiores a $250.000</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-cyan-600 mt-1 text-lg flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">Compra 100% segura</p>
              <p className="text-sm text-gray-600">Garantía de satisfacción de 30 días</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaUndo className="text-purple-600 mt-1 text-lg flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">Devoluciones fáciles</p>
              <p className="text-sm text-gray-600">Si no estás satisfecho, te devolvemos tu dinero</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-blue-200">
          <a href="/politica-devoluciones" className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-2 font-medium transition-colors">
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
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  const getInitialImages = useCallback(() => {
    if (!product) return { all: [] };
    const all = [product.image, ...(product.images || [])].filter(Boolean);
    return { all };
  }, [product]);

  const { all: allImages } = getInitialImages();
  const [activeImage, setActiveImage] = useState(allImages.length > 0 ? allImages[0] : 'https://placehold.co/600x600');
  const [quantity, setQuantity] = useState(1);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(true);

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
  // === LÓGICA DE CARRITO Y CANTIDAD (MEJORADA CON LOADING) ===
  // ================================================================
  const handleAddToCart = useCallback(async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
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
    } finally {
      setIsAddingToCart(false);
    }
  }, [agregarAlCarrito, product, quantity, isAddingToCart]);

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
  
  // Lógica de flechas para la VISTA DE ESCRITORIO (optimizada)
  const handleNextImage = useCallback(() => {
      const activeImageIndex = allImages.findIndex(img => img === activeImage);
      const nextIndex = (activeImageIndex + 1) % allImages.length;
      setActiveImage(allImages[nextIndex]);
  }, [allImages, activeImage]);

  const handlePrevImage = useCallback(() => {
      const activeImageIndex = allImages.findIndex(img => img === activeImage);
      const prevIndex = (activeImageIndex - 1 + allImages.length) % allImages.length;
      setActiveImage(allImages[prevIndex]);
  }, [allImages, activeImage]);

  if (!product) return <div>Cargando detalles del producto...</div>;

  // components/DetalleProductoCliente.jsx

  const renderGallery = () => {
    if (width === undefined) {
      return <div className="w-full aspect-square bg-gray-100 rounded-lg"></div>; // Placeholder
    }

    if (isDesktop) {
      // ================================================================
      // === VERSIÓN PARA ESCRITORIO (MEJORADA CON INDICADORES NUMÉRICOS) ===
      // ================================================================
      return (
        <div className="flex-grow flex flex-col">
          <div className="relative w-full group">
            <ImageWithZoom src={activeImage} alt={product.name} openLightbox={handleOpenLightbox} priority />

            {/* Indicador numérico mejorado */}
            {allImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {allImages.findIndex(img => img === activeImage) + 1} / {allImages.length}
              </div>
            )}

            {/* Puntos mejorados con mejor accesibilidad */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 rounded-full px-3 py-2 backdrop-blur-sm">
                {allImages.map((imgSrc, index) => (
                  <button
                    key={imgSrc}
                    onClick={() => setActiveImage(imgSrc)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      imgSrc === activeImage
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Ir a la imagen ${index + 1} de ${allImages.length}`}
                  />
                ))}
              </div>
            )}

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  aria-label="Imagen anterior"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  aria-label="Siguiente imagen"
                >
                  <FaChevronRight />
                </button>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes */}
        <div className="flex flex-col gap-4">
          {allImages.length > 1 && (
            <div className="hidden lg:flex flex-col gap-3">
              {allImages.map((imgSrc) => (
                <Thumbnail
                  key={imgSrc}
                  src={imgSrc}
                  isActive={imgSrc === activeImage}
                  onClick={() => setActiveImage(imgSrc)}
                />
              ))}
            </div>
          )}
          {renderGallery()}
          {allImages.length > 1 && (
            <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((imgSrc) => (
                <Thumbnail
                  key={imgSrc}
                  src={imgSrc}
                  isActive={imgSrc === activeImage}
                  onClick={() => setActiveImage(imgSrc)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col space-y-8">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">{product.category}</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{product.name}</h1>
            <div className="mb-8">
              <span className="text-4xl lg:text-5xl font-bold text-blue-600">{formatPrice(product.price)}</span>
            </div>
          </div>

          <EnvioInfoAccordion />

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Descripción</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Detalles del producto</h3>
              <div className="space-y-3">
                {product.laboratorio && <DetailRow label="Laboratorio" value={product.laboratorio} />}
                {product.viaAdministracion && <DetailRow label="Vía de administración" value={product.viaAdministracion} />}
                {product.presentacionFarmaceutica && <DetailRow label="Presentación" value={product.presentacionFarmaceutica} />}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xl">
                {product.stock > 0 ? (
                  product.stock <= 10 ? (
                    <p className="font-bold text-blue-600 text-xl">¡Quedan solo {product.stock} unidades!</p>
                  ) : (
                    <p className="font-bold text-green-600 text-xl">En stock</p>
                  )
                ) : (
                  <p className="font-bold text-red-600 text-xl">Agotado</p>
                )}
              </div>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4 md:gap-6">
                <div className="quantity-selector flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="quantity-btn w-12 h-12 md:w-10 md:h-10 text-xl md:text-lg font-bold"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="quantity-input w-16 h-12 md:w-12 md:h-10 text-xl md:text-lg font-bold flex items-center justify-center" aria-label={`Cantidad: ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="quantity-btn w-12 h-12 md:w-10 md:h-10 text-xl md:text-lg font-bold"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`flex-grow bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed transition-all flex items-center justify-center text-xl gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 ring-4 ring-yellow-400 ring-opacity-75 animate-pulse`}
                  aria-label={isAddingToCart ? "Agregando al carrito..." : "Agregar al carrito"}
                >
                  {isAddingToCart ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaShoppingCart />
                  )}
                  {isAddingToCart ? "Agregando..." : "Agregar al Carrito"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secciones relacionadas */}
      <div className="mt-16 space-y-16">
        <ProductosRelacionados products={relatedProducts} />
        <ProductosVistosRecientemente currentProductId={product.id} allProducts={allProducts} />
        <ResenasProducto productId={product.id} />
      </div>
    </>
  );
}