const { PaymentsServiceAdapter } = require('../controllers/patterns/structural/ServiceAdapter');

class PaymentsServiceWithAdapter {
  constructor() {
    this.adapter = new PaymentsServiceAdapter({
      url: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3002',
      timeout: 10000
    });
  }

  async getPendingPayments(matricula, token) {
    try {
      console.log('🔄 PaymentsServiceWithAdapter: Obteniendo pagos para:', matricula);
      const result = await this.adapter.getPendingPayments(matricula, token);
      console.log('✅ PaymentsServiceWithAdapter: Pagos obtenidos');
      return result;
    } catch (error) {
      console.error('❌ PaymentsServiceWithAdapter: Error obteniendo pagos:', error.message);
      throw new Error(error.message || 'Error al obtener pagos pendientes');
    }
  }

  async getPaymentStats(token) {
    try {
      console.log('📊 PaymentsServiceWithAdapter: Obteniendo estadísticas');
      const result = await this.adapter.getPaymentStats(token);
      console.log('✅ PaymentsServiceWithAdapter: Estadísticas obtenidas');
      return result;
    } catch (error) {
      console.error('❌ PaymentsServiceWithAdapter: Error obteniendo stats:', error.message);
      throw new Error(error.message || 'Error al obtener estadísticas');
    }
  }

  async processPayment(paymentId, paymentData, token) {
    try {
      console.log('💳 PaymentsServiceWithAdapter: Procesando pago:', paymentId);
      const result = await this.adapter.processPayment(paymentId, paymentData, token);
      console.log('✅ PaymentsServiceWithAdapter: Pago procesado');
      return result;
    } catch (error) {
      console.error('❌ PaymentsServiceWithAdapter: Error procesando pago:', error.message);
      throw new Error(error.message || 'Error al procesar pago');
    }
  }

  // Mantener compatibilidad con métodos existentes
  async getPaymentHistory(matricula, token) {
    try {
      const response = await this.adapter.makeRequest(`/api/payments/history/${matricula}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener historial');
    }
  }

  async generateReceipt(paymentId, token) {
    try {
      const response = await this.adapter.makeRequest(`/api/payments/receipt/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al generar recibo');
    }
  }

  async getAllPayments(queryParams, token) {
    try {
      const response = await this.adapter.makeRequest('/api/payments/admin/payments', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: queryParams
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener todos los pagos');
    }
  }

  async getAllStudents(queryParams, token) {
    try {
      const response = await this.adapter.makeRequest('/api/payments/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: queryParams
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener estudiantes');
    }
  }

  async createBulkPayments(paymentsData, token) {
    try {
      const response = await this.adapter.makeRequest('/api/payments/admin/payments/bulk', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        data: paymentsData
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al crear pagos masivos');
    }
  }
}

module.exports = PaymentsServiceWithAdapter;