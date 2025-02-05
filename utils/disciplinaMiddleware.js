// utils/disciplinaMiddleware.js
const Disciplina = require('../models/Disciplina');

const disciplinaMiddleware = async (req, res, next) => {
  const disciplinaId = req.body.disciplina_id || req.params.disciplinaId;
  
  if (!disciplinaId) {
    return res.status(400).json({ 
      message: 'Se requiere el ID de la disciplina.' 
    });
  }

  try {
    const disciplina = await Disciplina.findByPk(disciplinaId);
    if (!disciplina) {
      return res.status(404).json({ 
        message: 'Disciplina no encontrada.' 
      });
    }
    req.disciplina = disciplina;
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al verificar la disciplina.', 
      error: error.message 
    });
  }
};

module.exports = disciplinaMiddleware;