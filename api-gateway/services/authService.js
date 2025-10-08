const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

class AuthService {
  static async login(credentials) {
    try {
      console.log('🔐 AuthService: Enviando login a', AUTH_SERVICE_URL);
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, credentials);
      console.log('✅ AuthService: Login exitoso, respuesta recibida');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error en login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error en servicio de autenticación');
    }
  }

  static async verifyToken(token) {
    try {
      console.log('🔐 AuthService: Verificando token');
      const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ AuthService: Token verificado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Error verificando token:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Token inválido');
    }
  }

  // 🔥 CORRECIÓN: Ya no necesitamos getUserById porque el auth-service devuelve el role
}

module.exports = AuthService;