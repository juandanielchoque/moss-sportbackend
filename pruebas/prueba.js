const db = require('../config/db');  // Importar la conexión configurada con promesas

const Equipo = {
  // Obtener todos los equipos
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM equipos');  // Eliminamos .promise() ya que está integrado con db
      return rows;
    } catch (err) {
      console.error('Error en la consulta de equipos:', err);
      throw new Error('Error al obtener los equipos');
    }
  },

  // Obtener un equipo por su ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM equipos WHERE id = ?', [id]);
      return rows[0];  // Retornar el primer equipo encontrado
    } catch (err) {
      console.error('Error en la consulta del equipo:', err);
      throw new Error('Error al obtener el equipo');
    }
  },

  // Verificar si un capitán ya está asignado a un equipo en un torneo
  getByCapitanAndTorneo: async (capitan_id, torneo_id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM equipos WHERE capitan_id = ? AND torneo_id = ?',
        [capitan_id, torneo_id]
      );
      return rows[0];  // Retornar el primer equipo encontrado
    } catch (err) {
      console.error('Error en la consulta del capitán y torneo:', err);
      throw new Error('Error al verificar el capitán y torneo');
    }
  },

  // Obtener las categorías disponibles para un torneo
getCategoriasByTorneo: async (torneoId) => {
  try {
    // Hacemos un JOIN con la tabla 'categorias' para obtener el nombre de cada categoría asociada al torneo
    const [rows] = await db.query(
      `SELECT c.id AS categoria_id, c.nombre
       FROM categorias c
       INNER JOIN torneo_categorias tc ON c.id = tc.categoria_id
       WHERE tc.torneo_id = ?`,
      [torneoId]
    );
    return rows;  // Devuelve las categorías asociadas al torneo
  } catch (err) {
    console.error('Error al obtener las categorías del torneo:', err);
    throw new Error('Error al obtener las categorías');
  }
},

 // Crear un equipo con categoría
 create: async (nombre, email_capitan, nombre_torneo, categoria_id) => {
  try {
    // Buscar el capitan_id a partir del email
    const [capitanResult] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email_capitan]
    );

    if (capitanResult.length === 0) {
      throw new Error('Capitán no encontrado');
    }

    const capitan_id = capitanResult[0].id;

    // Buscar el torneo_id a partir del nombre del torneo
    const [torneoResult] = await db.query(
      'SELECT id FROM torneos WHERE nombre = ?',
      [nombre_torneo]
    );

    if (torneoResult.length === 0) {
      throw new Error('Torneo no encontrado');
    }

    const torneo_id = torneoResult[0].id;

    // Verificar que la categoría existe para este torneo
    const [categoria] = await db.query(
      'SELECT * FROM categorias WHERE id = ? AND torneo_id = ?',
      [categoria_id, torneo_id]
    );

    if (!categoria) {
      throw new Error('La categoría no existe en este torneo');
    }

    // Crear el equipo (sin incluir categoria_id)
    const [result] = await db.query(
      'INSERT INTO equipos (nombre, capitan_id, torneo_id) VALUES (?, ?, ?)',
      [nombre, capitan_id, torneo_id]
    );

    const equipoId = result.insertId;

    // Inscribir el equipo en la categoría en la tabla intermedia
    await db.query(
      'INSERT INTO equipo_categorias (equipo_id, categoria_id, torneo_id) VALUES (?, ?, ?)',
      [equipoId, categoria_id, torneo_id]
    );

    return { id: equipoId, nombre, capitan_id, torneo_id, categoria_id };
  } catch (err) {
    console.error('Error al crear el equipo:', err);
    throw new Error('Error al crear el equipo');
  }
},



  // Actualizar un equipo
  update: async (id, nombre, capitan_id, torneo_id) => {
    try {
      await db.query(
        'UPDATE equipos SET nombre = ?, capitan_id = ?, torneo_id = ? WHERE id = ?',
        [nombre, capitan_id, torneo_id, id]
      );
      return { id, nombre, capitan_id, torneo_id };
    } catch (err) {
      console.error('Error al actualizar el equipo:', err);
      throw new Error('Error al actualizar el equipo');
    }
  },

  // Eliminar un equipo
  delete: async (id) => {
    try {
      await db.query('DELETE FROM equipos WHERE id = ?', [id]);
      return { id };
    } catch (err) {
      console.error('Error al eliminar el equipo:', err);
      throw new Error('Error al eliminar el equipo');
    }
  },

  getAllDetails: async () => {
    const query = `
      SELECT 
        equipos.id AS equipo_id, 
        equipos.nombre AS nombre_equipo, 
        torneos.nombre AS nombre_torneo, 
        usuarios.nombre AS nombre_capitan
      FROM 
        equipos
      LEFT JOIN 
        torneos ON equipos.torneo_id = torneos.id
      LEFT JOIN 
        usuarios ON equipos.capitan_id = usuarios.id;
    `;
    const [result] = await db.execute(query);
    return result;
  },
};

module.exports = Equipo;
