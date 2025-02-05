const db = require('../config/db');

// Obtener todos los torneos
exports.obtenerTorneos = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
          id,
          nombre,
          tipo,
          fecha_inicio,
          fecha_fin,
          lugar,
          estado,
          reglas
      FROM 
          torneos
    `);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Error al obtener torneos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener torneos.', error: error.message });
  }
};

// Crear un nuevo torneo
exports.crearTorneo = async (req, res) => {
  const { nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas } = req.body;

  if (!nombre || !tipo || !fecha_inicio || !fecha_fin || !lugar || !estado) {
    return res.status(400).json({ success: false, message: 'Todos los campos requeridos deben estar presentes.' });
  }

  if (new Date(fecha_inicio) > new Date(fecha_fin)) {
    return res.status(400).json({ success: false, message: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO torneos (nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Torneo creado exitosamente.', 
      data: { id: result.insertId, nombre, tipo, fecha_inicio, fecha_fin, lugar, estado, reglas } 
    });
  } catch (error) {
    console.error('Error al crear el torneo:', error);
    res.status(500).json({ success: false, message: 'Error al crear el torneo.', error: error.message });
  }
};

// Eliminar un torneo por ID
exports.eliminarTorneo = async (req, res) => {
  const torneoId = req.params.id;

  try {
    const [result] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);

    if (result.length > 0) {
      await db.query('DELETE FROM torneos WHERE id = ?', [torneoId]);
      res.status(200).json({ success: true, message: 'Torneo eliminado exitosamente.' });
    } else {
      res.status(404).json({ success: false, message: 'Torneo no encontrado.' });
    }
  } catch (error) {
    console.error('Error al eliminar el torneo:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el torneo.', error: error.message });
  }
};

// Obtener todos los torneos con disciplinas y categorías
exports.obtenerTorneosConDisciplinasYCategorias = async (req, res) => {
  try {
    const [torneos] = await db.query('SELECT * FROM torneos');

    for (const torneo of torneos) {
      const [disciplinas] = await db.query(`
        SELECT d.*, td.id AS torneo_disciplina_id
        FROM disciplinas d
        JOIN torneo_disciplinas td ON d.id = td.disciplina_id
        WHERE td.torneo_id = ?
      `, [torneo.id]);

      for (const disciplina of disciplinas) {
        const [categorias] = await db.query(`
          SELECT c.*
          FROM categorias c
          JOIN disciplina_categorias dc ON c.id = dc.categoria_id
          WHERE dc.disciplina_id = ?
        `, [disciplina.id]);

        disciplina.categorias = categorias;
      }

      torneo.disciplinas = disciplinas;
    }

    res.status(200).json({ success: true, data: torneos });
  } catch (error) {
    console.error('Error al obtener torneos con disciplinas y categorías:', error);
    res.status(500).json({ success: false, message: 'Error al obtener torneos con disciplinas y categorías.', error: error.message });
  }
};

exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Obtener total de torneos
    const [totalTorneos] = await db.query('SELECT COUNT(*) as total FROM torneos');
    
    // Obtener torneos por estado
    const [torneosPorEstado] = await db.query(`
      SELECT estado, COUNT(*) as cantidad 
      FROM torneos 
      GROUP BY estado
    `);

    // Obtener torneos activos (donde la fecha actual está entre fecha_inicio y fecha_fin)
    const [torneosActivos] = await db.query(`
      SELECT COUNT(*) as activos 
      FROM torneos 
      WHERE fecha_inicio <= CURDATE() AND fecha_fin >= CURDATE()
    `);

    // Obtener total de disciplinas en torneos
    const [totalDisciplinas] = await db.query(`
      SELECT COUNT(DISTINCT disciplina_id) as total 
      FROM torneo_disciplinas
    `);

    res.status(200).json({
      success: true,
      data: {
        totalTorneos: totalTorneos[0].total,
        torneosPorEstado,
        torneosActivos: torneosActivos[0].activos,
        totalDisciplinas: totalDisciplinas[0].total
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estadísticas.',
      error: error.message 
    });
  }
};