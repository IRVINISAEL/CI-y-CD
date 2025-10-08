const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  matricula: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  carrera: {
    type: String,
    required: true
  },
  cuatrimestre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telefono: String,
  direccion: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);