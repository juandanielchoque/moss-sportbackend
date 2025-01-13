const db = require('../config/db'); // Tu configuración de base de datos

const EquipoTorneo = {
    create: async (equipoId, torneoId, categoriaId) => {
      await db.query(
        'INSERT INTO equipo_torneos (equipo_id, torneo_id, categoria_id) VALUES (?, ?, ?)',
        [equipoId, torneoId, categoriaId]
      );
    },
  };
  

module.exports = EquipoTorneo;
