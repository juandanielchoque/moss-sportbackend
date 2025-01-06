const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mi_clave_secreta_personalizada';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Almacenar la información del usuario en `req.user`
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
