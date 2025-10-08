import React, { useState } from 'react';
import Tabs from './Tabs';
import PaymentCard from './PaymentCard';
import PaymentHistory from './PaymentHistory';
import PaymentDetail from './PaymentDetail';
import AdminDashboard from './admin/AdminDashboard';
import '../styles/Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState(null);

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={onLogout} />;
  }

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  const handleBackToList = () => {
    setSelectedPayment(null);
  };

  const handlePaymentSuccess = () => {
    setSelectedPayment(null);
  };

  // Datos de ejemplo mejorados
  const pendingPayments = [
    {
      _id: '1',
      concepto: 'Seguro Escolar Anual',
      monto: 500,
      fechaVencimiento: '2025-09-08',
      referencia: 'FSEID-2023001-002',
      diasRestantes: 2,
      urgente: true
    },
    {
      _id: '2', 
      concepto: 'Colegiatura Octubre 2025',
      monto: 8500,
      fechaVencimiento: '2025-10-03',
      referencia: 'FSEID-2023001-003',
      diasRestantes: 15,
      urgente: false
    },
    {
      _id: '3',
      concepto: 'Inscripción Semestral',
      monto: 1200,
      fechaVencimiento: '2025-11-15',
      referencia: 'FSEID-2023001-004',
      diasRestantes: 45,
      urgente: false
    }
  ];

  const totalPendiente = pendingPayments.reduce((sum, payment) => sum + payment.monto, 0);
  const pagosUrgentes = pendingPayments.filter(p => p.urgente).length;

  const tabs = [
    {
      id: 'pending',
      label: 'Pagos Pendientes',
      content: (
        <div className="payment-list">
          <h2>Pagos Pendientes</h2>
          
          <div className="payment-actions-bar">
            <div className="payment-summary">
              <div className="total-pending">
                Total Pendiente: ${totalPendiente.toLocaleString()}
              </div>
              {pagosUrgentes > 0 && (
                <div className="payment-alert">
                  ⚠️ {pagosUrgentes} pago(s) urgente(s)
                </div>
              )}
            </div>
            
            <div className="view-toggle">
              <button className="active">Tarjetas</button>
              <button>Lista</button>
            </div>
          </div>

          <div className="payments-grid">
            {pendingPayments.map((payment) => (
              <PaymentCard 
                key={payment._id}
                payment={payment}
                onPay={handlePaymentSelect}
              />
            ))}
          </div>

          {pendingPayments.length === 0 && (
            <div className="empty-payments">
              <div className="empty-payments-icon">🎉</div>
              <h3>¡No tienes pagos pendientes!</h3>
              <p>Todo está al corriente. Buen trabajo.</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'history',
      label: 'Historial de Pagos',
      content: <PaymentHistory />
    }
  ];

  if (selectedPayment) {
    return (
      <PaymentDetail 
        payment={selectedPayment}
        user={user}
        onBack={handleBackToList}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Bienvenido, {user.nombre}</h1>
          <div className="user-info">
            <p>{user.carrera} - {user.cuatrimestre} Cuatrimestre</p>
            <p>Matrícula: {user.matricula}</p>
            <p>Estado: Activo</p>
          </div>
          
          <div className="header-actions">
            <div className="welcome-message">
              ¡Buen día! Revisa tus pagos pendientes
            </div>
            <button onClick={onLogout} className="logout-button">
              🚪 Cerrar Sesión
            </button>
          </div>
        </header>

        <div className="quick-stats">
          <div className="quick-stat">
            <div className="quick-stat-icon">⏰</div>
            <div className="quick-stat-value">{pendingPayments.length}</div>
            <div className="quick-stat-label">Pagos Pendientes</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-icon">⚠️</div>
            <div className="quick-stat-value">{pagosUrgentes}</div>
            <div className="quick-stat-label">Urgentes</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-icon">💰</div>
            <div className="quick-stat-value">${totalPendiente.toLocaleString()}</div>
            <div className="quick-stat-label">Total Pendiente</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-icon">✅</div>
            <div className="quick-stat-value">12</div>
            <div className="quick-stat-label">Pagados</div>
          </div>
        </div>

        <main className="dashboard-main">
          <Tabs 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;