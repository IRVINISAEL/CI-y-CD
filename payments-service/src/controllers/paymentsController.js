const Payment = require('../models/Payment');
const Student = require('../models/Student');

exports.getPendingPayments = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log('🔍 Buscando pagos para:', studentId);

    // Buscar estudiante por matrícula
    const student = await Student.findOne({ matricula: studentId });
    
    if (!student) {
      console.log('❌ Estudiante no encontrado con matrícula:', studentId);
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    console.log('✅ Estudiante encontrado:', student.nombre, student._id);

    // Buscar pagos pendientes usando el ObjectId del estudiante encontrado
    const payments = await Payment.find({
      student: student._id,
      estado: 'pendiente'
    }).populate('student', 'nombre matricula carrera cuatrimestre');

    console.log('📊 Pagos encontrados:', payments.length);

    res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('💥 Error en getPendingPayments:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pagos pendientes',
      error: error.message
    });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { metodoPago } = req.body;

    console.log('💳 Procesando pago:', paymentId);

    const payment = await Payment.findById(paymentId).populate('student');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    // Generar referencia única
    const referencia = `PAGO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    payment.estado = 'pagado';
    payment.metodoPago = metodoPago;
    payment.fechaPago = new Date();
    payment.comprobante = {
      numero: referencia,
      fecha: new Date()
    };

    await payment.save();

    console.log('✅ Pago procesado exitosamente:', referencia);

    res.status(200).json({
      success: true,
      message: 'Pago procesado exitosamente',
      comprobante: payment.comprobante,
      pago: {
        id: payment._id,
        concepto: payment.concepto,
        monto: payment.monto,
        fechaPago: payment.fechaPago
      }
    });

  } catch (error) {
    console.error('💥 Error en processPayment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el pago',
      error: error.message
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log('📜 Buscando historial para:', studentId);

    // Buscar estudiante por matrícula
    const student = await Student.findOne({ matricula: studentId });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    const payments = await Payment.find({
      student: student._id
    }).populate('student', 'nombre matricula carrera cuatrimestre')
      .sort({ createdAt: -1 });

    console.log('📋 Historial encontrado:', payments.length, 'pagos');

    res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('💥 Error en getPaymentHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial de pagos',
      error: error.message
    });
  }
};
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 50, estado, carrera } = req.query;
    
    let filter = {};
    if (estado) filter.estado = estado;
    if (carrera) {
      const students = await Student.find({ carrera });
      filter.student = { $in: students.map(s => s._id) };
    }

    const payments = await Payment.find(filter)
      .populate('student', 'nombre matricula carrera cuatrimestre email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('💥 Error en getAllPayments:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos los pagos',
      error: error.message
    });
  }
};

// Obtener TODOS los estudiantes (admin)
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 50, carrera } = req.query;
    
    let filter = {};
    if (carrera) filter.carrera = carrera;

    const students = await Student.find(filter)
      .sort({ matricula: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(filter);

    // Obtener estadísticas de pagos por estudiante
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const pendingPayments = await Payment.countDocuments({
          student: student._id,
          estado: 'pendiente'
        });
        const paidPayments = await Payment.countDocuments({
          student: student._id,
          estado: 'pagado'
        });
        
        return {
          ...student.toObject(),
          stats: {
            pending: pendingPayments,
            paid: paidPayments
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      data: studentsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('💥 Error en getAllStudents:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos los estudiantes',
      error: error.message
    });
  }
};

// Obtener estadísticas de pagos (admin)
exports.getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const pendingPayments = await Payment.countDocuments({ estado: 'pendiente' });
    const paidPayments = await Payment.countDocuments({ estado: 'pagado' });
    const expiredPayments = await Payment.countDocuments({ estado: 'vencido' });

    // Recaudación total
    const revenueResult = await Payment.aggregate([
      { $match: { estado: 'pagado' } },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recaudación por carrera
    const revenueByCareer = await Payment.aggregate([
      { $match: { estado: 'pagado' } },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $group: {
          _id: '$studentInfo.carrera',
          total: { $sum: '$monto' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Pagos pendientes por carrera
    const pendingByCareer = await Payment.aggregate([
      { $match: { estado: 'pendiente' } },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      {
        $group: {
          _id: '$studentInfo.carrera',
          count: { $sum: 1 },
          totalAmount: { $sum: '$monto' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          payments: totalPayments,
          pending: pendingPayments,
          paid: paidPayments,
          expired: expiredPayments,
          revenue: totalRevenue
        },
        revenueByCareer,
        pendingByCareer
      }
    });

  } catch (error) {
    console.error('💥 Error en getPaymentStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// Crear pagos masivos (admin)
exports.createBulkPayments = async (req, res) => {
  try {
    const { payments } = req.body;

    if (!payments || !Array.isArray(payments)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de pagos'
      });
    }

    // Validar que cada pago tenga los campos requeridos
    for (const payment of payments) {
      if (!payment.student || !payment.concepto || !payment.monto) {
        return res.status(400).json({
          success: false,
          message: 'Cada pago debe tener student, concepto y monto'
        });
      }
    }

    const createdPayments = await Payment.insertMany(payments);

    res.status(201).json({
      success: true,
      message: `${createdPayments.length} pagos creados exitosamente`,
      data: createdPayments
    });

  } catch (error) {
    console.error('💥 Error en createBulkPayments:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear pagos masivos',
      error: error.message
    });
  }
};
exports.generateReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;

    console.log('🧾 Generando recibo para:', paymentId);

    const payment = await Payment.findById(paymentId).populate('student');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    const receipt = {
      numeroReferencia: payment.comprobante.numero,
      fecha: payment.comprobante.fecha,
      estudiante: {
        nombre: payment.student.nombre,
        matricula: payment.student.matricula,
        carrera: payment.student.carrera,
        cuatrimestre: payment.student.cuatrimestre
      },
      concepto: payment.concepto,
      monto: payment.monto,
      metodoPago: payment.metodoPago,
      estado: payment.estado
    };

    console.log('✅ Recibo generado para:', payment.student.nombre);

    res.status(200).json({
      success: true,
      comprobante: receipt
    });

  } catch (error) {
    console.error('💥 Error en generateReceipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar comprobante',
      error: error.message
    });
  }
};