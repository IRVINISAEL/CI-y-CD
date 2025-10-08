import React, { useState, useEffect, useCallback } from 'react';
import { paymentsAPI } from '../../services/api';
import '../../styles/AllPayments.css';

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    carrera: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getAllPayments(filters);
      if (response.data.success) {
        setPayments(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      setError('Error al cargar los pagos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  const getStatusBadge = (status) => {
    const statusClass = status === 'pagado' ? 'paid' : 
                       status === 'pendiente' ? 'pending' : 'expired';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (loading && payments.length === 0) {
    return <div className="loading">Cargando todos los pagos...</div>;
  }

  return (
    <div className="all-payments">
      <h2>Todos los Pagos del Sistema</h2>
      
      <div className="admin-filters">
        <div className="filter-group">
          <label>Estado del Pago</label>
          <select 
            value={filters.estado} 
            onChange={(e) => handleFilterChange('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Carrera</label>
          <select 
            value={filters.carrera} 
            onChange={(e) => handleFilterChange('carrera', e.target.value)}
          >
            <option value="">Todas las carreras</option>
            <option value="TSU Enfermería">TSU Enfermería</option>
            <option value="Licenciatura en Enfermería">Licenciatura en Enfermería</option>
            <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
            <option value="Maestría en Enfermería">Maestría en Enfermería</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Elementos por página</label>
          <select 
            value={filters.limit} 
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          >
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="50">50 por página</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Matrícula</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Vencimiento</th>
              <th>Referencia</th>
              <th>Carrera</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="student-info">
                  <strong>{payment.student?.nombre}</strong>
                </td>
                <td>{payment.student?.matricula}</td>
                <td>{payment.concepto}</td>
                <td className="amount">{formatCurrency(payment.monto)}</td>
                <td>{getStatusBadge(payment.estado)}</td>
                <td>{formatDate(payment.fechaVencimiento)}</td>
                <td><code>{payment.referencia}</code></td>
                <td>{payment.student?.carrera}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No se encontraron pagos</h3>
          <p>No hay pagos que coincidan con los filtros seleccionados.</p>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
          >
            ← Anterior
          </button>
          
          <span className="page-info">
            Página {filters.page} de {pagination.pages}
          </span>
          
          <button 
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.pages}
          >
            Siguiente →
          </button>
        </div>
      )}

      <div className="summary">
        Mostrando {payments.length} de {pagination.total} pagos
      </div>
    </div>
  );
};

export default AllPayments;