// utils/resultadoValidation.js
const Resultado = require('../models/Resultado');
const TorneoDisciplina = require('../models/TorneoDisciplina');

const resultadoValidations = {
  async validarPuntuacion(torneoId, disciplinaId, puntos) {
    const torneoDisciplina = await TorneoDisciplina.findOne({
      where: { torneo_id: torneoId, disciplina_id: disciplinaId }
    });

    if (!torneoDisciplina) {
      throw new Error('La disciplina no está asociada a este torneo.');
    }

    // Validar que los puntos estén dentro del rango permitido
    if (puntos < 0 || puntos > torneoDisciplina.max_puntos) {
      throw new Error(`Los puntos deben estar entre 0 y ${torneoDisciplina.max_puntos}`);
    }
  },

  async validarResultadoUnico(equipoId, torneoId, disciplinaId, categoriaId) {
    const resultadoExistente = await Resultado.findOne({
      where: {
        equipo_id: equipoId,
        torneo_id: torneoId,
        disciplina_id: disciplinaId,
        categoria_id: categoriaId
      }
    });

    if (resultadoExistente) {
      throw new Error('Ya existe un resultado para este equipo en esta disciplina.');
    }
  }
};

module.exports = resultadoValidations;