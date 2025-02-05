const db = require('../config/db');

const Equipo = {
  // Obtener todos los equipos con información relacionada
  getAll: async () => {
    try {
      const [rows] = await db.query(`
        SELECT e.*, u.nombre as capitan_nombre
        FROM equipos e
        LEFT JOIN usuarios u ON e.capitan_id = u.id
      `);
      return rows;
    } catch (err) {
      console.error('Error en la consulta de equipos:', err);
      throw new Error('Error al obtener los equipos');
    }
  },

  // Obtener un equipo por su ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(`
        SELECT e.*, u.nombre as capitan_nombre
        FROM equipos e
        LEFT JOIN usuarios u ON e.capitan_id = u.id
        WHERE e.id = ?
      `, [id]);
      return rows[0];
    } catch (err) {
      console.error('Error en la consulta del equipo:', err);
      throw new Error('Error al obtener el equipo');
    }
  },

  // Actualizar nombre y capitán del equipo
  updateNombreAndCapitan: async (equipo_id, nuevo_nombre, nuevo_email_capitan) => {
    try {
      const [capitan] = await db.query(
        'SELECT id FROM usuarios WHERE email = ? AND rol = "capitan"',
        [nuevo_email_capitan]
      );

      if (!capitan || capitan.length === 0) {
        throw new Error('Capitán no encontrado o no tiene el rol adecuado');
      }

      await db.query(
        'UPDATE equipos SET nombre = ?, capitan_id = ? WHERE id = ?',
        [nuevo_nombre, capitan[0].id, equipo_id]
      );
    } catch (err) {
      console.error('Error al actualizar equipo:', err);
      throw new Error('Error al actualizar nombre y capitán del equipo');
    }
  },

  // Verificar si un capitán ya está asignado a un equipo en un torneo
  getByCapitanAndTorneo: async (capitan_id, torneo_id) => {
    try {
      const [rows] = await db.query(`
        SELECT e.* 
        FROM equipos e
        JOIN equipo_torneos et ON e.id = et.equipo_id
        WHERE e.capitan_id = ? AND et.torneo_id = ?
      `, [capitan_id, torneo_id]);
      return rows[0];
    } catch (err) {
      console.error('Error en la consulta del capitán y torneo:', err);
      throw new Error('Error al verificar el capitán y torneo');
    }
  },

  // Crear un nuevo equipo
  create: async (nombre, capitan_id) => {
    try {
      const [result] = await db.query(
        'INSERT INTO equipos (nombre, capitan_id) VALUES (?, ?)',
        [nombre, capitan_id]
      );
      return { id: result.insertId, nombre, capitan_id };
    } catch (err) {
      console.error('Error al crear equipo:', err);
      throw new Error('Error al crear el equipo');
    }
  },

  // Asociar un equipo a un torneo con su categoría
  addToTorneo: async (equipo_id, torneo_id, categoria_id) => {
    try {
      await db.query(
        'INSERT INTO equipo_torneos (equipo_id, torneo_id, categoria_id) VALUES (?, ?, ?)',
        [equipo_id, torneo_id, categoria_id]
      );
    } catch (err) {
      console.error('Error al asociar equipo al torneo:', err);
      throw new Error('Error al asociar equipo al torneo');
    }
  },

  // Obtener equipos por torneo y categoría
  getEquiposByTorneoYCategoria: async () => {
    try {
      const query = `
        SELECT 
          e.id AS equipo_id,  
          e.nombre AS equipo_nombre,
          t.nombre AS torneo_nombre,
          u.nombre AS creador_equipo,
          c.nombre AS categoria_nombre
        FROM equipo_torneos et
        JOIN equipos e ON et.equipo_id = e.id
        JOIN torneos t ON et.torneo_id = t.id
        JOIN categorias c ON et.categoria_id = c.id
        JOIN usuarios u ON e.capitan_id = u.id
        ORDER BY e.nombre
      `;
      const [equipos] = await db.query(query);
      return equipos;
    } catch (err) {
      console.error('Error al obtener equipos por torneo y categoría:', err);
      throw new Error('Error al obtener los equipos');
    }
  },

  // Obtener torneos asociados a un equipo
  getTorneosByEquipo: async (equipo_id) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          t.id AS torneo_id, 
          t.nombre AS torneo_nombre, 
          c.id AS categoria_id, 
          c.nombre AS categoria_nombre
        FROM equipo_torneos et
        JOIN torneos t ON et.torneo_id = t.id
        JOIN categorias c ON et.categoria_id = c.id
        WHERE et.equipo_id = ?
      `, [equipo_id]);
      return rows;
    } catch (err) {
      console.error('Error al obtener torneos del equipo:', err);
      throw new Error('Error al obtener los torneos del equipo');
    }
  },

  // Eliminar todas las asociaciones de un equipo con torneos
  removeAllFromTorneo: async (equipo_id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM equipo_torneos WHERE equipo_id = ?',
        [equipo_id]
      );
      return result;
    } catch (err) {
      console.error('Error al eliminar asociaciones con torneos:', err);
      throw new Error('Error al eliminar asociaciones con torneos');
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
  
  findByCapitánId: async (capitanId) => {
    const [rows] = await db.query('SELECT * FROM equipos WHERE capitan_id = ?', [capitanId]);
    if (rows.length === 0) {
      throw new Error('No se encontró ningún equipo asociado a este capitán.');
    }
    return rows[0];
  }
};

module.exports = Equipo;