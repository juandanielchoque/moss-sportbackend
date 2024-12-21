// models/Jugador.js

const db = require('../config/db');

const Jugador = {
  create: async ({ nombre, edad, posicion, numero_camiseta, equipo_id }) => {
    try {
      const [result] = await db.query(
        `INSERT INTO jugadores (nombre, edad, posicion, numero_camiseta, equipo_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, edad, posicion, numero_camiseta, equipo_id]
      );
      return { id: result.insertId, nombre, edad, posicion, numero_camiseta, equipo_id };
    } catch (err) {
      throw new Error('Error al crear el jugador: ' + err.message);
    }
  },
  
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM jugadores');
      return rows;
    } catch (err) {
      throw new Error('Error al obtener los jugadores: ' + err.message);
    }
  },
  
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM jugadores WHERE id = ?', [id]);
      return rows[0];  // Retorna el primer jugador encontrado
    } catch (err) {
      throw new Error('Error al obtener el jugador: ' + err.message);
    }
  },
  
  update: async (id, { nombre, edad, posicion, numero_camiseta, equipo_id }) => {
    try {
      const [result] = await db.query(
        'UPDATE jugadores SET nombre = ?, edad = ?, posicion = ?, numero_camiseta = ?, equipo_id = ? WHERE id = ?',
        [nombre, edad, posicion, numero_camiseta, equipo_id, id]
      );
      if (result.affectedRows > 0) {
        return { id, nombre, edad, posicion, numero_camiseta, equipo_id };
      }
      return null;  // Retorna null si no se actualizó ningún jugador
    } catch (err) {
      throw new Error('Error al actualizar el jugador: ' + err.message);
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM jugadores WHERE id = ?', [id]);
      return result.affectedRows > 0;  // Retorna true si se eliminó el jugador
    } catch (err) {
      throw new Error('Error al eliminar el jugador: ' + err.message);
    }
  }
};

module.exports = Jugador;
