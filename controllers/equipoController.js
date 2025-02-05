const db = require('../config/db');
const fs = require('fs');

// Obtener todos los equipos
exports.obtenerEquipos = async (req, res) => {
  try {
    const [equipos] = await db.query(`
      SELECT e.*, 
             u.nombre AS capitan_nombre, 
             u.email AS capitan_correo, 
             t.nombre AS torneo_nombre, 
             c.nombre AS categoria_nombre
      FROM equipos e
      LEFT JOIN usuarios u ON e.capitan_id = u.id
      LEFT JOIN torneos t ON e.torneo_id = t.id
      LEFT JOIN categorias c ON e.categoria_id = c.id
    `);

    const equiposConLogo = equipos.map(equipo => ({
      ...equipo,
      logo: equipo.logo ? equipo.logo.toString('base64') : null
    }));

    res.json({ 
      success: true, 
      data: equiposConLogo 
    });
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los equipos.',
      error: error.message 
    }); 
  }
};

// Crear un nuevo equipo
exports.crearEquipo = async (req, res) => {
  const { nombre, capitan_id, torneo_id, categoria_id, logo } = req.body;

  // Validar campos obligatorios
  if (!nombre || !capitan_id || !torneo_id || !categoria_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Todos los campos son obligatorios.' 
    });
  }

  try {
    // Verificar si el capitán existe
    const [capitanResult] = await db.query(
      'SELECT id FROM usuarios WHERE id = ?', 
      [capitan_id]
    );

    if (capitanResult.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Capitán no encontrado.' 
      });
    }

    let logoBuffer = null;
    if (logo) {
      // Convertir el string Base64 a Buffer para almacenar en MEDIUMBLOB
      logoBuffer = Buffer.from(logo, 'base64');
    }

    // Insertar en la base de datos
    const [result] = await db.query(
      'INSERT INTO equipos (nombre, capitan_id, logo, torneo_id, categoria_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, capitan_id, logoBuffer, torneo_id, categoria_id]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Equipo creado exitosamente.',
      data: { 
        id: result.insertId, 
        nombre, 
        capitan_id,
        torneo_id, 
        categoria_id 
      } 
    });
  } catch (error) {
    console.error('Error al crear el equipo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el equipo.', 
      error: error.message 
    });
  }
};

// Actualizar un equipo
exports.actualizarEquipo = async (req, res) => {
  const { id } = req.params;
  const { nombre, capitan_correo, logo, torneo_id, categoria_id } = req.body;

  if (!nombre || !capitan_correo || !torneo_id || !categoria_id) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
  }

  try {
    // Obtener el ID del capitán basado en su correo electrónico
    const [capitanResult] = await db.query('SELECT id FROM usuarios WHERE email = ?', [capitan_correo]);
    if (capitanResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Capitán no encontrado.' });
    }
    const capitan_id = capitanResult[0].id;

    await db.query('UPDATE equipos SET nombre = ?, capitan_id = ?, logo = ?, torneo_id = ?, categoria_id = ? WHERE id = ?', [nombre, capitan_id, logo, torneo_id, categoria_id, id]);
    res.status(200).json({ success: true, message: 'Equipo actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el equipo:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el equipo.', error: error.message });
  }
};

// Eliminar un equipo
exports.eliminarEquipo = async (req, res) => {
  const { id } = req.params;

  try {
    // Paso 1: Eliminar evidencias relacionadas con los partidos del equipo
    await db.query(`
      DELETE FROM evidencias_partidos
      WHERE partido_id IN (
        SELECT id FROM partidos WHERE equipo1_id = ? OR equipo2_id = ?
      )
    `, [id, id]);

    // Paso 2: Eliminar partidos relacionados con el equipo
    await db.query('DELETE FROM partidos WHERE equipo1_id = ? OR equipo2_id = ?', [id, id]);

    // Paso 3: Eliminar el equipo
    await db.query('DELETE FROM equipos WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Equipo eliminado correctamente junto con sus referencias.' });
  } catch (error) {
    console.error('Error al eliminar el equipo:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el equipo.', error: error.message });
  }
};

// Obtener equipos por categoría
exports.obtenerEquiposPorCategoria = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    const equipos = await db.query(`
      SELECT e.id, e.nombre, r.puntosGeneral, r.fecha
      FROM equipos e
      JOIN resultados_disciplinas r ON e.id = r.equipo_id
      WHERE r.categoria_id = ?
    `, [categoria_id]);

    res.status(200).json(equipos);
  } catch (error) {
    console.error('Error al obtener equipos por categoría:', error);
    res.status(500).json({ success: false, message: 'Error al obtener equipos.', error: error.message });
  }
};

