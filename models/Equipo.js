const db = require('../config/db');  // Importar la conexión configurada con promesas

const Equipo = {
  // Obtener todos los equipos
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM equipos');  // Eliminamos .promise() ya que está integrado con db
      return rows;
    } catch (err) {
      console.error('Error en la consulta de equipos:', err);
      throw new Error('Error al obtener los equipos');
    }
  },

  // Obtener un equipo por su ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM equipos WHERE id = ?', [id]);
      return rows[0];  // Retornar el primer equipo encontrado
    } catch (err) {
      console.error('Error en la consulta del equipo:', err);
      throw new Error('Error al obtener el equipo');
    }
  },

  // Verificar si un capitán ya está asignado a un equipo en un torneo
  getByCapitanAndTorneo: async (capitan_id, torneo_id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM equipos WHERE capitan_id = ? AND torneo_id = ?',
        [capitan_id, torneo_id]
      );
      return rows[0];  // Retornar el primer equipo encontrado
    } catch (err) {
      console.error('Error en la consulta del capitán y torneo:', err);
      throw new Error('Error al verificar el capitán y torneo');
    }
  },

  // Crear un equipo
  create: async (nombre, capitan_id, torneo_id) => {
    try {
      const [result] = await db.query(
        'INSERT INTO equipos (nombre, capitan_id, torneo_id) VALUES (?, ?, ?)',
        [nombre, capitan_id, torneo_id]
      );
      return { id: result.insertId, nombre, capitan_id, torneo_id };
    } catch (err) {
      console.error('Error al crear el equipo:', err);
      throw new Error('Error al crear el equipo');
    }
  },

  // Actualizar un equipo
  update: async (id, nombre, capitan_id, torneo_id) => {
    try {
      await db.query(
        'UPDATE equipos SET nombre = ?, capitan_id = ?, torneo_id = ? WHERE id = ?',
        [nombre, capitan_id, torneo_id, id]
      );
      return { id, nombre, capitan_id, torneo_id };
    } catch (err) {
      console.error('Error al actualizar el equipo:', err);
      throw new Error('Error al actualizar el equipo');
    }
  },

  // Eliminar un equipo
  delete: async (id) => {
    try {
      await db.query('DELETE FROM equipos WHERE id = ?', [id]);
      return { id };
    } catch (err) {
      console.error('Error al eliminar el equipo:', err);
      throw new Error('Error al eliminar el equipo');
    }
  },

  getAllDetails: async () => {
    const query = `
      SELECT 
        equipos.id AS equipo_id, 
        equipos.nombre AS nombre_equipo, 
        torneos.nombre AS nombre_torneo, 
        usuarios.nombre AS nombre_capitan
      FROM 
        equipos
      LEFT JOIN 
        torneos ON equipos.torneo_id = torneos.id
      LEFT JOIN 
        usuarios ON equipos.capitan_id = usuarios.id;
    `;
    const [result] = await db.execute(query);
    return result;
  },
};

module.exports = Equipo;
