import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../services/api';
import PaymentCard from './PaymentCard';
import '../styles/PaymentList.css';

const PaymentList = ({ onPaymentSelect }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, urgent, warning

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      const response = await paymentsAPI.getPendingPayments();
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      setError('Error al cargar los pagos pendientes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPayments = payments.filter(payment => {
    const daysLeft = getDaysLeft(payment.fechaVencimiento);
    
    switch (filter) {
      case 'urgent':
        return daysLeft <= 3;
      case 'warning':
        return daysLeft > 3 && daysLeft <= 7;
      case 'normal':
        return daysLeft > 7;
      default:
        return true;
    }
  });

  const totalPendiente = filteredPayments.reduce((sum, payment) => sum + payment.monto, 0);
  const pagosUrgentes = filteredPayments.filter(p => getDaysLeft(p.fechaVencimiento) <= 3).length;

  if (loading) {
    return (
      <div className="payment-list">
        <div className="loading">Cargando pagos pendientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-list">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="payment-list">
      <h2>Pagos Pendientes</h2>
      
      {/* Filtros */}
      <div className="payment-filters">
        <button 
          className={`filter-option ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          📋 Todos ({payments.length})
        </button>
        <button 
          className={`filter-option ${filter === 'urgent' ? 'active' : ''}`}
          onClick={() => setFilter('urgent')}
        >
          ⚠️ Urgentes ({payments.filter(p => getDaysLeft(p.fechaVencimiento) <= 3).length})
        </button>
        <button 
          className={`filter-option ${filter === 'warning' ? 'active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          ⏰ Próximos ({payments.filter(p => getDaysLeft(p.fechaVencimiento) > 3 && getDaysLeft(p.fechaVencimiento) <= 7).length})
        </button>
        <button 
          className={`filter-option ${filter === 'normal' ? 'active' : ''}`}
          onClick={() => setFilter('normal')}
        >
          📅 Normales ({payments.filter(p => getDaysLeft(p.fechaVencimiento) > 7).length})
        </button>
      </div>

      {/* Barra de acciones */}
      <div className="payment-actions-bar">
        <div className="payment-summary">
          <div className="total-pending">
            Total Pendiente: {formatCurrency(totalPendiente)}
          </div>
          {pagosUrgentes > 0 && (
            <div className="payment-alert">
              ⚠️ {pagosUrgentes} pago(s) urgente(s)
            </div>
          )}
        </div>
        
        <div className="view-toggle">
          <button className="active">📊 Vista Tarjetas</button>
          <button disabled>📋 Vista Lista</button>
        </div>
      </div>

      {/* Grid de pagos */}
      <div className="payments-grid">
        {filteredPayments.map((payment) => (
          <PaymentCard 
            key={payment._id}
            payment={payment}
            onPay={onPaymentSelect}
          />
        ))}
      </div>

      {/* Estado vacío */}
      {filteredPayments.length === 0 && (
        <div className="empty-payments">
          <div className="empty-payments-icon">
            {filter === 'all' ? '🎉' : 
             filter === 'urgent' ? '✅' :
             filter === 'warning' ? '📅' : '💼'}
          </div>
          <h3>
            {filter === 'all' ? '¡No tienes pagos pendientes!' :
             filter === 'urgent' ? 'No hay pagos urgentes' :
             filter === 'warning' ? 'No hay pagos próximos' : 'No hay pagos normales'}
          </h3>
          <p>
            {filter === 'all' ? 'Todo está al corriente. Buen trabajo manteniendo tus pagos al día.' :
             filter === 'urgent' ? 'Excelente, no tienes pagos que venzan en los próximos 3 días.' :
             filter === 'warning' ? 'No hay pagos que venzan en los próximos 7 días.' : 
             'No hay pagos con vencimiento mayor a 7 días.'}
          </p>
          {filter !== 'all' && (
            <button 
              className="refresh-button"
              onClick={() => setFilter('all')}
              style={{
                padding: '1rem 2rem',
                background: 'var(--primary-gradient)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🔄 Ver todos los pagos
            </button>
          )}
        </div>
      )}
    </div>
  );

  // Función helper para formatear currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }
};

export default PaymentList;