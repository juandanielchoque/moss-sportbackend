const db = require('../config/db');

// Subir una nueva evidencia
exports.subirEvidencia = async (req, res) => {
  const { partido_id, descripcion, url_imagen } = req.body;

  // Validar campos obligatorios
  if (!partido_id || !url_imagen) {
    return res.status(400).json({ 
      success: false, 
      message: 'El ID del partido y la imagen son obligatorios.' 
    });
  }

  try {
    // Verificar que el partido existe
    const [partidoResult] = await db.query(
      'SELECT id FROM partidos WHERE id = ?', 
      [partido_id]
    );

    if (partidoResult.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partido no encontrado.' 
      });
    }

    // Convertir base64 a Buffer
    const imagenBuffer = Buffer.from(url_imagen, 'base64');

    // Insertar la evidencia en la base de datos
    const [result] = await db.query(
      'INSERT INTO evidencias_partidos (partido_id, url_imagen, descripcion, fecha_subida) VALUES (?, ?, ?, NOW())',
      [partido_id, imagenBuffer, descripcion]
    );

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Evidencia subida exitosamente.',
      data: {
        id: result.insertId,
        partido_id,
        descripcion,
        fecha_subida: new Date()
      }
    });
  } catch (error) {
    console.error('Error al subir la evidencia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al subir la evidencia.', 
      error: error.message 
    });
  }
};

// Obtener todas las evidencias
exports.obtenerTodasLasEvidencias = async (req, res) => {
  try {
    const [evidencias] = await db.query(
      'SELECT * FROM evidencias_partidos ORDER BY fecha_subida DESC'
    );

    // Convertir Buffer a Base64
    const evidenciasConImagen = evidencias.map(evidencia => ({
      ...evidencia,
      url_imagen: evidencia.url_imagen ? evidencia.url_imagen.toString('base64') : null
    }));

    res.status(200).json({
      success: true,
      data: evidenciasConImagen
    });
  } catch (error) {
    console.error('Error al obtener las evidencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las evidencias.',
      error: error.message
    });
  }
};

// Obtener evidencias de un partido específico
exports.obtenerEvidenciasPorPartido = async (req, res) => {
  const { partido_id } = req.params;

  try {
    const [evidencias] = await db.query(
      'SELECT * FROM evidencias_partidos WHERE partido_id = ? ORDER BY fecha_subida DESC',
      [partido_id]
    );

    // Convertir Buffer a Base64
    const evidenciasConImagen = evidencias.map(evidencia => ({
      ...evidencia,
      url_imagen: evidencia.url_imagen ? evidencia.url_imagen.toString('base64') : null
    }));

    res.status(200).json({
      success: true,
      data: evidenciasConImagen
    });
  } catch (error) {
    console.error('Error al obtener las evidencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las evidencias.',
      error: error.message
    });
  }
};

// Verificar si existe evidencia para un partido
exports.verificarEvidenciaExistente = async (req, res) => {
  const { partido_id } = req.params;

  try {
    const [evidencias] = await db.query(
      'SELECT COUNT(*) as count FROM evidencias_partidos WHERE partido_id = ?',
      [partido_id]
    );

    const existeEvidencia = evidencias[0].count > 0;

    res.status(200).json({
      success: true,
      existeEvidencia
    });
  } catch (error) {
    console.error('Error al verificar la evidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar la evidencia.',
      error: error.message
    });
  }
};

// Eliminar una evidencia
exports.eliminarEvidencia = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM evidencias_partidos WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Evidencia no encontrada.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Evidencia eliminada exitosamente.'
    });
  } catch (error) {
    console.error('Error al eliminar la evidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la evidencia.',
      error: error.message
    });
  }
};