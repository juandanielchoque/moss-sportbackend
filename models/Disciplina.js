const db = require('../config/db');

// Obtener todas las disciplinas
exports.getAllDisciplinas = async (req, res) => {
  try {
    const [disciplinas] = await db.query('SELECT * FROM disciplinas');
    res.status(200).json({ success: true, data: disciplinas });
  } catch (error) {
    console.error('Error al obtener disciplinas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener disciplinas', error: error.message });
  }
};

// Crear una nueva disciplina
exports.createDisciplina = async (req, res) => {
  const { nombre, tipo, valor_puntos, descripcion } = req.body;

  if (!nombre || !tipo) {
    return res.status(400).json({ success: false, message: 'El nombre y el tipo son obligatorios' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO disciplinas (nombre, tipo, valor_puntos, descripcion) VALUES (?, ?, ?, ?)',
      [nombre, tipo, valor_puntos, descripcion]
    );
    const [disciplina] = await db.query('SELECT * FROM disciplinas WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Disciplina creada con éxito', data: disciplina[0] });
  } catch (error) {
    console.error('Error al crear disciplina:', error);
    res.status(400).json({ success: false, message: 'Error al crear disciplina', error: error.message });
  }
};

// Obtener una disciplina por ID
exports.getDisciplinaById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [disciplina] = await db.query('SELECT * FROM disciplinas WHERE id = ?', [id]);
    if (disciplina.length === 0) {
      return res.status(404).json({ success: false, message: 'Disciplina no encontrada' });
    }
    res.status(200).json({ success: true, data: disciplina[0] });
  } catch (error) {
    console.error('Error al obtener disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al obtener disciplina', error: error.message });
  }
};

// Actualizar una disciplina
exports.updateDisciplina = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, valor_puntos, descripcion } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE disciplinas SET nombre = ?, tipo = ?, valor_puntos = ?, descripcion = ? WHERE id = ?',
      [nombre, tipo, valor_puntos, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Disciplina no encontrada' });
    }

    const [disciplina] = await db.query('SELECT * FROM disciplinas WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Disciplina actualizada con éxito', data: disciplina[0] });
  } catch (error) {
    console.error('Error al actualizar disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar disciplina', error: error.message });
  }
};

// Eliminar una disciplina
exports.deleteDisciplina = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM disciplinas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Disciplina no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Disciplina eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar disciplina', error: error.message });
  }
};