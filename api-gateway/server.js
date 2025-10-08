const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Importar el nuevo controller refactorizado
const GatewayControllerRefactored = require('./controllers/patterns/emergent/GatewayControllerRefactored');
const gatewayRoutes = require('./routes/gatewayRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Crear instancia del controller refactorizado
const gatewayController = new GatewayControllerRefactored();

// Health check mejorado
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'API Gateway is running', 
    version: '2.0.0',
    patterns: ['Factory Method', 'Adapter', 'Observer', 'MVC'],
    timestamp: new Date().toISOString()
  });
});

// Info de patrones implementados
app.get('/patterns-info', (req, res) => {
  res.status(200).json({
    patterns: {
      creational: 'Factory Method - Para respuestas de autenticación',
      structural: 'Adapter - Para comunicación entre microservicios', 
      behavioral: 'Observer - Para notificaciones de pagos',
      emergent: 'MVC - Para arquitectura del gateway'
    },
    benefits: [
      'Código más mantenible y testeable',
      'Menos acoplamiento entre servicios',
      'Fácil agregar nuevos tipos de notificaciones',
      'Mejor escalabilidad'
    ]
  });
});

// Usar las rutas existentes pero con el nuevo controller
// Nota: Las rutas seguirán funcionando igual
app.use('/api', gatewayRoutes);

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('💥 Error global:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.listen(PORT, () => {
  console.log('🚀 API Gateway con Patrones de Diseño');
  console.log(`📍 Puerto: ${PORT}`);
  console.log('🎯 Patrones implementados:');
  console.log('   • Factory Method (Creacional)');
  console.log('   • Adapter (Estructural)');
  console.log('   • Observer (Behavioral)');
  console.log('   • MVC (Emergente)');
  console.log('📊 Prueba los endpoints:');
  console.log(`   • Health: http://localhost:${PORT}/health`);
  console.log(`   • Patrones: http://localhost:${PORT}/patterns-info`);
});