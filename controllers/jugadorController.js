const db = require('../config/db'); // Importa la conexión a la base de datos

// Obtener todos los jugadores o filtrar por equipo_id
exports.obtenerJugadores = async (req, res) => {
  const { equipo_id } = req.query;

  try {
    let query = 'SELECT * FROM jugadores WHERE estado = "activo"';
    let params = [];

    if (equipo_id) {
      query += ' AND equipo_id = ?';
      params.push(equipo_id);
    }

    const [jugadores] = await db.query(query, params);
    res.status(200).json({ success: true, data: jugadores });
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    res.status(500).json({ success: false, message: 'Error al obtener jugadores.', error: error.message });
  }
};

// Agregar un nuevo jugador
exports.agregarJugador = async (req, res) => {
  const { 
    nombre, 
    apellido, 
    edad, 
    equipo_id, 
    sexo, 
    dni, 
    fecha_ingreso = new Date().toISOString().split('T')[0],
    estado = 'activo'
  } = req.body;

  try {
    // Verificar si ya existe un jugador con el mismo DNI
    const [existingPlayer] = await db.query('SELECT id FROM jugadores WHERE dni = ?', [dni]);
    if (existingPlayer.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un jugador registrado con ese DNI.' 
      });
    }

    const [result] = await db.query(
      'INSERT INTO jugadores (nombre, apellido, edad, equipo_id, sexo, dni, fecha_ingreso, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, edad, equipo_id, sexo, dni, fecha_ingreso, estado]
    );

    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
  } catch (error) {
    console.error('Error al agregar jugador:', error);
    res.status(500).json({ success: false, message: 'Error al agregar jugador.', error: error.message });
  }
};

// Obtener un jugador por su ID
exports.getJugadorById = async (req, res) => {
  const { id } = req.params;

  try {
    const [jugador] = await db.query('SELECT * FROM jugadores WHERE id = ? AND estado = "activo"', [id]);

    if (jugador.length === 0) {
      return res.status(404).json({ success: false, message: 'Jugador no encontrado.' });
    }

    res.status(200).json({ success: true, data: jugador[0] });
  } catch (error) {
    console.error('Error al obtener el jugador por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el jugador.', error: error.message });
  }
};

// Actualizar un jugador por su ID
exports.updateJugador = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    apellido, 
    edad, 
    equipo_id, 
    sexo, 
    dni, 
    fecha_ingreso,
    estado 
  } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE jugadores SET nombre = ?, apellido = ?, edad = ?, equipo_id = ?, sexo = ?, dni = ?, fecha_ingreso = ?, estado = ? WHERE id = ?',
      [nombre, apellido, edad, equipo_id, sexo, dni, fecha_ingreso, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Jugador no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Jugador actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el jugador:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el jugador.', error: error.message });
  }
};

// Eliminar un jugador por su ID (soft delete)
exports.deleteJugador = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'UPDATE jugadores SET estado = "inactivo" WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Jugador no encontrado.' });
    }

    res.status(200).json({ success: true, message: 'Jugador eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el jugador:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el jugador.', error: error.message });
  }
};

// Obtener jugadores con información de su equipo
exports.getJugadoresConEquipo = async (req, res) => {
  try {
    const [jugadores] = await db.query(`
      SELECT j.*, e.nombre AS equipo_nombre
      FROM jugadores j
      LEFT JOIN equipos e ON j.equipo_id = e.id
      WHERE j.estado = "activo"
    `);

    res.status(200).json({ success: true, data: jugadores });
  } catch (error) {
    console.error('Error al obtener jugadores con equipo:', error);
    res.status(500).json({ success: false, message: 'Error al obtener jugadores.', error: error.message });
  }
};

// jugadorController.js
exports.obtenerEquipoPorCapitan = async (req, res) => {
  try {
    const capitanId = req.user.id;

    const query = `
      SELECT 
        e.*,
        c.nombre as categoria_nombre,
        d.nombre as disciplina_nombre
      FROM equipos e
      LEFT JOIN categorias c ON e.categoria_id = c.id
      LEFT JOIN disciplina_categorias dc ON c.id = dc.categoria_id
      LEFT JOIN disciplinas d ON dc.disciplina_id = d.id
      WHERE e.capitan_id = ?
    `;

    if (!db) {
      console.error('No hay conexión a la base de datos');
      return res.status(500).json({
        success: false,
        message: 'Error de conexión a la base de datos'
      });
    }

    try {
      const [equipo] = await db.query(query, [capitanId]);

      if (!equipo || equipo.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró equipo para este capitán'
        });
      }

      return res.json({
        success: true,
        data: equipo[0]
      });

    } catch (dbError) {
      console.error('Error en la consulta SQL:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error en la consulta a la base de datos',
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener información del equipo',
      error: error.message
    });
  }
};