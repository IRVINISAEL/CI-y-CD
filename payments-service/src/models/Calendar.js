const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  cuatrimestre: {
    type: String,
    required: true
  },
  carrera: {
    type: String,
    required: true
  },
  nivel: {
    type: String,
    required: true
  },
  pagos: [{
    concepto: String,
    monto: Number,
    fechaLimite: Date,
    tipo: {
      type: String,
      enum: ['inscripcion', 'colegiatura', 'seguro', 'titulacion']
    }
  }],
  vigente: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Calendar', calendarSchema);