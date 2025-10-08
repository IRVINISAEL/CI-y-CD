import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../services/api';
import '../styles/PaymentHistory.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('fechaPago');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      const response = await paymentsAPI.getPaymentHistory();
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      setError('Error al cargar el historial de pagos');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No pagado';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConceptIcon = (concepto) => {
    if (concepto.includes('Colegiatura')) return '🎓';
    if (concepto.includes('Seguro')) return '🛡️';
    if (concepto.includes('Inscripción')) return '📝';
    if (concepto.includes('Material')) return '📚';
    return '💰';
  };

  // Filtrado y ordenamiento
  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = payment.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.referencia.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || payment.estado === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'fechaPago' || sortField === 'fechaVencimiento') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      if (sortField === 'monto') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Paginación
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortClass = (field) => {
    if (sortField !== field) return 'sortable';
    return `sortable sort-${sortDirection}`;
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Podrías agregar un toast de confirmación aquí
  };

  // Estadísticas
  const totalPayments = filteredPayments.length;
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + (payment.monto || 0), 0);
  const paidPayments = filteredPayments.filter(p => p.estado === 'pagado').length;
  const pendingPayments = filteredPayments.filter(p => p.estado === 'pendiente').length;

  if (loading) {
    return (
      <div className="payment-history">
        <div className="loading">Cargando historial de pagos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-history">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="payment-history">
      <h2>Historial de Pagos</h2>
      
      {/* Estadísticas */}
      <div className="history-stats">
        <div className="history-stat total">
          <div className="history-stat-value">{totalPayments}</div>
          <div className="history-stat-label">Total Pagos</div>
        </div>
        <div className="history-stat paid">
          <div className="history-stat-value">{paidPayments}</div>
          <div className="history-stat-label">Pagados</div>
        </div>
        <div className="history-stat pending">
          <div className="history-stat-value">{pendingPayments}</div>
          <div className="history-stat-label">Pendientes</div>
        </div>
        <div className="history-stat amount">
          <div className="history-stat-value">{formatCurrency(totalAmount)}</div>
          <div className="history-stat-label">Monto Total</div>
        </div>
      </div>

      {/* Controles */}
      <div className="history-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por concepto o referencia..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="vencido">Vencido</option>
          </select>

          <select 
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className="filter-select"
          >
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="50">50 por página</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="history-table-container">
        <div className="table-header">
          <div className="table-title">
            Historial de Transacciones
          </div>
          <div className="table-actions">
            <div className="rows-count">
              Mostrando {paginatedPayments.length} de {filteredPayments.length} registros
            </div>
            <button className="export-button">
              📥 Exportar
            </button>
          </div>
        </div>

        <div className="table-scroll-container">
          <table className="history-table">
            <thead>
              <tr>
                <th 
                  className={getSortClass('concepto')}
                  onClick={() => handleSort('concepto')}
                >
                  Concepto
                </th>
                <th 
                  className={getSortClass('monto')}
                  onClick={() => handleSort('monto')}
                >
                  Monto
                </th>
                <th 
                  className={getSortClass('fechaPago')}
                  onClick={() => handleSort('fechaPago')}
                >
                  Fecha de Pago
                </th>
                <th 
                  className={getSortClass('fechaVencimiento')}
                  onClick={() => handleSort('fechaVencimiento')}
                >
                  Fecha de Vencimiento
                </th>
                <th>Estado</th>
                <th>Referencia</th>
                <th>Cuatrimestre</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr key={payment._id}>
                  <td className="concept-cell">
                    <span className="concept-icon">
                      {getConceptIcon(payment.concepto)}
                    </span>
                    {payment.concepto}
                  </td>
                  <td className="amount-cell">
                    {payment.monto ? formatCurrency(payment.monto) : 'N/A'}
                  </td>
                  <td className="date-cell">
                    <span className="date-icon">📅</span>
                    {formatDate(payment.fechaPago)}
                  </td>
                  <td className="date-cell">
                    <span className="date-icon">⏰</span>
                    {formatDate(payment.fechaVencimiento)}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${payment.estado}`}>
                      {payment.estado}
                    </span>
                  </td>
                  <td className="reference-cell">
                    <code 
                      className="reference-code"
                      onClick={() => copyToClipboard(payment.referencia)}
                      title="Click para copiar"
                    >
                      {payment.referencia}
                    </code>
                  </td>
                  <td className="cuatrimestre-cell">
                    {payment.cuatrimestre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="history-pagination">
            <div className="pagination-info">
              Página {currentPage} de {totalPages}
            </div>
            
            <div className="pagination-controls">
              <button 
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              
              <div className="page-numbers">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Estado vacío */}
      {filteredPayments.length === 0 && (
        <div className="empty-history">
          <div className="empty-history-icon">📭</div>
          <h3>No se encontraron pagos</h3>
          <p>
            {searchTerm || statusFilter 
              ? 'No hay pagos que coincidan con los filtros seleccionados.'
              : 'No hay pagos en tu historial hasta el momento.'
            }
          </p>
          {(searchTerm || statusFilter) && (
            <button 
              className="refresh-button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
            >
              🔄 Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;