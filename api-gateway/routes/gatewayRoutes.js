const express = require('express');
const gatewayController = require('../controllers/gatewayController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Autenticación (pública)
router.post('/auth/login', gatewayController.login);

// Rutas protegidas (todos los usuarios autenticados)
router.get('/auth/verify', authMiddleware, gatewayController.verifyToken);
router.get('/payments/pending', authMiddleware, gatewayController.getPendingPayments);
router.post('/payments/process/:paymentId', authMiddleware, gatewayController.processPayment);
router.get('/payments/history', authMiddleware, gatewayController.getPaymentHistory);
router.get('/payments/receipt/:paymentId', authMiddleware, gatewayController.generateReceipt);

// RUTAS ADMIN (solo para administradores)
router.get('/admin/payments', adminMiddleware, gatewayController.getAllPayments);
router.get('/admin/students', adminMiddleware, gatewayController.getAllStudents);
router.get('/admin/stats', adminMiddleware, gatewayController.getPaymentStats);
router.post('/admin/payments/bulk', adminMiddleware, gatewayController.createBulkPayments);

module.exports = router;