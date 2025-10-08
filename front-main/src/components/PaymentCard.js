import React from 'react';
import '../styles/PaymentList.css';

const PaymentCard = ({ payment, onPay }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft(payment.fechaVencimiento);
  const isUrgent = daysLeft <= 3;
  const isWarning = daysLeft <= 7 && daysLeft > 3;

  const getCardClass = () => {
    if (isUrgent) return 'payment-card urgent';
    if (isWarning) return 'payment-card warning';
    return 'payment-card';
  };

  const getDaysLeftText = () => {
    if (daysLeft < 0) return 'Vencido';
    if (daysLeft === 0) return 'Vence hoy';
    if (daysLeft === 1) return '1 día restante';
    return `${daysLeft} días restantes`;
  };

  const getDaysLeftClass = () => {
    if (isUrgent) return 'days-left urgent';
    if (isWarning) return 'days-left warning';
    return 'days-left normal';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Podrías agregar un toast de confirmación aquí
  };

  const getConceptIcon = (concepto) => {
    if (concepto.includes('Colegiatura')) return '🎓';
    if (concepto.includes('Seguro')) return '🛡️';
    if (concepto.includes('Inscripción')) return '📝';
    if (concepto.includes('Material')) return '📚';
    if (concepto.includes('Examen')) return '📝';
    return '💰';
  };

  return (
    <div className={getCardClass()} onClick={() => onPay(payment)}>
      <div className="payment-card-header">
        <h3 className="payment-title">
          {getConceptIcon(payment.concepto)} {payment.concepto}
        </h3>
        <div className="payment-badges">
          <span className="payment-status pending">Pendiente</span>
          {isUrgent && <span className="payment-status urgent">Urgente</span>}
        </div>
      </div>
      
      <div className="payment-details">
        <div className="payment-detail">
          <span className="detail-label">Monto a pagar:</span>
          <span className="detail-value">{formatCurrency(payment.monto)}</span>
        </div>
        
        <div className="payment-detail">
          <span className="detail-label">Fecha de vencimiento:</span>
          <span className="detail-value">{formatDate(payment.fechaVencimiento)}</span>
        </div>
        
        <div className="payment-detail">
          <span className="detail-label">Referencia de pago:</span>
          <code 
            className="detail-reference"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(payment.referencia);
            }}
            title="Click para copiar"
          >
            {payment.referencia}
          </code>
        </div>
      </div>

      <div className="payment-footer">
        <div className={getDaysLeftClass()}>
          {getDaysLeftText()}
        </div>
        <button 
          className="pay-action"
          onClick={(e) => {
            e.stopPropagation();
            onPay(payment);
          }}
        >
          💳 Pagar Ahora
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;