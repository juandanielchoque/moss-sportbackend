const jwt = require('jsonwebtoken');

// Clave secreta directamente en el código
const JWT_SECRET = 'mi_clave_secreta_personalizada';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Asumimos que el token se pasa en el encabezado 'Authorization'

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  // Verifica el token utilizando la clave secreta definida directamente en el código
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.', error: err.message });
    }

    // Si el token es válido, agrega la información del usuario al objeto req
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
