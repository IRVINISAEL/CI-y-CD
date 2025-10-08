import React, { useState, useEffect, useCallback } from 'react';
import { paymentsAPI } from '../../services/api';
import '../../styles/AllStudents.css';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    carrera: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getAllStudents(filters);
      if (response.data.success) {
        setStudents(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      setError('Error al cargar los estudiantes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

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

  if (loading && students.length === 0) {
    return <div className="loading">Cargando todos los estudiantes...</div>;
  }

  return (
    <div className="all-students">
      <h2>Todos los Estudiantes</h2>
      
      <div className="admin-filters">
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

      <div className="students-grid">
        {students.map((student) => (
          <div key={student._id} className="student-card">
            <div className="student-header">
              <h3>{student.nombre}</h3>
              <div className="student-stats">
                <span className="stat paid">{student.stats?.paid || 0} pagados</span>
                <span className="stat pending">{student.stats?.pending || 0} pendientes</span>
              </div>
            </div>
            
            <div className="student-details">
              <div className="detail">
                <label>Matrícula:</label>
                <span>{student.matricula}</span>
              </div>
              <div className="detail">
                <label>Carrera:</label>
                <span>{student.carrera}</span>
              </div>
              <div className="detail">
                <label>Cuatrimestre:</label>
                <span>{student.cuatrimestre}</span>
              </div>
              <div className="detail">
                <label>Email:</label>
                <span>{student.email}</span>
              </div>
              {student.telefono && (
                <div className="detail">
                  <label>Teléfono:</label>
                  <span>{student.telefono}</span>
                </div>
              )}
            </div>

            <div className="student-actions">
              <button className="view-payments">
                Ver Pagos
              </button>
              <button className="contact">
                Contactar
              </button>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No se encontraron estudiantes</h3>
          <p>No hay estudiantes que coincidan con los filtros seleccionados.</p>
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
        Mostrando {students.length} de {pagination.total} estudiantes
      </div>
    </div>
  );
};

export default AllStudents;