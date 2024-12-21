// controllers/torneoController.js
const db = require('../config/db');  // Conexión a la base de datos
const moment = require('moment');

// Obtener todos los torneos
exports.obtenerTorneos = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM torneos');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener torneos', error: error.message });
  }
};

// Obtener un torneo por ID
exports.obtenerTorneoPorId = async (req, res) => {
  const torneoId = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'Torneo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el torneo', error: error.message });
  }
};

// Crear un nuevo torneo
exports.crearTorneo = async (req, res) => {
  const { nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas } = req.body;
  try {
    const [result] = await db.query('INSERT INTO torneos (nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas]);
    res.status(201).json({ id: result.insertId, nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el torneo', error: error.message });
  }
};

// Eliminar un torneo por ID
exports.eliminarTorneo = async (req, res) => {
  const torneoId = req.params.id;
  try {
    const [result] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);
    if (result.length > 0) {
      await db.query('DELETE FROM torneos WHERE id = ?', [torneoId]);
      res.status(200).json({ message: 'Torneo eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Torneo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el torneo', error: error.message });
  }
};

// Actualizar un torneo por ID
exports.actualizarTorneo = async (req, res) => {
    const torneoId = req.params.id;
    const { nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas } = req.body;
    
    try {
      // Convertir las fechas a formato compatible con MySQL
      const fechaInicio = moment(fecha_inicio).format('YYYY-MM-DD HH:mm:ss');
      const fechaFin = moment(fecha_fin).format('YYYY-MM-DD HH:mm:ss');
  
      // Verificamos si el torneo existe
      const [result] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);
      if (result.length > 0) {
        // Si existe, actualizamos el torneo
        await db.query('UPDATE torneos SET nombre = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, lugar = ?, max_equipos = ?, min_equipos = ?, estado = ?, reglas = ? WHERE id = ?', 
          [nombre, tipo, fechaInicio, fechaFin, lugar, max_equipos, min_equipos, estado, reglas, torneoId]);
        res.status(200).json({ message: 'Torneo actualizado exitosamente' });
      } else {
        res.status(404).json({ message: 'Torneo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el torneo', error: error.message });
    }
  };
