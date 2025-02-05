const db = require('../config/db');

const Categoria = {
  // Obtener todas las categorías
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM categorias');
    return results;
  },

  // Obtener categorías por torneo
  getByTorneo: async (torneo_id) => {
    try {
      const [rows] = await db.query(`
        SELECT c.* 
        FROM categorias c
        WHERE c.torneo_id = ?
      `, [torneo_id]);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener categorías del torneo: ' + err.message);
    }
  },

  // Crear nueva categoría
  create: async (nombre, torneo_id) => {
    try {
      const [result] = await db.query(
        'INSERT INTO categorias (nombre, torneo_id) VALUES (?, ?)',
        [nombre, torneo_id]
      );
      return { id: result.insertId, nombre, torneo_id };
    } catch (err) {
      throw new Error('Error al crear categoría: ' + err.message);
    }
  },

  // Actualizar categoría
  update: async (id, nombre) => {
    try {
      const [result] = await db.query(
        'UPDATE categorias SET nombre = ? WHERE id = ?',
        [nombre, id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Error al actualizar categoría: ' + err.message);
    }
  },

  // Eliminar categoría
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Error al eliminar categoría: ' + err.message);
    }
  },

  // Obtener categorías con equipos y torneos
  getAllWithDetails: async () => {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.id AS categoria_id,
          c.nombre AS categoria_nombre,
          t.id AS torneo_id,
          t.nombre AS torneo_nombre,
          e.id AS equipo_id,
          e.nombre AS equipo_nombre,
          u.nombre AS capitan_nombre
        FROM categorias c
        JOIN torneos t ON c.torneo_id = t.id
        LEFT JOIN equipo_torneos et ON c.id = et.categoria_id
        LEFT JOIN equipos e ON et.equipo_id = e.id
        LEFT JOIN usuarios u ON e.capitan_id = u.id
        ORDER BY c.nombre
      `);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener detalles de categorías: ' + err.message);
    }
  }
};

module.exports = Categoria;