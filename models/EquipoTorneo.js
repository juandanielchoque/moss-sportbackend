// models/EquipoTorneo.js

const db = require('../config/db'); // Tu configuración de base de datos

const EquipoTorneo = {
  create: async (equipoId, torneoId, categoriaId) => {
      try {
          await db.query(
              'INSERT INTO equipo_torneos (equipo_id, torneo_id, categoria_id) VALUES (?, ?, ?)',
              [equipoId, torneoId, categoriaId]
          );
      } catch (err) {
          console.error('Error al asociar equipo con torneo:', err.message);
          throw new Error('No se pudo asociar el equipo al torneo.');
      }
  },
};
