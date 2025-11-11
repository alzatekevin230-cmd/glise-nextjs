"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import { db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import { FaSpinner, FaUserCircle, FaShoppingBag, FaDollarSign, FaStar, FaCalendar, FaHeart, FaClock, FaStore, FaBolt, FaBox, FaTruck, FaUser } from 'react-icons/fa';


export default function MiCuentaPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategory: 'Dermocosméticos',
    lastOrderDate: null,
    totalFavorites: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadUserStats = async () => {
    try {
      // 1. Cargar pedidos del usuario desde la subcolección
      const userOrdersRef = collection(db, 'users', currentUser.uid, 'orders');
      const userOrdersSnapshot = await getDocs(userOrdersRef);
      const allOrders = userOrdersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filtrar pedidos procesados (no pendientes de pago)
      const ordersWithTracking = allOrders.filter(order => 
        order.status !== 'pending' && 
        order.status !== 'pending_payment'
      );
      
      // Ordenar por fecha (más recientes primero)
      const recentOrders = ordersWithTracking
        .sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        })
        .slice(0, 5);

      setRecentOrders(recentOrders);

      // 2. Cargar favoritos del usuario
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const favoriteProductIds = userData.favorites || [];

      // 3. Calcular estadísticas reales (solo pedidos con tracking)
      const totalOrders = ordersWithTracking.length;
      const totalSpent = ordersWithTracking.reduce((sum, order) => sum + (order.total || 0), 0);
      const lastOrderDate = recentOrders.length > 0 ? recentOrders[0].createdAt : null;

      // 4. Determinar categoría favorita basada en pedidos (solo con tracking)
      const categoryCount = {};
      ordersWithTracking.forEach(order => {
        if (order.items) {
          order.items.forEach(item => {
            if (item.category) {
              categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
            }
          });
        }
      });
      
      const favoriteCategory = Object.keys(categoryCount).length > 0 
        ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
        : 'Dermocosméticos';

      setStats({
        totalOrders,
        totalSpent,
        favoriteCategory,
        lastOrderDate,
        totalFavorites: favoriteProductIds.length
      });

    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
      // En caso de error, mantener valores por defecto
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-20">
            <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Cargando tu cuenta...</p>
          </div>
        </div>
      </main>
    );
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Mi Cuenta', href: '/mi-cuenta' }
  ];

  if (!currentUser) {
    return (
      <main>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold">Inicia sesión para acceder a tu cuenta</h1>
            <p className="mt-2 text-gray-600">Debes tener una cuenta para acceder a tu dashboard.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header de bienvenida */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">¡Hola, {currentUser.displayName?.split(' ')[0] || 'Usuario'}!</h1>
              <p className="text-blue-100">Bienvenido a tu panel de control de Glisé</p>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaShoppingBag className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                <p className="text-2xl font-bold text-gray-900">${Math.round(stats.totalSpent).toLocaleString('es-CO')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categoría Favorita</p>
                <p className="text-lg font-bold text-gray-900">{stats.favoriteCategory}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaStar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Último Pedido</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.lastOrderDate ? 
                    new Date(stats.lastOrderDate.seconds * 1000).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mis Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <FaHeart className="text-pink-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pedidos recientes */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                <FaClock className="text-blue-600" />
                Pedidos Recientes
              </h2>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <FaShoppingBag className="text-4xl text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-600 mb-4">Aún no has realizado ningún pedido</p>
                  <Link 
                    href="/categoria/all"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaStore />
                    Comenzar a Comprar
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">Pedido #{order.orderId}</p>
                          <p className="text-sm text-gray-600">
                            {order.createdAt?.seconds ? 
                              new Date(order.createdAt.seconds * 1000).toLocaleDateString('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Fecha no disponible'
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">${Math.round(order.total).toLocaleString('es-CO')}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'delivered' ? 'Entregado' :
                             order.status === 'shipped' ? 'Enviado' :
                             order.status === 'approved' ? 'Aprobado' :
                             order.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Productos del pedido */}
                      {order.items && order.items.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-500 mb-2">Productos:</p>
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 relative">
                                <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-contain rounded" sizes="32px" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="font-medium text-gray-700 truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                              </div>
                              <p className="text-xs font-medium text-gray-600">${Math.round(item.price * item.quantity).toLocaleString('es-CO')}</p>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 2} producto(s) más</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link 
                      href="/mis-pedidos"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver todos los pedidos →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                <FaBolt className="text-yellow-600" />
                Acciones Rápidas
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <Link 
                  href="/mis-pedidos"
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FaBox className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Mis Pedidos</p>
                    <p className="text-sm text-gray-600">Ver historial de compras</p>
                  </div>
                </Link>

                <Link 
                  href="/mis-favoritos"
                  className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                    <FaHeart className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Mis Favoritos</p>
                    <p className="text-sm text-gray-600">Productos guardados</p>
                  </div>
                </Link>

                <Link 
                  href="/rastrear-pedido"
                  className="flex items-center gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <FaTruck className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Rastrear Pedido</p>
                    <p className="text-sm text-gray-600">Seguimiento de envíos</p>
                  </div>
                </Link>

                <Link 
                  href="/mi-perfil"
                  className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Mi Perfil</p>
                    <p className="text-sm text-gray-600">Editar información</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
