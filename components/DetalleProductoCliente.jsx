// components/DetalleProductoCliente.jsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCarrito } from '@/contexto/ContextoCarrito';
import toast from 'react-hot-toast';
import ProductosRelacionados from './ProductosRelacionados';
import VistosRecientemente from './ProductosVistosRecientemente';
import { useModal } from '@/contexto/ContextoModal';
import ImageWithZoom from './ImageWithZoom';
import ResenasProducto from './ResenasProducto';

// --- COMPONENTE AUXILIAR PARA LAS FILAS DE DETALLES ---
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-800 text-right uppercase">{value}</span>
  </div>
);

// --- COMPONENTE AUXILIAR PARA LAS MINIATURAS (THUMBNAILS) ---
const Thumbnail = ({ src, isActive, onClick }) => (
    <div
        className={`relative w-20 h-20 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? 'border-blue-600' : 'border-transparent hover:border-gray-400'}`}
        onClick={onClick}
    >
        <Image
          src={src}
          alt="miniatura de producto"
          fill
          sizes="80px"
          className="object-cover rounded-md"
        />
    </div>
);

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

export default function DetalleProductoCliente({ product, relatedProducts }) {
  const { agregarAlCarrito } = useCarrito();
  const { openLightbox } = useModal();
  
  const getInitialImages = () => {
    if (!product) return { all: [], active: 'https://placehold.co/600x600' };
    
    const all = [product.image, ...(product.images || [])].filter(Boolean);
    const active = all.length > 0 ? all[0] : 'https://placehold.co/600x600';

    return { all, active };
  };

  const { all: allImages, active: initialActiveImage } = getInitialImages();
  const [activeImage, setActiveImage] = useState(initialActiveImage);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.id) {
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedIds = [product.id, ...viewedIds.filter(id => String(id) !== String(product.id))].slice(0, 20);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedIds));
      
      const { active } = getInitialImages();
      setActiveImage(active);
      setQuantity(1);
    }
  }, [product?.id]);

  const handleAddToCart = () => {
    agregarAlCarrito({ ...product, quantity });
    toast.success(`${product.name} añadido al carrito`);
  };

  const increaseQuantity = () => {
      if(quantity < product.stock) {
          setQuantity(q => q + 1);
      } else {
          toast.error(`Solo quedan ${product.stock} unidades en stock.`);
      }
  };
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  
  const activeImageIndex = allImages.findIndex(img => img === activeImage);

  const handleNextImage = () => {
      const nextIndex = (activeImageIndex + 1) % allImages.length;
      setActiveImage(allImages[nextIndex]);
  };

  const handlePrevImage = () => {
      const prevIndex = (activeImageIndex - 1 + allImages.length) % allImages.length;
      setActiveImage(allImages[prevIndex]);
  };

  if (!product) {
    return <div>Cargando detalles del producto...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:flex md:gap-12 md:items-start">
        {/* --- INICIO DE LA GALERÍA DE IMÁGENES --- */}
        <div className="md:w-1/2 flex flex-col md:flex-row gap-4"> 
            {/* Thumbnails Verticales (Visible en Escritorio) */}
            {allImages.length > 1 && (
                <div className="hidden md:flex flex-col gap-3">
                    {allImages.map((imgSrc, index) => (
                        <Thumbnail
                            key={index}
                            src={imgSrc}
                            isActive={imgSrc === activeImage}
                            onClick={() => setActiveImage(imgSrc)}
                        />
                    ))}
                </div>
            )}

            {/* Contenedor principal que agrupa la imagen grande y las miniaturas en móvil */}
            <div className="flex-grow flex flex-col">
                {/* Imagen Principal y Flechas de Navegación */}
                {/* 👇 AÑADIMOS LA CLASE "group" A ESTE CONTENEDOR 👇 */}
                <div className="relative w-full group">
                    <ImageWithZoom 
                        src={activeImage} 
                        alt={product.name} 
                        openLightbox={openLightbox}
                    />
                    
                    {allImages.length > 1 && (
                        <>
                            {/* 👇 MODIFICAMOS LAS CLASES DE AMBOS BOTONES 👇 */}
                            <button 
                                onClick={handlePrevImage} 
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                aria-label="Imagen anterior"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button 
                                onClick={handleNextImage} 
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                aria-label="Siguiente imagen"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </>
                    )}
                </div>
                
                {/* Thumbnails Horizontales (Visible en Móvil) */}
                {allImages.length > 1 && (
                    <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-2">
                        {allImages.map((imgSrc, index) => (
                            <Thumbnail
                                key={index}
                                src={imgSrc}
                                isActive={imgSrc === activeImage}
                                onClick={() => setActiveImage(imgSrc)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
        {/* --- FIN DE LA GALERÍA DE IMÁGENES --- */}
        
        <div className="flex flex-col md:w-1/2">
            <p className="text-sm text-gray-500 uppercase tracking-wider mt-4 md:mt-0">{product.category}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 my-2">{product.name}</h1>
            <div className="my-4">
                <span className="text-3xl lg:text-4xl font-bold text-blue-600">{formatPrice(product.price)}</span>
            </div>
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
                    <div className="flex items-center gap-4">
                        <div className="quantity-selector">
                            <button onClick={decreaseQuantity} className="quantity-btn">-</button>
                            <span className="quantity-input">{quantity}</span>
                            <button onClick={increaseQuantity} className="quantity-btn">+</button>
                        </div>
                        <button onClick={handleAddToCart} className="flex-grow bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-lg">
                            <i className="fas fa-shopping-cart mr-3"></i>
                            Agregar al Carrito
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="mt-16">
        <ProductosRelacionados products={relatedProducts} />
        <VistosRecientemente currentProductId={product.id} />
      </div>

      <ResenasProducto productId={product.id} />
    </>
  );
}