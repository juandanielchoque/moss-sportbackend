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

//-------

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const [totalTorneos] = await db.query('SELECT COUNT(*) AS total_torneos FROM torneos');
    console.log('Total de torneos:', totalTorneos);  // Depuración

    const [torneosPorEstado] = await db.query(`
      SELECT estado, COUNT(*) AS cantidad
      FROM torneos
      GROUP BY estado
    `);
    console.log('Torneos por estado:', torneosPorEstado);  // Depuración

    const [torneosPorTipo] = await db.query(`
      SELECT tipo, COUNT(*) AS cantidad
      FROM torneos
      GROUP BY tipo
    `);
    console.log('Torneos por tipo:', torneosPorTipo);  // Depuración

    const [torneosFuturos] = await db.query(`
      SELECT COUNT(*) AS cantidad
      FROM torneos
      WHERE fecha_inicio > NOW()
    `);
    console.log('Torneos futuros:', torneosFuturos);  // Depuración

    res.status(200).json({
      totalTorneos: totalTorneos[0].total_torneos,
      torneosPorEstado: torneosPorEstado,
      torneosPorTipo: torneosPorTipo,
      torneosFuturos: torneosFuturos[0].cantidad,
    });
  } catch (error) {
    console.log('Error al obtener estadísticas:', error.message);  // Depuración
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};


//------------------
exports.getTablaPosiciones = async (req, res) => {
  const { torneoId } = req.params;

  try {
      const query = `
          SELECT 
              e.nombre AS equipo,
              COUNT(p.id) AS PJ,
              SUM(CASE WHEN (p.goles_local > p.goles_visitante AND p.equipo_local_id = e.id) OR 
                       (p.goles_visitante > p.goles_local AND p.equipo_visitante_id = e.id) THEN 1 ELSE 0 END) AS G,
              SUM(CASE WHEN p.goles_local = p.goles_visitante THEN 1 ELSE 0 END) AS E,
              SUM(CASE WHEN (p.goles_local < p.goles_visitante AND p.equipo_local_id = e.id) OR 
                       (p.goles_visitante < p.goles_local AND p.equipo_visitante_id = e.id) THEN 1 ELSE 0 END) AS P,
              SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_local ELSE p.goles_visitante END) AS GF,
              SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_visitante ELSE p.goles_local END) AS GC,
              SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_local ELSE p.goles_visitante END) -
              SUM(CASE WHEN p.equipo_local_id = e.id THEN p.goles_visitante ELSE p.goles_local END) AS DG,
              (SUM(CASE WHEN (p.goles_local > p.goles_visitante AND p.equipo_local_id = e.id) OR 
                         (p.goles_visitante > p.goles_local AND p.equipo_visitante_id = e.id) THEN 1 ELSE 0 END) * 3) +
              (SUM(CASE WHEN p.goles_local = p.goles_visitante THEN 1 ELSE 0 END)) AS Pts
          FROM equipos e
          LEFT JOIN partidos p ON e.id = p.equipo_local_id OR e.id = p.equipo_visitante_id
          WHERE e.torneo_id = ?
          GROUP BY e.id, e.nombre
          ORDER BY Pts DESC, DG DESC, GF DESC;
      `;

      const [rows] = await db.query(query, [torneoId]);
      res.status(200).json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la tabla de posiciones' });
  }
};

