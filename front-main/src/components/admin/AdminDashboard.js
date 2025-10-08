import React, { useState } from 'react';
import AllPayments from './AllPayments';
import AllStudents from './AllStudents';
import PaymentStats from './PaymentStats';
import '../../styles/AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('stats');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return <PaymentStats />;
      case 'allPayments':
        return <AllPayments />;
      case 'allStudents':
        return <AllStudents />;
      default:
        return <PaymentStats />;
    }
  };

  const tabs = [
    { id: 'stats', label: '📊 Estadísticas', icon: '📊' },
    { id: 'allPayments', label: '💰 Todos los Pagos', icon: '💰' },
    { id: 'allStudents', label: '👥 Todos los Estudiantes', icon: '👥' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        <header className="admin-header">
          <div className="user-info">
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {user.nombre}</p>
            <p>Rol: Administrador</p>
          </div>
          <button onClick={onLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </header>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-nav-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="admin-main">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;