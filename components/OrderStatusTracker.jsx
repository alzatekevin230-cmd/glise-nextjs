// components/OrderStatusTracker.jsx
"use client";

export default function OrderStatusTracker({ status }) {
  const steps = [
    { id: 'pending_payment', label: 'Pedido Recibido' },
    { id: 'approved', label: 'En Proceso' },
    { id: 'shipped', label: 'Enviado' },
    { id: 'delivered', label: 'Entregado' }
  ];

  if (status === 'rejected' || status === 'declined') {
    return (
      <div className="order-tracker-rejected">
        <i className="fas fa-times-circle"></i>
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

  return (
    <div className="order-tracker-container">
      <div className="order-tracker">
        <div className={`tracker-line-progress ${isDelivered ? 'delivered' : ''}`} style={{ width: `${progressWidth}%` }}></div>
        {steps.map((step, index) => {
          let stepClass = '';
          if (index < currentStepIndex) stepClass = 'completed';
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
}