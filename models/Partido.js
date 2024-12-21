// models/Partido.js

const db = require('../config/db');  // Importa la conexión a la base de datos

const Partido = {
  create: async ({ torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro }) => {
    try {
      const [result] = await db.query(
        `INSERT INTO partidos (torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro]
      );
      return { id: result.insertId, torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro };
    } catch (err) {
      throw new Error('Error al crear el partido: ' + err.message);
    }
  },
  
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM partidos');
      return rows;
    } catch (err) {
      throw new Error('Error al obtener los partidos: ' + err.message);
    }
  },
  
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM partidos WHERE id = ?', [id]);
      return rows[0];  // Retorna el primer partido encontrado
    } catch (err) {
      throw new Error('Error al obtener el partido: ' + err.message);
    }
  },
  
  update: async (id, { goles_local, goles_visitante, estado }) => {
    try {
      const [result] = await db.query(
        'UPDATE partidos SET goles_local = ?, goles_visitante = ?, estado = ? WHERE id = ?',
        [goles_local, goles_visitante, estado, id]
      );
      if (result.affectedRows > 0) {
        return { id, goles_local, goles_visitante, estado };
      }
      return null;  // Retorna null si no se actualizó ningún partido
    } catch (err) {
      throw new Error('Error al actualizar el partido: ' + err.message);
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM partidos WHERE id = ?', [id]);
      return result.affectedRows > 0;  // Retorna true si se eliminó el partido
    } catch (err) {
      throw new Error('Error al eliminar el partido: ' + err.message);
    }
  }
};

module.exports = Partido;
