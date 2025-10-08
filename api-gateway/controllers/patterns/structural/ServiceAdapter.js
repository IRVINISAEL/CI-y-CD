const axios = require('axios');

class ServiceAdapter {
  constructor(serviceConfig) {
    this.serviceUrl = serviceConfig.url;
    this.timeout = serviceConfig.timeout || 5000;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const response = await axios({
        url: `${this.serviceUrl}${endpoint}`,
        timeout: this.timeout,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Service error: ${error.response?.data?.message || error.message}`);
    }
  }
}

class AuthServiceAdapter extends ServiceAdapter {
  async login(credentials) {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      data: credentials
    });
  }

  async verifyToken(token) {
    return this.makeRequest('/api/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}

class PaymentsServiceAdapter extends ServiceAdapter {
  async getPendingPayments(matricula, token) {
    return this.makeRequest(`/api/payments/pending/${matricula}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  async getPaymentStats(token) {
    return this.makeRequest('/api/payments/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  async processPayment(paymentId, paymentData, token) {
    return this.makeRequest(`/api/payments/process/${paymentId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      data: paymentData
    });
  }
}

module.exports = { ServiceAdapter, AuthServiceAdapter, PaymentsServiceAdapter };