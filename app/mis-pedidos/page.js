"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexto/ContextoAuth';
import { db } from '@/lib/firebaseClient'; 
import { collectionGroup, query, where, getDocs, orderBy } from 'firebase/firestore';
import BotonVolver from '@/components/BotonVolver';

const formatPrice = (price) => `$${Math.round(price).toLocaleString('es-CO')}`;

// Componente para el tracker (no necesita cambios)
const OrderTracker = ({ status }) => {
  const steps = [
    { id: 'approved', label: 'Pedido Recibido' },
    { id: 'processing', label: 'En Proceso' },
    { id: 'shipped', label: 'Enviado' },
    { id: 'delivered', label: 'Entregado' }
  ];

  if (status === 'rejected' || status === 'declined') {
    return (
      <div className="order-tracker-container">
        <div className="order-tracker-rejected">
          <i className="fas fa-times-circle"></i>
          <span>Pedido Rechazado</span>
        </div>
      </div>
    );
  }

  let currentStepIndex = 0;
  if (status === 'approved') currentStepIndex = 0;
  else if (status === 'shipped') currentStepIndex = 2;
  else if (status === 'delivered') currentStepIndex = 3;
  
  const progressWidth = currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;
  const isDelivered = status === 'delivered';

  return (
    <div className="order-tracker-container">
      <div className="order-tracker">
        <div className={`tracker-line-progress ${isDelivered ? 'delivered' : ''}`} style={{ width: `${progressWidth}%` }}></div>
        {steps.map((step, index) => {
          let stepClass = '';
          if (status === 'shipped' && index < 2) stepClass = 'completed';
          else if (index < currentStepIndex) stepClass = 'completed';
          else if (index === currentStepIndex) stepClass = 'active';

          if (step.id === 'delivered' && (stepClass === 'active' || stepClass === 'completed')) {
            stepClass += ' delivered';
          }
          
          return (
            <div key={step.id} className={`tracker-step ${stepClass}`}>
              <div className="tracker-point">{index + 1}</div>
              <div className="tracker-label">{step.label}</div>
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

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const ordersRef = collectionGroup(db, 'orders');
        const q = query(
          ordersRef, 
          where("userId", "==", currentUser.uid),
          where("status", "in", ["approved", "shipped", "delivered", "rejected", "declined"]),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
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

  if (loading) {
    return <div className="text-center py-20"><i className="fas fa-spinner fa-spin text-3xl text-blue-600"></i><p className="mt-2 text-gray-600">Cargando tus pedidos...</p></div>;
  }

  if (!currentUser) {
    return (
      <main className="container mx-auto px-4 sm:px-6 py-16 text-center">
        <BotonVolver />
        <h1 className="text-2xl font-bold mt-8">Inicia sesión para ver tus pedidos</h1>
        <p className="mt-2 text-gray-600">Debes tener una cuenta para acceder a tu historial de compras.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8">
      <BotonVolver texto="Volver a la tienda" />
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
            <p className="font-semibold">Aún no has realizado ningún pedido.</p>
            <p className="text-gray-500 mt-2">¡Explora nuestra tienda y encuentra tus productos favoritos!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const trackingNumberValue = order.trackingNumber && order.trackingNumber.$value 
                ? order.trackingNumber.$value 
                : order.trackingNumber;

            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">PEDIDO #{order.orderId}</p>
                    <p className="text-xs text-gray-500">
                      Realizado el {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha no disponible'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                </div>
                
                <OrderTracker status={order.status} />

                {(order.status === 'shipped' || order.status === 'delivered') && trackingNumberValue && (
                  <div className="tracking-info-box"> 
                    <p>
                      <span className="font-semibold">Enviado con:</span> 
                      <img src="/imagenespagina/coordinadora.png" alt="Coordinadora" className="inline-block h-6 ml-2 align-middle"/>
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold">Nº de Seguimiento:</span> 
                      {/* --- INICIO DE LA CORRECCIÓN --- */}
                      {/* Esta es la URL correcta para el rastreo directo en Coordinadora */}
                      <a 
                        href={`https://www.coordinadora.com/portafolio-de-servicios/servicios-en-linea/rastrear-guias/?guia=${trackingNumberValue}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="tracking-link"
                      >
                        {trackingNumberValue}
                      </a>
                      {/* --- FIN DE LA CORRECCIÓN --- */}
                    </p>
                  </div>
                )}

                <div className="order-card-body">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="aspect-square w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity} | Precio: {item.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</p>
                      </div>
                      <p className="font-semibold text-gray-800">{(item.price * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  );
}