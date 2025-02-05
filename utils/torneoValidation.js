// utils/torneoValidation.js
const Torneo = require('../models/Torneo');
const EquipoTorneo = require('../models/EquipoTorneo');

const torneoValidations = {
  async verificarEstadoTorneo(torneoId, estadosPermitidos) {
    const torneo = await Torneo.findByPk(torneoId);
    if (!torneo) {
      throw new Error('Torneo no encontrado');
    }
    if (!estadosPermitidos.includes(torneo.estado)) {
      throw new Error(`El torneo debe estar en estado: ${estadosPermitidos.join(', ')}`);
    }
    return torneo;
  },

  async verificarCuposTorneo(torneoId) {
    const torneo = await Torneo.findByPk(torneoId);
    const equiposInscritos = await EquipoTorneo.count({
      where: { torneo_id: torneoId }
    });
    
    if (equiposInscritos >= torneo.max_equipos) {
      throw new Error('El torneo ya ha alcanzado el número máximo de equipos.');
    }
    return { torneo, equiposInscritos };
  }
};

module.exports = torneoValidations;