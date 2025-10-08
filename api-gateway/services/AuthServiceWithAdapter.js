const { AuthServiceAdapter } = require('../controllers/patterns/structural/ServiceAdapter');

class AuthServiceWithAdapter {
  constructor() {
    this.adapter = new AuthServiceAdapter({
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      timeout: 8000
    });
  }

  async login(credentials) {
    try {
      console.log('🔐 AuthServiceWithAdapter: Enviando login');
      const result = await this.adapter.login(credentials);
      console.log('✅ AuthServiceWithAdapter: Login exitoso');
      return result;
    } catch (error) {
      console.error('❌ AuthServiceWithAdapter: Error en login:', error.message);
      throw new Error(error.message || 'Error en servicio de autenticación');
    }
  }

  async verifyToken(token) {
    try {
      console.log('🔐 AuthServiceWithAdapter: Verificando token');
      const result = await this.adapter.verifyToken(token);
      console.log('✅ AuthServiceWithAdapter: Token verificado');
      return result;
    } catch (error) {
      console.error('❌ AuthServiceWithAdapter: Error verificando token:', error.message);
      throw new Error(error.message || 'Token inválido');
    }
  }
}

module.exports = AuthServiceWithAdapter;