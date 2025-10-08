const jwt = require('jsonwebtoken');
const AuthService = require('../services/authService');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar token con el servicio de autenticación
    const verified = await AuthService.verifyToken(token);
    
    if (!verified.success) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    req.user = verified.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar rol de admin
const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar token y obtener información completa del usuario
    const verified = await AuthService.verifyToken(token);
    
    if (!verified.success) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Obtener usuario completo con rol desde la base de datos
    const User = require('../models/User');
    const user = await User.findById(verified.user.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si es admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requieren privilegios de administrador'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Error de autenticación'
    });
  }
};

module.exports = { authMiddleware, adminMiddleware };