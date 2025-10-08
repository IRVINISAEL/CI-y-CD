const AuthService = require('../services/authService');
const PaymentsService = require('../services/paymentsService');

class GatewayController {
  async login(req, res) {
    try {
      const { matricula, password } = req.body;

      console.log('🔐 Gateway: Intentando login para:', matricula);

      if (!matricula || !password) {
        return res.status(400).json({
          success: false,
          message: 'Matrícula y contraseña son requeridos'
        });
      }

      const authResult = await AuthService.login({ matricula, password });
      
      if (authResult.success) {
        console.log('✅ Gateway: Login exitoso, usuario:', authResult.user.nombre);
        console.log('🔍 Gateway: Rol del usuario:', authResult.user.role);
        
        let responseData = {
          success: true,
          token: authResult.token,
          user: authResult.user // ← Ya incluye el role desde auth-service
        };

        // Solo obtener pagos si NO es admin
        if (authResult.user.role !== 'admin') {
          console.log('📊 Gateway: Obteniendo pagos para estudiante...');
          try {
            const paymentsResult = await PaymentsService.getPendingPayments(
              authResult.user.matricula,
              authResult.token
            );
            responseData.pendingPayments = paymentsResult.data || [];
            console.log(`📊 Gateway: ${responseData.pendingPayments.length} pagos pendientes obtenidos`);
          } catch (paymentError) {
            console.error('⚠️ Gateway: Error obteniendo pagos, continuando sin pagos:', paymentError.message);
            responseData.pendingPayments = [];
          }
        } else {
          console.log('👑 Gateway: Usuario es admin, omitiendo pagos pendientes');
          responseData.pendingPayments = [];
        }

        console.log('🎉 Gateway: Login completo - Rol:', authResult.user.role);
        res.status(200).json(responseData);
      } else {
        console.log('❌ Gateway: Login fallido');
        res.status(401).json(authResult);
      }
    } catch (error) {
      console.error('💥 Gateway: Error en login:', error.message);
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

      console.log('🔄 Gateway: Verificando token...');

      const verified = await AuthService.verifyToken(token);

      if (verified.success) {
        console.log('✅ Gateway: Token válido, usuario:', verified.user.nombre);
        console.log('🔍 Gateway: Rol del usuario:', verified.user.role);
        
        let responseData = {
          success: true,
          user: verified.user // ← Ya incluye el role desde auth-service
        };

        // Solo obtener pagos si NO es admin
        if (verified.user.role !== 'admin') {
          console.log('📊 Gateway: Obteniendo pagos para estudiante...');
          try {
            const payments = await PaymentsService.getPendingPayments(
              verified.user.matricula,
              token
            );
            responseData.pendingPayments = payments.data || [];
            console.log(`📊 Gateway: ${responseData.pendingPayments.length} pagos pendientes obtenidos`);
          } catch (paymentError) {
            console.error('⚠️ Gateway: Error obteniendo pagos, continuando sin pagos:', paymentError.message);
            responseData.pendingPayments = [];
          }
        } else {
          console.log('👑 Gateway: Usuario es admin, omitiendo pagos pendientes');
          responseData.pendingPayments = [];
        }

        console.log('✅ Gateway: Verificación completa - Rol:', verified.user.role);
        res.status(200).json(responseData);
      } else {
        console.log('❌ Gateway: Token inválido');
        res.status(401).json(verified);
      }
    } catch (error) {
      console.error('💥 Gateway: Error verificando token:', error.message);
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

      console.log('🔄 Gateway: Solicitando pagos pendientes para:', matricula);

      const payments = await PaymentsService.getPendingPayments(matricula, token);
      
      console.log('✅ Gateway: Pagos pendientes enviados');
      res.status(200).json(payments);
    } catch (error) {
      console.error('💥 Gateway: Error obteniendo pagos pendientes:', error.message);
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

      console.log('🔄 Gateway: Procesando pago ID:', paymentId);

      const result = await PaymentsService.processPayment(
        paymentId, 
        { metodoPago }, 
        token
      );

      console.log('✅ Gateway: Pago procesado exitosamente');
      res.status(200).json(result);
    } catch (error) {
      console.error('💥 Gateway: Error procesando pago:', error.message);
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

      console.log('🔄 Gateway: Solicitando historial para:', matricula);

      const history = await PaymentsService.getPaymentHistory(matricula, token);
      
      console.log('✅ Gateway: Historial enviado');
      res.status(200).json(history);
    } catch (error) {
      console.error('💥 Gateway: Error obteniendo historial:', error.message);
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

      console.log('🔄 Gateway: Generando recibo para pago:', paymentId);

      const receipt = await PaymentsService.generateReceipt(paymentId, token);
      
      console.log('✅ Gateway: Recibo generado');
      res.status(200).json(receipt);
    } catch (error) {
      console.error('💥 Gateway: Error generando recibo:', error.message);
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

      console.log('🔄 Gateway: Admin solicitando todos los pagos');

      const payments = await PaymentsService.getAllPayments(queryParams, token);
      
      console.log('✅ Gateway: Todos los pagos enviados al admin');
      res.status(200).json(payments);
    } catch (error) {
      console.error('💥 Gateway: Error obteniendo todos los pagos:', error.message);
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

      console.log('🔄 Gateway: Admin solicitando todos los estudiantes');

      const students = await PaymentsService.getAllStudents(queryParams, token);
      
      console.log('✅ Gateway: Todos los estudiantes enviados al admin');
      res.status(200).json(students);
    } catch (error) {
      console.error('💥 Gateway: Error obteniendo todos los estudiantes:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaymentStats(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      console.log('🔄 Gateway: Admin solicitando estadísticas');

      const stats = await PaymentsService.getPaymentStats(token);
      
      console.log('✅ Gateway: Estadísticas enviadas al admin');
      res.status(200).json(stats);
    } catch (error) {
      console.error('💥 Gateway: Error obteniendo estadísticas:', error.message);
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

      console.log('🔄 Gateway: Admin creando pagos masivos');

      const result = await PaymentsService.createBulkPayments({ payments }, token);
      
      console.log('✅ Gateway: Pagos masivos creados');
      res.status(200).json(result);
    } catch (error) {
      console.error('💥 Gateway: Error creando pagos masivos:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new GatewayController();