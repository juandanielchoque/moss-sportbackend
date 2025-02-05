const db = require('../config/db');

// Obtener todas las disciplinas
exports.obtenerDisciplinas = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM disciplinas');
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Error al obtener disciplinas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener disciplinas.', error: error.message });
  }
};

// Crear una nueva disciplina
exports.crearDisciplina = async (req, res) => {
  const { nombre, tipo, valor_puntos, descripcion } = req.body;

  if (!nombre || !tipo || !valor_puntos) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
  }

  try {
    const [result] = await db.query('INSERT INTO disciplinas (nombre, tipo, valor_puntos, descripcion) VALUES (?, ?, ?, ?)', [nombre, tipo, valor_puntos, descripcion]);
    res.status(201).json({ success: true, message: 'Disciplina creada exitosamente.', data: { id: result.insertId, nombre, tipo, valor_puntos, descripcion } });
  } catch (error) {
    console.error('Error al crear la disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al crear la disciplina.', error: error.message });
  }
};

// Eliminar una disciplina por ID
exports.eliminarDisciplina = async (req, res) => {
  const disciplinaId = req.params.id;

  try {
    const [result] = await db.query('SELECT * FROM disciplinas WHERE id = ?', [disciplinaId]);

    if (result.length > 0) {
      // Eliminar filas relacionadas en la tabla torneo_disciplinas
      await db.query('DELETE FROM torneo_disciplinas WHERE disciplina_id = ?', [disciplinaId]);

      // Eliminar filas relacionadas en la tabla disciplina_categorias
      await db.query('DELETE FROM disciplina_categorias WHERE disciplina_id = ?', [disciplinaId]);

      // Eliminar la disciplina
      await db.query('DELETE FROM disciplinas WHERE id = ?', [disciplinaId]);
      res.status(200).json({ success: true, message: 'Disciplina eliminada exitosamente.' });
    } else {
      res.status(404).json({ success: false, message: 'Disciplina no encontrada.' });
    }
  } catch (error) {
    console.error('Error al eliminar la disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar la disciplina.', error: error.message });
  }
};