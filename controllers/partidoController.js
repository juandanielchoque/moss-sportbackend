const pool = require('../config/db');

const obtenerPartidos = async (req, res) => {
  const db = req.app.get('db');
  try {
    const [rows] = await db.query('SELECT * FROM partidos');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener los partidos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los partidos' });
  }
};

const obtenerEquipos = async (req, res) => {
  const db = req.app.get('db');
  try {
    const [rows] = await db.query('SELECT * FROM equipos');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener los equipos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los equipos' });
  }
};

const obtenerTorneos = async (req, res) => {
  const db = req.app.get('db');
  try {
    const [rows] = await db.query('SELECT * FROM torneos');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener los torneos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener los torneos' });
  }
};

const obtenerDisciplinas = async (req, res) => {
  const db = req.app.get('db');
  try {
    const [rows] = await db.query('SELECT * FROM disciplinas');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener las disciplinas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las disciplinas' });
  }
};

const obtenerCategorias = async (req, res) => {
  const db = req.app.get('db');
  try {
    const [rows] = await db.query('SELECT * FROM categorias');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las categorías' });
  }
};

const obtenerTorneoDisciplinas = async (req, res) => {
  const db = req.app.get('db');
  const { torneo_id } = req.query;
  try {
    const [rows] = await db.query('SELECT d.* FROM disciplinas d JOIN torneo_disciplinas td ON d.id = td.disciplina_id WHERE td.torneo_id = ?', [torneo_id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener las disciplinas del torneo:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las disciplinas del torneo' });
  }
};

const obtenerDisciplinaCategorias = async (req, res) => {
  const db = req.app.get('db');
  const { disciplina_id } = req.query;
  try {
    const [rows] = await db.query('SELECT c.* FROM categorias c JOIN disciplina_categorias dc ON c.id = dc.categoria_id WHERE dc.disciplina_id = ?', [disciplina_id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener las categorías de la disciplina:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las categorías de la disciplina' });
  }
};

const crearPartido = async (req, res) => {
  const db = req.app.get('db');
  const { 
    torneo_id, 
    disciplina_id, 
    categoria_id, 
    equipo1_id = null, 
    equipo2_id = null, 
    fecha_hora, 
    lugar, 
    estado = 'descanso', 
    goles_1 = 0, 
    goles_2 = 0, 
    arbitro,
    jornada 
  } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO partidos (torneo_id, disciplina_id, categoria_id, equipo1_id, equipo2_id, fecha_hora, lugar, estado, goles_1, goles_2, arbitro, jornada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [torneo_id, disciplina_id, categoria_id, equipo1_id, equipo2_id, fecha_hora, lugar, estado, goles_1, goles_2, arbitro, jornada]
    );
    
    res.json({ 
      success: true, 
      data: { 
        id: result.insertId, 
        ...req.body 
      } 
    });
  } catch (error) {
    console.error('Error al crear el partido:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el partido' 
    });
  }
};

const actualizarPartido = async (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;
  const { torneo_id, equipo1_id, equipo2_id, fecha_hora, lugar, estado, goles_1, goles_2, arbitro } = req.body;
  try {
    await db.query(
      'UPDATE partidos SET torneo_id = ?, equipo1_id = ?, equipo2_id = ?, fecha_hora = ?, lugar = ?, estado = ?, goles_1 = ?, goles_2 = ?, arbitro = ? WHERE id = ?',
      [torneo_id, equipo1_id, equipo2_id, fecha_hora, lugar, estado, goles_1, goles_2, arbitro, id]
    );
    res.json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    console.error('Error al actualizar el partido:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el partido' });
  }
};

const eliminarPartido = async (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;
  try {
    await db.query('DELETE FROM partidos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Partido eliminado' });
  } catch (error) {
    console.error('Error al eliminar el partido:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el partido' });
  }
};


const finalizarPartido = async (req, res) => {
  try {
    const { id } = req.params;
    const { goles_1, goles_2 } = req.body;

    console.log('Datos recibidos:', { id, goles_1, goles_2 });

    // Validación de entrada
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID del partido es requerido'
      });
    }

    if (goles_1 === undefined || goles_2 === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Los goles de ambos equipos son requeridos'
      });
    }

    // Asegúrate de que los goles sean números
    const golesEquipo1 = parseInt(goles_1);
    const golesEquipo2 = parseInt(goles_2);

    if (isNaN(golesEquipo1) || isNaN(golesEquipo2)) {
      return res.status(400).json({
        success: false,
        message: 'Los goles deben ser números válidos'
      });
    }

    // Verifica primero si el partido existe
    const [partidos] = await pool.execute(
      'SELECT * FROM partidos WHERE id = ?',
      [id]
    );

    if (!partidos || partidos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }

    // Actualiza el partido
    const [result] = await pool.execute(
      `UPDATE partidos 
       SET estado = 'finalizado',
           goles_1 = ?,
           goles_2 = ?
       WHERE id = ?`,
      [golesEquipo1, golesEquipo2, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se pudo actualizar el partido'
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Partido finalizado exitosamente',
      data: {
        id,
        goles_1: golesEquipo1,
        goles_2: golesEquipo2,
        estado: 'finalizado'
      }
    });

  } catch (error) {
    console.error('Error al finalizar el partido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al finalizar el partido',
      error: error.message
    });
  }
};

const crearCompetenciaIndividual = async (req, res) => {
  const { torneo_id, disciplina_id, fecha_hora, lugar, estado, arbitro, equipos } = req.body;

  // Validación de datos
  if (!torneo_id || !disciplina_id || !fecha_hora || !lugar || !equipos || !Array.isArray(equipos)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan datos obligatorios o son inválidos.' 
    });
  }

  try {

    // Convertir la fecha y hora al formato MySQL
    const fechaHoraMySQL = new Date(fecha_hora).toISOString().replace('T', ' ').split('.')[0];

    // 1. Crear la competencia en la tabla competencias_individuales
    const [competenciaResult] = await pool.query(
      'INSERT INTO competencias_individuales (torneo_id, disciplina_id, fecha_hora, lugar, estado, arbitro) VALUES (?, ?, ?, ?, ?, ?)',
      [torneo_id, disciplina_id, fechaHoraMySQL, lugar, estado || 'programado', arbitro || null]
    );

    const competenciaId = competenciaResult.insertId;

    // 2. Verificar que los equipos existan
    const [equiposExistentes] = await pool.query(
      'SELECT id FROM equipos WHERE id IN (?)', 
      [equipos]
    );

    if (equiposExistentes.length !== equipos.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Uno o más equipos no existen.' 
      });
    }

    // 3. Registrar los equipos en la tabla competencia_equipos
    const equiposPromises = equipos.map(equipoId =>
      pool.query(
        'INSERT INTO competencia_equipos (competencia_id, equipo_id) VALUES (?, ?)',
        [competenciaId, equipoId]
      )
    );

    await Promise.all(equiposPromises);

    // Respuesta exitosa
    res.status(201).json({ 
      success: true, 
      message: 'Competencia creada exitosamente.', 
      competenciaId 
    });
  } catch (error) {
    console.error('Error al crear la competencia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la competencia.' 
    });
  }
};

const actualizarPuntuacion = async (req, res) => {
  try {
      const { equipo_id, disciplina_id, categoria_id, torneo_id, puntaje_por_equipo } = req.body;
      

      if (!equipo_id || !disciplina_id || !categoria_id || !torneo_id) {
          console.error("❌ Error: Faltan datos obligatorios");
          return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
      }

      await pool.query(
          "INSERT INTO puntuacion (equipo_id, disciplina_id, categoria_id, torneo_id, puntaje_por_equipo) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE puntaje_por_equipo = puntaje_por_equipo + ?",
          [equipo_id, disciplina_id, categoria_id, torneo_id, puntaje_por_equipo, puntaje_por_equipo]
      );

      res.status(200).json({ success: true, message: "Puntuación actualizada correctamente" });

  } catch (error) {
      console.error("❌ Error en el servidor al actualizar la puntuación:", error);
      res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
  }
};

module.exports = {
  obtenerPartidos,
  obtenerEquipos,
  obtenerTorneos,
  obtenerDisciplinas,
  obtenerCategorias,
  obtenerTorneoDisciplinas,
  obtenerDisciplinaCategorias,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  finalizarPartido,
  crearCompetenciaIndividual,
  actualizarPuntuacion
};