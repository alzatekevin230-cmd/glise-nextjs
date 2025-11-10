// components/OrderStatusTracker.jsx
"use client";

import { FaTimesCircle, FaBox, FaCog, FaTruck, FaCheckCircle } from 'react-icons/fa';

export default function OrderStatusTracker({ status }) {
  const steps = [
    { id: 'pending_payment', label: 'Pedido Recibido', icon: FaBox, color: 'blue' },
    { id: 'approved', label: 'En Proceso', icon: FaCog, color: 'orange' },
    { id: 'shipped', label: 'Enviado', icon: FaTruck, color: 'blue' },
    { id: 'delivered', label: 'Entregado', icon: FaCheckCircle, color: 'green' }
  ];

  if (status === 'rejected' || status === 'declined') {
    return (
      <div className="order-tracker-rejected">
        <FaTimesCircle />
        <span>Pedido Rechazado</span>
      </div>
    );
  }

  let currentStepIndex = steps.findIndex(step => step.id === status);
  if (currentStepIndex === -1) {
    if (status === 'pending') currentStepIndex = 0;
    else return null; 
  }

  const progressWidth = currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;
  const isDelivered = status === 'delivered';
  
  // Color de la línea de progreso según el estado
  let progressColor = '#3b82f6'; // Azul por defecto
  if (status === 'approved') {
    progressColor = '#f59e0b'; // Naranja
  } else if (status === 'shipped') {
    progressColor = '#2563eb'; // Azul más oscuro
  } else if (isDelivered) {
    progressColor = '#16a34a'; // Verde
  }

  return (
    <div className="order-tracker-container">
      <div className="order-tracker">
        <div 
          className={`tracker-line-progress ${isDelivered ? 'delivered' : ''}`} 
          style={{ 
            width: `${progressWidth}%`,
            backgroundColor: progressColor
          }}
        ></div>
        {steps.map((step, index) => {
          let stepClass = '';
          if (index < currentStepIndex) stepClass = 'completed';
          else if (index === currentStepIndex) stepClass = 'active';
          if (step.id === 'delivered' && (stepClass === 'active' || stepClass === 'completed')) {
            stepClass += ' delivered';
          }
          const IconComponent = step.icon;
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          
          // Colores por estado
          let pointColor = '#e0e0e0';
          let bgColor = '#ffffff';
          if (isCompleted) {
            if (step.color === 'green') {
              pointColor = '#16a34a';
              bgColor = '#16a34a';
            } else {
              pointColor = '#3b82f6';
              bgColor = '#3b82f6';
            }
          } else if (isActive) {
            if (step.color === 'blue') {
              pointColor = '#3b82f6';
              bgColor = '#3b82f6';
            } else if (step.color === 'orange') {
              pointColor = '#f59e0b';
              bgColor = '#f59e0b';
            } else if (step.color === 'green') {
              pointColor = '#10b981';
              bgColor = '#10b981';
            }
          }
          
          return (
            <div key={step.id} className={`tracker-step ${stepClass}`}>
              <div 
                className={`tracker-point ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                style={{
                  borderColor: pointColor,
                  backgroundColor: isCompleted || isActive ? bgColor : bgColor,
                  color: isCompleted || isActive ? '#ffffff' : '#9e9e9e'
                }}
              >
                <IconComponent className="tracker-icon" style={{width: '18px', height: '18px'}} />
              </div>
              <div className="tracker-label">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}