"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import { db } from '@/lib/firebaseClient'; 
import { collection, getDocs } from 'firebase/firestore';
import Breadcrumbs from '@/components/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimesCircle, FaSpinner, FaShoppingBag, FaFilter, FaCheckCircle, FaTruck, FaBox, FaStore, FaEye, FaRedo } from 'react-icons/fa';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

// Componente para el tracker mejorado con iconos y colores
const OrderTracker = ({ status }) => {
  const steps = [
    { 
      id: 'approved', 
      label: 'Pedido Recibido', 
      icon: FaCheckCircle,
      completedColor: 'bg-blue-500',
      activeColor: 'bg-blue-600',
      iconColor: 'text-blue-600'
    },
    { 
      id: 'processing', 
      label: 'En Proceso', 
      icon: FaBox,
      completedColor: 'bg-yellow-500',
      activeColor: 'bg-yellow-600',
      iconColor: 'text-yellow-600'
    },
    { 
      id: 'shipped', 
      label: 'Enviado', 
      icon: FaTruck,
      completedColor: 'bg-purple-500',
      activeColor: 'bg-purple-600',
      iconColor: 'text-purple-600'
    },
    { 
      id: 'delivered', 
      label: 'Entregado', 
      icon: FaCheckCircle,
      completedColor: 'bg-green-500',
      activeColor: 'bg-green-600',
      iconColor: 'text-green-600'
    }
  ];

  if (status === 'rejected' || status === 'declined') {
    return (
      <div className="order-tracker-container">
        <div className="order-tracker-rejected">
          <FaTimesCircle className="text-2xl" />
          <span className="font-semibold text-lg">Pedido Rechazado</span>
        </div>
      </div>
    );
  }

  let currentStepIndex = 0;
  if (status === 'approved') currentStepIndex = 0;
  else if (status === 'processing') currentStepIndex = 1;
  else if (status === 'shipped') currentStepIndex = 2;
  else if (status === 'delivered') currentStepIndex = 3;
  
  const progressWidth = currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;
  const isDelivered = status === 'delivered';

  return (
    <div className="order-tracker-container">
      <div className="order-tracker">
        {/* Línea de progreso con gradiente */}
        <div 
          className={`tracker-line-progress ${isDelivered ? 'delivered' : ''}`} 
          style={{ width: `${progressWidth}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;
          
          let pointClasses = 'tracker-point-improved';
          let iconClasses = '';
          
          // Lógica mejorada para colores según estado
          if (isDelivered) {
            // Si está entregado, todos los pasos completados son verdes
            if (isCompleted || isActive) {
              pointClasses += ' bg-green-500 border-4 border-white shadow-xl';
              iconClasses = 'text-white';
              if (isActive) {
                pointClasses += ' scale-110';
              }
            } else {
              pointClasses += ' bg-gray-200 border-2 border-gray-300';
              iconClasses = 'text-gray-400';
            }
          } else if (isCompleted) {
            pointClasses += ` ${step.completedColor} border-2 border-white shadow-lg`;
            iconClasses = 'text-white';
          } else if (isActive) {
            pointClasses += ` ${step.activeColor} border-4 border-white shadow-xl scale-110`;
            iconClasses = 'text-white';
          } else {
            pointClasses += ' bg-gray-200 border-2 border-gray-300';
            iconClasses = 'text-gray-400';
          }
          
          return (
            <div key={step.id} className={`tracker-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className={pointClasses}>
                <Icon className={`text-xl ${iconClasses}`} />
              </div>
              <div className={`tracker-label ${isActive || isCompleted ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function MisPedidosPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const userOrdersRef = collection(db, 'users', currentUser.uid, 'orders');
        const querySnapshot = await getDocs(userOrdersRef);
        const allOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const ordersWithTracking = allOrders.filter(order => 
          order.status !== 'pending' && 
          order.status !== 'pending_payment'
        );
        
        const userOrders = ordersWithTracking.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        
        setOrders(userOrders);

      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Calcular estadísticas
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const approvedOrders = orders.filter(o => o.status === 'approved' || o.status === 'processing').length;

  // Filtrar pedidos según el filtro seleccionado
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (filter === 'delivered') return order.status === 'delivered';
        if (filter === 'shipped') return order.status === 'shipped';
        if (filter === 'processing') return order.status === 'approved' || order.status === 'processing';
        return true;
      });

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-50 border-green-200';
      case 'shipped': return 'bg-blue-50 border-blue-200';
      case 'approved':
      case 'processing': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Obtener badge de estado
  const getStatusBadge = (status) => {
    switch(status) {
      case 'delivered': return { text: 'Entregado', class: 'bg-green-100 text-green-800' };
      case 'shipped': return { text: 'Enviado', class: 'bg-blue-100 text-blue-800' };
      case 'approved':
      case 'processing': return { text: 'En Proceso', class: 'bg-yellow-100 text-yellow-800' };
      default: return { text: status, class: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <main>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-20">
            <FaSpinner className="animate-spin text-3xl text-cyan-600 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Cargando tus pedidos...</p>
          </div>
        </div>
      </main>
    );
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Mi Cuenta', href: '/mi-cuenta' },
    { label: 'Mis Pedidos', href: '/mis-pedidos' }
  ];

  if (!currentUser) {
    return (
      <main>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800">Inicia sesión para ver tus pedidos</h1>
            <p className="mt-2 text-gray-600">Debes tener una cuenta para acceder a tu historial de compras.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={breadcrumbItems} />
      
      {/* Header con título */}
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Pedidos</h1>

        {/* Filtros */}
        {totalOrders > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <FaFilter className="text-gray-500" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({totalOrders})
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'processing' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En Proceso ({approvedOrders})
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'shipped' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Enviados ({shippedOrders})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'delivered' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Entregados ({deliveredOrders})
            </button>
          </div>
        )}
      </div>

      {/* Contenido */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaShoppingBag className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Aún no has realizado ningún pedido!</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Explora nuestra tienda y encuentra productos naturales y dermocosméticos de la más alta calidad.
          </p>
          <Link 
            href="/categoria/all"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-3 rounded-xl hover:bg-cyan-700 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <FaStore />
            Comenzar a Comprar
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FaFilter className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="font-semibold text-gray-700">No hay pedidos con este filtro</p>
          <p className="text-gray-500 mt-2">Intenta con otro filtro</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => {
            const trackingNumberValue = order.trackingNumber && order.trackingNumber.$value 
                ? order.trackingNumber.$value 
                : order.trackingNumber;
            const statusBadge = getStatusBadge(order.status);
            const statusColor = getStatusColor(order.status);

            return (
              <div key={order.id} className={`order-card ${statusColor} border-2 overflow-hidden`}>
                {/* Header del pedido mejorado */}
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg md:text-xl shadow-md">
                          #{order.orderId}
                        </div>
                        <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold ${statusBadge.class} shadow-sm`}>
                          {statusBadge.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha no disponible'}</span>
                      </div>
                    </div>
                    <div className="text-right bg-gradient-to-br from-cyan-50 to-teal-50 px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 rounded-lg sm:rounded-xl shadow-sm border border-cyan-100 self-start md:self-auto">
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-0.5 sm:mb-1 font-semibold">Total Pagado</p>
                      <p className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Tracker mejorado */}
                <OrderTracker status={order.status} />

                {/* Información de tracking mejorada */}
                {(order.status === 'shipped' || order.status === 'delivered') && trackingNumberValue && (
                  <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 shadow-sm"> 
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <Image src="/imagenespagina/coordinadora.webp" alt="Coordinadora" width={80} height={32} className="object-contain" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Enviado con Coordinadora</p>
                        </div>
                      </div>
                      <a 
                        href={`https://www.coordinadora.com/portafolio-de-servicios/servicios-en-linea/rastrear-guias/?guia=${trackingNumberValue}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                      >
                        <FaTruck />
                        Rastrear Pedido
                      </a>
                    </div>
                  </div>
                )}

                {/* Productos del pedido */}
                <div className="order-card-body">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Productos del Pedido</h3>
                  <div className="space-y-4">
                    {order.items.map(item => {
                      // Obtener la imagen correcta del item
                      let imageSrc = '/imagenespagina/producto-ejemplo.webp';
                      if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                        const firstImage = item.images[0];
                        imageSrc = typeof firstImage === 'string' ? firstImage : (firstImage.url || firstImage.src || firstImage.path || '/imagenespagina/producto-ejemplo.webp');
                      } else if (item.image) {
                        imageSrc = typeof item.image === 'string' ? item.image : (item.image.url || item.image.src || item.image.path || '/imagenespagina/producto-ejemplo.webp');
                      }

                      return (
                        <div key={item.id || item.name} className="order-item">
                          <div className="aspect-square w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border-2 border-gray-200">
                            <Image 
                              src={imageSrc} 
                              alt={item.name || 'Producto'} 
                              fill 
                              className="object-contain p-2" 
                              sizes="80px"
                              onError={(e) => {
                                e.target.src = '/imagenespagina/producto-ejemplo.webp';
                              }}
                            />
                          </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-gray-800 mb-1">{item.name}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded">Cantidad: {item.quantity}</span>
                            <span>Precio unitario: {formatPrice(item.price)}</span>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900 text-lg">{(item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
      </div>
    </main>
  );
}
