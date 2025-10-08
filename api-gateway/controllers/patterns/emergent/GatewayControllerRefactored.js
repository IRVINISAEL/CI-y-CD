const AuthResponseFactory = require('../creational/AuthResponseFactory');
const AuthServiceWithAdapter = require('../../../services/AuthServiceWithAdapter');
const PaymentsServiceWithAdapter = require('../../../services/PaymentsServiceWithAdapter');
const { PaymentSubject, EmailNotificationObserver, AnalyticsObserver, LoggingObserver } = require('../behavioral/PaymentObserver');

class GatewayControllerRefactored {
  constructor() {
    this.authService = new AuthServiceWithAdapter();
    this.paymentsService = new PaymentsServiceWithAdapter();
    this.paymentSubject = new PaymentSubject();
    
    // Registrar observadores
    this.setupObservers();
  }

  setupObservers() {
    this.paymentSubject.addObserver(new EmailNotificationObserver());
    this.paymentSubject.addObserver(new AnalyticsObserver());
    this.paymentSubject.addObserver(new LoggingObserver());
    console.log('👀 Observadores configurados para pagos');
  }

  async login(req, res) {
    try {
      const { matricula, password } = req.body;

      console.log('🔐 Gateway Refactored: Intentando login para:', matricula);

      if (!matricula || !password) {
        return res.status(400).json({
          success: false,
          message: 'Matrícula y contraseña son requeridos'
        });
      }

      const authResult = await this.authService.login({ matricula, password });
      
      if (!authResult.success) {
        console.log('❌ Gateway Refactored: Login fallido');
        return res.status(401).json(authResult);
      }

      console.log('✅ Gateway Refactored: Login exitoso, usuario:', authResult.user.nombre);
      console.log('🔍 Gateway Refactored: Rol del usuario:', authResult.user.role);

      // Usar Factory Method para crear respuesta según el rol
      let additionalData = {};
      
      if (authResult.user.role !== 'admin') {
        console.log('📊 Gateway Refactored: Obteniendo pagos para estudiante...');
        try {
          const paymentsResult = await this.paymentsService.getPendingPayments(
            authResult.user.matricula,
            authResult.token
          );
          additionalData.pendingPayments = paymentsResult.data || [];
          console.log(`📊 Gateway Refactored: ${additionalData.pendingPayments.length} pagos pendientes obtenidos`);
        } catch (paymentError) {
          console.error('⚠️ Gateway Refactored: Error obteniendo pagos, continuando sin pagos:', paymentError.message);
          additionalData.pendingPayments = [];
        }
      } else {
        console.log('👑 Gateway Refactored: Usuario es admin, obteniendo estadísticas...');
        try {
          const statsResult = await this.paymentsService.getPaymentStats(authResult.token);
          additionalData.stats = statsResult.data || {};
          console.log('📈 Gateway Refactored: Estadísticas obtenidas para admin');
        } catch (statsError) {
          console.error('⚠️ Gateway Refactored: Error obteniendo stats, continuando sin stats:', statsError.message);
          additionalData.stats = {};
        }
      }

      // Crear respuesta usando Factory Method
      const userType = authResult.user.role === 'admin' ? 'admin' : 'student';
      const response = AuthResponseFactory.createResponse(userType, authResult, additionalData);

      console.log('🎉 Gateway Refactored: Login completo - Rol:', authResult.user.role);
      res.status(200).json(response);

    } catch (error) {
      console.error('💥 Gateway Refactored: Error en login:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      console.log('🔄 Gateway Refactored: Verificando token...');

      const verified = await this.authService.verifyToken(token);

      if (!verified.success) {
        console.log('❌ Gateway Refactored: Token inválido');
        return res.status(401).json(verified);
      }

      console.log('✅ Gateway Refactored: Token válido, usuario:', verified.user.nombre);
      console.log('🔍 Gateway Refactored: Rol del usuario:', verified.user.role);

      let responseData = {
        success: true,
        user: verified.user
      };

      // Solo obtener pagos si NO es admin
      if (verified.user.role !== 'admin') {
        console.log('📊 Gateway Refactored: Obteniendo pagos para estudiante...');
        try {
          const payments = await this.paymentsService.getPendingPayments(
            verified.user.matricula,
            token
          );
          responseData.pendingPayments = payments.data || [];
          console.log(`📊 Gateway Refactored: ${responseData.pendingPayments.length} pagos pendientes obtenidos`);
        } catch (paymentError) {
          console.error('⚠️ Gateway Refactored: Error obteniendo pagos, continuando sin pagos:', paymentError.message);
          responseData.pendingPayments = [];
        }
      } else {
        console.log('👑 Gateway Refactored: Usuario es admin, omitiendo pagos pendientes');
        responseData.pendingPayments = [];
      }

      console.log('✅ Gateway Refactored: Verificación completa - Rol:', verified.user.role);
      res.status(200).json(responseData);

    } catch (error) {
      console.error('💥 Gateway Refactored: Error verificando token:', error.message);
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }

  async getPendingPayments(req, res) {
    try {
      const matricula = req.user.matricula;
      const token = req.headers.authorization.split(' ')[1];

      console.log('🔄 Gateway Refactored: Solicitando pagos pendientes para:', matricula);

      const payments = await this.paymentsService.getPendingPayments(matricula, token);
      
      console.log('✅ Gateway Refactored: Pagos pendientes enviados');
      res.status(200).json(payments);
    } catch (error) {
      console.error('💥 Gateway Refactored: Error obteniendo pagos pendientes:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async processPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const { metodoPago } = req.body;
      const token = req.headers.authorization.split(' ')[1];

      console.log('🔄 Gateway Refactored: Procesando pago ID:', paymentId);

      const result = await this.paymentsService.processPayment(
        paymentId, 
        { metodoPago }, 
        token
      );

      // Notificar a todos los observadores del pago procesado
      await this.paymentSubject.notify('payment_processed', {
        ...result,
        student: req.user
      });

      console.log('✅ Gateway Refactored: Pago procesado exitosamente');
      res.status(200).json(result);

    } catch (error) {
      console.error('💥 Gateway Refactored: Error procesando pago:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaymentHistory(req, res) {
    try {
      const matricula = req.user.matricula;
      const token = req.headers.authorization.split(' ')[1];

      console.log('🔄 Gateway Refactored: Solicitando historial para:', matricula);

      const history = await this.paymentsService.getPaymentHistory(matricula, token);
      
      console.log('✅ Gateway Refactored: Historial enviado');
      res.status(200).json(history);
    } catch (error) {
      console.error('💥 Gateway Refactored: Error obteniendo historial:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async generateReceipt(req, res) {
    try {
      const { paymentId } = req.params;
      const token = req.headers.authorization.split(' ')[1];

      console.log('🔄 Gateway Refactored: Generando recibo para pago:', paymentId);

      const receipt = await this.paymentsService.generateReceipt(paymentId, token);
      
      console.log('✅ Gateway Refactored: Recibo generado');
      res.status(200).json(receipt);
    } catch (error) {
      console.error('💥 Gateway Refactored: Error generando recibo:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllPayments(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const queryParams = req.query;

      console.log('🔄 Gateway Refactored: Admin solicitando todos los pagos');

      const payments = await this.paymentsService.getAllPayments(queryParams, token);
      
      console.log('✅ Gateway Refactored: Todos los pagos enviados al admin');
      res.status(200).json(payments);
    } catch (error) {
      console.error('💥 Gateway Refactored: Error obteniendo todos los pagos:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllStudents(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const queryParams = req.query;

      console.log('🔄 Gateway Refactored: Admin solicitando todos los estudiantes');

      const students = await this.paymentsService.getAllStudents(queryParams, token);
      
      console.log('✅ Gateway Refactored: Todos los estudiantes enviados al admin');
      res.status(200).json(students);
    } catch (error) {
      console.error('💥 Gateway Refactored: Error obteniendo todos los estudiantes:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaymentStats(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      console.log('🔄 Gateway Refactored: Admin solicitando estadísticas');

      const stats = await this.paymentsService.getPaymentStats(token);
      
      console.log('✅ Gateway Refactored: Estadísticas enviadas al admin');
      res.status(200).json(stats);
    } catch (error) {
      console.error('💥 Gateway Refactored: Error obteniendo estadísticas:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createBulkPayments(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { payments } = req.body;

      console.log('🔄 Gateway Refactored: Admin creando pagos masivos');

      const result = await this.paymentsService.createBulkPayments({ payments }, token);
      
      console.log('✅ Gateway Refactored: Pagos masivos creados');
      res.status(200).json(result);
    } catch (error) {
      console.error('💥 Gateway Refactored: Error creando pagos masivos:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = GatewayControllerRefactored;