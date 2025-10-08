class AuthResponseFactory {
  static createResponse(userType, userData, additionalData = {}) {
    switch (userType) {
      case 'student':
        return new StudentAuthResponse(userData, additionalData);
      case 'admin':
        return new AdminAuthResponse(userData, additionalData);
      default:
        throw new Error(`Tipo de usuario no soportado: ${userType}`);
    }
  }
}

class StudentAuthResponse {
  constructor(userData, { pendingPayments = [] }) {
    this.success = true;
    this.token = userData.token;
    this.user = {
      id: userData.user.id,
      matricula: userData.user.matricula,
      nombre: userData.user.nombre,
      carrera: userData.user.carrera,
      cuatrimestre: userData.user.cuatrimestre,
      email: userData.user.email,
      role: userData.user.role
    };
    this.pendingPayments = pendingPayments;
  }
}

class AdminAuthResponse {
  constructor(userData, { stats = {} }) {
    this.success = true;
    this.token = userData.token;
    this.user = {
      id: userData.user.id,
      matricula: userData.user.matricula,
      nombre: userData.user.nombre,
      role: userData.user.role
    };
    this.dashboardData = stats;
  }
}

module.exports = AuthResponseFactory;