// models/Torneo.js
const db = require('../config/db');

const Torneo = {
  // Obtener todos los torneos
  getAll: async () => {
    try {
      const [rows] = await db.query(`
        SELECT t.*, 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'categoria_id', c.id,
              'categoria_nombre', c.nombre
            )
          ) as categorias
        FROM torneos t
        LEFT JOIN categorias c ON t.id = c.torneo_id
        GROUP BY t.id
      `);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener torneos: ' + err.message);
    }
  },

  // Obtener torneo por ID
  getById: async (id) => {
    try {
      const [torneos] = await db.query(`
        SELECT t.*, 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'disciplina_id', d.id,
              'disciplina_nombre', d.nombre,
              'tipo', d.tipo,
              'valor_puntos', d.valor_puntos
            )
          ) as disciplinas
        FROM torneos t
        LEFT JOIN torneo_disciplinas td ON t.id = td.torneo_id
        LEFT JOIN disciplinas d ON td.disciplina_id = d.id
        WHERE t.id = ?
        GROUP BY t.id
      `, [id]);
      return torneos[0];
    } catch (err) {
      throw new Error('Error al obtener torneo: ' + err.message);
    }
  },

  // Obtener torneo por nombre
  getByName: async (nombre) => {
    try {
      const [rows] = await db.query('SELECT * FROM torneos WHERE nombre = ?', [nombre]);
      return rows[0];
    } catch (err) {
      throw new Error('Error al obtener torneo por nombre: ' + err.message);
    }
  },

  // Crear nuevo torneo
  create: async (torneoData) => {
    try {
      const { nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, sistema_puntuacion } = torneoData;
      const [result] = await db.query(
        'INSERT INTO torneos (nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, sistema_puntuacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, JSON.stringify(sistema_puntuacion)]
      );
      return { id: result.insertId, ...torneoData };
    } catch (err) {
      throw new Error('Error al crear torneo: ' + err.message);
    }
  },

  // Actualizar torneo
  update: async (id, torneoData) => {
    try {
      const { nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, sistema_puntuacion } = torneoData;
      const [result] = await db.query(
        'UPDATE torneos SET nombre = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, lugar = ?, estado = ?, reglas = ?, sistema_puntuacion = ? WHERE id = ?',
        [nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas, JSON.stringify(sistema_puntuacion), id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Error al actualizar torneo: ' + err.message);
    }
  },

  // Eliminar torneo
  delete: async (id) => {
    try {
      await db.query('DELETE FROM torneos WHERE id = ?', [id]);
      return true;
    } catch (err) {
      throw new Error('Error al eliminar torneo: ' + err.message);
    }
  }
};
