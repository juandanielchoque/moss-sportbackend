const db = require('../config/db');

// Asignar una categoría a una disciplina
exports.asignarCategoria = async (req, res) => {
  const { disciplina_id, categoria_id } = req.body;

  if (!disciplina_id || !categoria_id) {
    return res.status(400).json({ success: false, message: 'El ID de la disciplina y el ID de la categoría son obligatorios.' });
  }

  try {
    // Verificar si la relación ya existe
    const [existingRelation] = await db.query(
      'SELECT * FROM disciplina_categorias WHERE disciplina_id = ? AND categoria_id = ?',
      [disciplina_id, categoria_id]
    );

    if (existingRelation.length > 0) {
      return res.status(400).json({ success: false, message: 'La categoría ya está asignada a esta disciplina.' });
    }

    const [result] = await db.query(
      'INSERT INTO disciplina_categorias (disciplina_id, categoria_id) VALUES (?, ?)',
      [disciplina_id, categoria_id]
    );

    res.status(201).json({ success: true, message: 'Categoría asignada a la disciplina exitosamente.', data: { id: result.insertId, disciplina_id, categoria_id } });
  } catch (error) {
    console.error('Error al asignar la categoría a la disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al asignar la categoría a la disciplina.', error: error.message });
  }
};

// Obtener categorías de una disciplina
exports.obtenerCategoriasPorDisciplina = async (req, res) => {
  const { disciplina_id } = req.params;

  try {
    const [categorias] = await db.query(`
      SELECT c.*
      FROM categorias c
      JOIN disciplina_categorias dc ON c.id = dc.categoria_id
      WHERE dc.disciplina_id = ?
    `, [disciplina_id]);

    res.status(200).json({ success: true, data: categorias });
  } catch (error) {
    console.error('Error al obtener categorías de la disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categorías de la disciplina.', error: error.message });
  }
};