// models/Evidencia.js
const Evidencia = {
  // Obtener todas las evidencias
  getAll: async () => {
    try {
      const [rows] = await db.query(`
        SELECT e.*, p.fecha_hora as partido_fecha
        FROM evidencias_partidos e
        LEFT JOIN partidos p ON e.partido_id = p.id
      `);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener evidencias: ' + err.message);
    }
  },

  // Obtener evidencias por partido
  getByPartido: async (partido_id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM evidencias_partidos WHERE partido_id = ? ORDER BY fecha_subida DESC',
        [partido_id]
      );
      return rows;
    } catch (err) {
      throw new Error('Error al obtener evidencias del partido: ' + err.message);
    }
  },

  // Crear nueva evidencia
  create: async (evidenciaData) => {
    try {
      const { partido_id, url_imagen, descripcion } = evidenciaData;
      const [result] = await db.query(
        'INSERT INTO evidencias_partidos (partido_id, url_imagen, descripcion, fecha_subida) VALUES (?, ?, ?, NOW())',
        [partido_id, url_imagen, descripcion]
      );
      return { id: result.insertId, ...evidenciaData, fecha_subida: new Date() };
    } catch (err) {
      throw new Error('Error al crear evidencia: ' + err.message);
    }
  },

  // Actualizar evidencia
  update: async (id, evidenciaData) => {
    try {
      const { url_imagen, descripcion } = evidenciaData;
      const [result] = await db.query(
        'UPDATE evidencias_partidos SET url_imagen = ?, descripcion = ? WHERE id = ?',
        [url_imagen, descripcion, id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Error al actualizar evidencia: ' + err.message);
    }
  },

  // Eliminar evidencia
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM evidencias_partidos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (err) {
      throw new Error('Error al eliminar evidencia: ' + err.message);
    }
  }
};

module.exports = {
  //Jugador,
  Evidencia
};