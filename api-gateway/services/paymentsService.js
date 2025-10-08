const axios = require('axios');

const PAYMENTS_SERVICE_URL = process.env.PAYMENTS_SERVICE_URL;

class PaymentsService {
  static async getPendingPayments(matricula, token) {
    try {
      console.log('🔄 Gateway: Obteniendo pagos para matrícula:', matricula);
      
      const response = await axios.get(
        `${PAYMENTS_SERVICE_URL}/api/payments/pending/${matricula}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Gateway: Pagos obtenidos exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway: Error obteniendo pagos:', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener pagos pendientes');
    }
  }

  static async processPayment(paymentId, paymentData, token) {
    try {
      console.log('🔄 Gateway: Procesando pago:', paymentId);
      
      const response = await axios.post(
        `${PAYMENTS_SERVICE_URL}/api/payments/process/${paymentId}`,
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Gateway: Pago procesado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway: Error procesando pago:', error.message);
      throw new Error(error.response?.data?.message || 'Error al procesar pago');
    }
  }

  static async getPaymentHistory(matricula, token) {
    try {
      console.log('🔄 Gateway: Obteniendo historial para:', matricula);
      
      const response = await axios.get(
        `${PAYMENTS_SERVICE_URL}/api/payments/history/${matricula}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Gateway: Historial obtenido exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway: Error obteniendo historial:', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener historial');
    }
  }

  static async generateReceipt(paymentId, token) {
    try {
      console.log('🔄 Gateway: Generando recibo para:', paymentId);
      
      const response = await axios.get(
        `${PAYMENTS_SERVICE_URL}/api/payments/receipt/${paymentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Gateway: Recibo generado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway: Error generando recibo:', error.message);
      throw new Error(error.response?.data?.message || 'Error al generar recibo');
    }
  }
    static async getAllPayments(queryParams, token) {
    try {
      console.log('🔄 Gateway (Admin): Obteniendo todos los pagos');
      
      const response = await axios.get(
        `${PAYMENTS_SERVICE_URL}/api/payments/admin/payments`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: queryParams
        }
      );
      
      console.log('✅ Gateway (Admin): Todos los pagos obtenidos');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway (Admin): Error obteniendo todos los pagos:', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener todos los pagos');
    }
  }

  static async getAllStudents(queryParams, token) {
    try {
      console.log('🔄 Gateway (Admin): Obteniendo todos los estudiantes');
      
      const response = await axios.get(
        `${PAYMENTS_SERVICE_URL}/api/payments/admin/students`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          params: queryParams
        }
      );
      
      console.log('✅ Gateway (Admin): Todos los estudiantes obtenidos');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway (Admin): Error obteniendo estudiantes:', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener todos los estudiantes');
    }
  }

  static async getPaymentStats(token) {
    try {
      console.log('🔄 Gateway (Admin): Obteniendo estadísticas');
      
      const response = await axios.get(
        `${PAYMENTS_SERVICE_URL}/api/payments/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Gateway (Admin): Estadísticas obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway (Admin): Error obteniendo estadísticas:', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }

  static async createBulkPayments(paymentsData, token) {
    try {
      console.log('🔄 Gateway (Admin): Creando pagos masivos');
      
      const response = await axios.post(
        `${PAYMENTS_SERVICE_URL}/api/payments/admin/payments/bulk`,
        paymentsData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Gateway (Admin): Pagos masivos creados');
      return response.data;
    } catch (error) {
      console.error('❌ Gateway (Admin): Error creando pagos masivos:', error.message);
      throw new Error(error.response?.data?.message || 'Error al crear pagos masivos');
    }
  }
}



module.exports = PaymentsService;