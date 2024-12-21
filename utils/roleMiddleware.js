// utils/roleMiddleware.js

const roleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
      const user = req.user; // Suponiendo que el usuario se almacena en req.user después de autenticarse
  
      if (!user || !rolesPermitidos.includes(user.rol)) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;
  