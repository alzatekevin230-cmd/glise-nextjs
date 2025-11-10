"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, updateDoc, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { useCarrito } from '@/contexto/ContextoCarrito';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaSpinner, FaHeart, FaStore, FaCartPlus } from 'react-icons/fa';

export default function MisFavoritosPage() {
  const { currentUser } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadFavorites = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoriteIds = userData.favorites || [];
        setFavorites(favoriteIds);
        
        // Cargar productos completos desde Firestore
        if (favoriteIds.length > 0) {
          await loadFavoriteProducts(favoriteIds);
        }
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      toast.error('Error al cargar tus favoritos');
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteProducts = async (productIds) => {
    try {
      const productsPromises = productIds.map(async (productId) => {
        try {
          // Intentar buscar por ID numérico primero
          const numericId = parseInt(productId);
          if (!isNaN(numericId)) {
            const productsRef = collection(db, 'products');
            const q = query(productsRef, where('id', '==', numericId));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              return { id: doc.id, ...doc.data(), favoriteId: productId };
            }
          }
          
          // Si no se encuentra por ID numérico, intentar buscar por document ID
          const productDoc = await getDoc(doc(db, 'products', productId));
          if (productDoc.exists()) {
            return { id: productDoc.id, ...productDoc.data(), favoriteId: productId };
          }
          
          return null;
        } catch (error) {
          console.error(`Error al cargar producto ${productId}:`, error);
          return null;
        }
      });

      const loadedProducts = await Promise.all(productsPromises);
      const validProducts = loadedProducts.filter(p => p !== null);
      setProducts(validProducts);
    } catch (error) {
      console.error('Error al cargar productos favoritos:', error);
      toast.error('Error al cargar productos');
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        favorites: arrayRemove(productId)
      });
      
      setFavorites(prev => prev.filter(id => id !== productId));
      setProducts(prev => prev.filter(p => (p.favoriteId || p.id) !== productId));
      toast.success('Producto eliminado de favoritos');
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
      toast.error('Error al eliminar de favoritos');
    }
  };

  const addToCart = (product) => {
    const result = agregarAlCarrito(product);
    
    if (result.success) {
      toast.success(result.isNew ? `🛒 ${product.name} añadido al carrito!` : `✅ Cantidad actualizada en el carrito`, {
        duration: 2000,
        style: {
          background: '#22c55e',
          color: '#fff',
        },
      });
    } else if (result.reason === 'max_limit') {
      toast.error(`⚠️ Máximo ${result.max} unidades por producto`, {
        duration: 2000,
      });
    }
  };

  const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

  if (loading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 py-8 pt-[190px] md:pt-8">
        <div className="text-center py-20">
          <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Cargando tus favoritos...</p>
        </div>
      </main>
    );
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Mi Cuenta', href: '/mi-cuenta' },
    { label: 'Mis Favoritos', href: '/mis-favoritos' }
  ];

  if (!currentUser) {
    return (
      <main className="container mx-auto px-4 sm:px-6 py-8 pt-[190px] md:pt-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold">Inicia sesión para ver tus favoritos</h1>
          <p className="mt-2 text-gray-600">Debes tener una cuenta para acceder a tu lista de productos favoritos.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 pt-[190px] md:pt-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaHeart className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mis Favoritos</h1>
                <p className="text-pink-100">
                  {favorites.length === 0 
                    ? 'No tienes productos favoritos aún' 
                    : `${favorites.length} producto${favorites.length !== 1 ? 's' : ''} guardado${favorites.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">¡Tu lista de favoritos está vacía!</h3>
                <p className="text-gray-600 mb-6">Explora nuestros productos y guarda tus favoritos haciendo clic en el corazón.</p>
                <Link 
                  href="/categoria/all"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  <FaStore />
                  Explorar Productos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  // Obtener la imagen correcta
                  let imageSrc = '/imagenespagina/producto-ejemplo.webp';
                  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                    const firstImage = product.images[0];
                    imageSrc = typeof firstImage === 'string' ? firstImage : (firstImage.url || firstImage.src || firstImage.path || '/imagenespagina/producto-ejemplo.webp');
                  } else if (product.image) {
                    imageSrc = typeof product.image === 'string' ? product.image : (product.image.url || product.image.src || product.image.path || '/imagenespagina/producto-ejemplo.webp');
                  }

                  const productSlug = product.slug || `producto-${product.id}`;

                  return (
                    <div key={product.favoriteId || product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <Link href={`/producto/${productSlug}`}>
                          <div className="aspect-square bg-gray-100 relative">
                            <Image
                              src={imageSrc}
                              alt={product.name || 'Producto'}
                              fill
                              className="object-contain p-2"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              onError={(e) => {
                                e.target.src = '/imagenespagina/producto-ejemplo.webp';
                              }}
                            />
                          </div>
                        </Link>
                        
                        {/* Botón de eliminar favorito */}
                        <button
                          onClick={() => removeFromFavorites(product.favoriteId || product.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FaHeart className="text-red-500" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <Link href={`/producto/${productSlug}`}>
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                            {product.name || 'Producto sin nombre'}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(product.price || 0)}
                          </span>
                          {product.stock !== undefined && (
                            <span className="text-sm text-gray-500">
                              Stock: {product.stock}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center justify-center gap-1"
                          >
                            <FaCartPlus />
                            Agregar
                          </button>
                          <Link
                            href={`/producto/${productSlug}`}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm text-center"
                          >
                            Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
