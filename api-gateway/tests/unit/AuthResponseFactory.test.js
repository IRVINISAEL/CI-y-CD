const AuthResponseFactory = require('../../controllers/patterns/creational/AuthResponseFactory');

describe('AuthResponseFactory', () => {
  test('crea respuesta de estudiante correctamente', () => {
    const userData = {
      token: 'test-token',
      user: {
        id: '1', matricula: '2023001', nombre: 'Juan Pérez',
        carrera: 'Enfermería', cuatrimestre: '3ro', email: 'juan@utt.edu.mx', role: 'student'
      }
    };
    
    const response = AuthResponseFactory.createResponse('student', userData, {
      pendingPayments: [{ id: 1, concepto: 'Colegiatura', monto: 1000 }]
    });
    
    expect(response.success).toBe(true);
    expect(response.user.role).toBe('student');
    expect(response.pendingPayments).toHaveLength(1);
  });

  test('crea respuesta de admin correctamente', () => {
    const userData = {
      token: 'admin-token', 
      user: {
        id: '2', matricula: 'admin001', nombre: 'Admin', role: 'admin'
      }
    };
    
    const response = AuthResponseFactory.createResponse('admin', userData, {
      stats: { totalPayments: 150 }
    });
    
    expect(response.success).toBe(true);
    expect(response.user.role).toBe('admin');
    expect(response.dashboardData.totalPayments).toBe(150);
  });
});