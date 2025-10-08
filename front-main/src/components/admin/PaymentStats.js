import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../../services/api';
import '../../styles/PaymentStats.css';

const PaymentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await paymentsAPI.getPaymentStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      setError('Error al cargar las estadísticas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats) {
    return <div className="empty-state">No hay datos disponibles</div>;
  }

  return (
    <div className="payment-stats">
      <h2>Estadísticas del Sistema</h2>
      
      <div className="stats-overview">
        <div className="stat-card total">
          <div className="stat-icon">📈</div>
          <h3>Total Pagos</h3>
          <div className="stat-number">{stats.totals.payments}</div>
          <div className="stat-trend">+12% este mes</div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">⏰</div>
          <h3>Pagos Pendientes</h3>
          <div className="stat-number">{stats.totals.pending}</div>
          <div className="stat-trend">-5% esta semana</div>
        </div>
        
        <div className="stat-card paid">
          <div className="stat-icon">✅</div>
          <h3>Pagos Realizados</h3>
          <div className="stat-number">{stats.totals.paid}</div>
          <div className="stat-trend">+8% este mes</div>
        </div>
        
        <div className="stat-card revenue">
          <div className="stat-icon">💵</div>
          <h3>Recaudación Total</h3>
          <div className="stat-number">{formatCurrency(stats.totals.revenue)}</div>
          <div className="stat-trend">+15% este trimestre</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-section">
          <h3>💰 Recaudación por Carrera</h3>
          <div className="stats-list">
            {stats.revenueByCareer.map((item, index) => (
              <div key={index} className="stats-item">
                <span className="career-name">{item._id}</span>
                <div className="stats-details">
                  <span>{formatCurrency(item.total)}</span>
                  <small>{item.count} pagos</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h3>⏰ Pagos Pendientes por Carrera</h3>
          <div className="stats-list">
            {stats.pendingByCareer.map((item, index) => (
              <div key={index} className="stats-item">
                <span className="career-name">{item._id}</span>
                <div className="stats-details">
                  <span>{item.count} pendientes</span>
                  <small>{formatCurrency(item.totalAmount)}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={loadStats} className="refresh-button">
        🔄 Actualizar Estadísticas
      </button>
    </div>
  );
};

export default PaymentStats;