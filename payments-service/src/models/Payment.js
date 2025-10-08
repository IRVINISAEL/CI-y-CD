const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  referencia: {
    type: String,
    required: true,
    unique: true
  },
  concepto: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  cuatrimestre: {
    type: String,
    required: true
  },
  fechaVencimiento: Date,
  fechaPago: Date,
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'vencido'],
    default: 'pendiente'
  },
  metodoPago: String,
  comprobante: {
    numero: String,
    fecha: Date,
    archivo: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);