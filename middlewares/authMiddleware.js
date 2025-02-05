// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    // Log para ver todos los headers recibidos
    console.log('Headers recibidos:', req.headers);

    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      console.log('No se encontró header de autorización');
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó header de autorización'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    if (!token) {
      console.log('No se encontró token en el header');
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está definido en variables de entorno');
      return res.status(500).json({
        success: false,
        message: 'Error en la configuración del servidor'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    if (!decoded.id) {
      console.log('Token decodificado no contiene ID de usuario');
      return res.status(401).json({
        success: false,
        message: 'Token inválido: falta información del usuario'
      });
    }

    // Guardar la información decodificada en req.user
    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      nombre: decoded.nombre
    };

    console.log('Usuario autenticado:', req.user);
    next();

  } catch (error) {
    console.error('Error en autenticación:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o mal formado'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error en la autenticación',
      error: error.message
    });
  }
};

module.exports = authenticateToken;