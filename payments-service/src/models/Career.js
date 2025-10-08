const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  nivel: {
    type: String,
    enum: ['TSU', 'Licenciatura', 'Ingeniería', 'Maestría'],
    required: true
  },
  duracion: String,
  costoCuatrimestre: Number,
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Career', careerSchema);