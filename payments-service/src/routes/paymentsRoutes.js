const express = require('express');
const {
  getPendingPayments,
  processPayment,
  getPaymentHistory,
  generateReceipt,
  // Nuevos endpoints admin
  getAllPayments,
  getAllStudents,
  getPaymentStats,
  createBulkPayments
} = require('../controllers/paymentsController');

const router = express.Router();

// Rutas normales (estudiantes)
router.get('/pending/:studentId', getPendingPayments);
router.post('/process/:paymentId', processPayment);
router.get('/history/:studentId', getPaymentHistory);
router.get('/receipt/:paymentId', generateReceipt);

// Nuevas rutas admin
router.get('/admin/payments', getAllPayments);
router.get('/admin/students', getAllStudents);
router.get('/admin/stats', getPaymentStats);
router.post('/admin/payments/bulk', createBulkPayments);

module.exports = router;