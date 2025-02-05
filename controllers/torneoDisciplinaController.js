const db = require('../config/db');

// Asignar una disciplina a un torneo
exports.asignarDisciplina = async (req, res) => {
  const { torneo_id, disciplina_id } = req.body;

  if (!torneo_id || !disciplina_id) {
    return res.status(400).json({ success: false, message: 'El ID del torneo y el ID de la disciplina son obligatorios.' });
  }

  try {
    // Verificar si la relación ya existe
    const [existingRelation] = await db.query(
      'SELECT * FROM torneo_disciplinas WHERE torneo_id = ? AND disciplina_id = ?',
      [torneo_id, disciplina_id]
    );

    if (existingRelation.length > 0) {
      return res.status(400).json({ success: false, message: 'La disciplina ya está asignada a este torneo.' });
    }

    const [result] = await db.query(
      'INSERT INTO torneo_disciplinas (torneo_id, disciplina_id) VALUES (?, ?)',
      [torneo_id, disciplina_id]
    );

    res.status(201).json({ success: true, message: 'Disciplina asignada al torneo exitosamente.', data: { id: result.insertId, torneo_id, disciplina_id } });
  } catch (error) {
    console.error('Error al asignar la disciplina al torneo:', error);
    res.status(500).json({ success: false, message: 'Error al asignar la disciplina al torneo.', error: error.message });
  }
};

// Obtener disciplinas de un torneo
exports.obtenerDisciplinasPorTorneo = async (req, res) => {
  const { torneo_id } = req.params;

  try {
    const [disciplinas] = await db.query(`
      SELECT d.*
      FROM disciplinas d
      JOIN torneo_disciplinas td ON d.id = td.disciplina_id
      WHERE td.torneo_id = ?
    `, [torneo_id]);

    res.status(200).json({ success: true, data: disciplinas });
  } catch (error) {
    console.error('Error al obtener disciplinas del torneo:', error);
    res.status(500).json({ success: false, message: 'Error al obtener disciplinas del torneo.', error: error.message });
  }
};