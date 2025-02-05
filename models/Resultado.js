// models/Resultado.js
const Resultado = {
  // Obtener resultados por equipo y torneo
  getByEquipoAndTorneo: async (equipo_id, torneo_id) => {
    try {
      const [rows] = await db.query(`
        SELECT rd.*,
          d.nombre as disciplina_nombre,
          d.tipo as disciplina_tipo
        FROM resultados_disciplinas rd
        JOIN disciplinas d ON rd.disciplina_id = d.id
        WHERE rd.equipo_id = ? AND rd.torneo_id = ?
      `, [equipo_id, torneo_id]);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener resultados: ' + err.message);
    }
  },

  // Registrar nuevo resultado
  create: async (resultadoData) => {
    try {
      const { equipo_id, disciplina_id, torneo_id, categoria_id, puntos_disciplina, puntos_general } = resultadoData;
      const [result] = await db.query(
        'INSERT INTO resultados_disciplinas (equipo_id, disciplina_id, torneo_id, categoria_id, puntos_disciplina, puntos_general, fecha) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [equipo_id, disciplina_id, torneo_id, categoria_id, puntos_disciplina, puntos_general]
      );
      return { id: result.insertId, ...resultadoData };
    } catch (err) {
      throw new Error('Error al crear resultado: ' + err.message);
    }
  }
};
