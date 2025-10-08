const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.login = async (req, res) => {
  try {
    const { matricula, password } = req.body;

    // Validar campos
    if (!matricula || !password) {
      return res.status(400).json({
        success: false,
        message: 'Matrícula y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ matricula });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Matrícula o contraseña incorrectos'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Generar token
    const token = generateToken(user._id);

    // 🔥 CORRECIÓN: Incluir el role en la respuesta
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        matricula: user.matricula,
        nombre: user.nombre,
        carrera: user.carrera,
        cuatrimestre: user.cuatrimestre,
        email: user.email,
        role: user.role // ← Esto es lo que falta
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // 🔥 CORRECIÓN: Incluir el role en la respuesta
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        matricula: user.matricula,
        nombre: user.nombre,
        carrera: user.carrera,
        cuatrimestre: user.cuatrimestre,
        email: user.email,
        role: user.role // ← Esto es lo que falta
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};