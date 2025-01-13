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

  // Función para actualizar el nombre y el capitán
  updateNombreAndCapitan: async (equipo_id, nuevo_nombre, nuevo_email_capitan) => {
    console.log('Buscando capitán con email:', nuevo_email_capitan);  // Verifica que el valor sea correcto
  
    const [capitan] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [nuevo_email_capitan]  // Asegúrate de que el valor aquí sea el correo electrónico correcto
    );
  
    if (!capitan || capitan.length === 0) {
      throw new Error('Capitán no encontrado');
    }
  
    // Actualizar el nombre del equipo y el capitán
    await db.query(
      'UPDATE equipos SET nombre = ?, capitan_id = ? WHERE id = ?',
      [nuevo_nombre, capitan[0].id, equipo_id]
    );
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

  //
 // Obtener categorías asociadas a un torneo
 getCategoriasByTorneo: async (torneo_id) => {
  const [rows] = await db.query(
    `SELECT c.id AS categoria_id, c.nombre 
     FROM categorias c
     JOIN torneo_categorias tc ON c.id = tc.categoria_id
     WHERE tc.torneo_id = ?`,
    [torneo_id]
  );
  return rows;  // Devuelve las categorías asociadas al torneo
},

// Buscar una categoría por su nombre
findByName: async (nombre_categoria) => {
  const [rows] = await db.query(
    'SELECT * FROM categorias WHERE nombre = ?',
    [nombre_categoria]
  );
  return rows[0];  // Devuelve la categoría si se encuentra
},


// Verificar si el equipo ya está asociado a un torneo y una categoría
getByTorneoAndCategoria: async (equipo_id, torneo_id, categoria_id) => {
  const [result] = await db.query(
    'SELECT * FROM equipo_torneos WHERE equipo_id = ? AND torneo_id = ? AND categoria_id = ?',
    [equipo_id, torneo_id, categoria_id]
  );
  return result.length > 0 ? result[0] : null; // Devuelve el equipo si ya está asociado, o null si no lo está
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

  // Crear un nuevo equipo
  create: async (nombre, capitan_id) => {
    const [result] = await db.query(
      'INSERT INTO equipos (nombre, capitan_id) VALUES (?, ?)',
      [nombre, capitan_id]
    );
    return { id: result.insertId, nombre, capitan_id };
  },

  // Asociar un equipo a múltiples torneos
addToTorneo: async (equipo_id, torneo_id, categoria_id) => {
  console.log(`Equipo ID: ${equipo_id}, Torneo ID: ${torneo_id}, Categoría ID: ${categoria_id}`); // Verifica los valores
  await db.query(
    'INSERT INTO equipo_torneos (equipo_id, torneo_id, categoria_id) VALUES (?, ?, ?)',
    [equipo_id, torneo_id, categoria_id]
  );
},

//
  removeAllFromTorneo: async (equipo_id) => {
  try {
    console.log('Eliminando asociaciones con torneos para el equipo_id:', equipo_id);

    // Eliminar las asociaciones de los torneos del equipo
    const result = await db.query(
      'DELETE FROM equipo_torneos WHERE equipo_id = ?',
      [equipo_id]
    );

    console.log('Número de filas afectadas:', result.affectedRows);  // Verifica cuántas filas se eliminaron

    return result;
  } catch (error) {
    console.error('Error al eliminar asociaciones con torneos:', error);
    throw new Error('Error al eliminar asociaciones con torneos');
  }
},

// Obtener equipos asociados a un torneo y una categoría específicos
getEquiposByTorneoYCategoria: async (torneo_id, categoria_id) => {
  try {
    const query = `
      SELECT 
    e.id AS equipo_id,  
    e.nombre AS equipo_nombre,
    t.nombre AS torneo_nombre,
    u.nombre AS creador_equipo,
    c.nombre AS categoria_nombre
FROM 
    equipo_torneos et
JOIN 
    equipos e ON et.equipo_id = e.id
JOIN 
    torneos t ON et.torneo_id = t.id
JOIN 
    categorias c ON et.categoria_id = c.id
JOIN 
    usuarios u ON e.capitan_id = u.id
ORDER BY 
    e.nombre;

    `;
    const [equipos] = await db.query(query, [torneo_id, categoria_id]);
    return equipos;
  } catch (error) {
    throw new Error('Error al obtener los equipos: ' + error.message);
  }
},

  

  // Obtener todos los torneos asociados a un equipo
  getTorneosByEquipo: async (equipo_id) => {
    const [rows] = await db.query(
      `SELECT 
        t.id AS torneo_id, 
        t.nombre AS torneo_nombre, 
        c.id AS categoria_id, 
        c.nombre AS categoria_nombre
       FROM 
        equipo_torneos et
       JOIN 
        torneos t ON et.torneo_id = t.id
       JOIN 
        categorias c ON et.categoria_id = c.id
       WHERE 
        et.equipo_id = ?`,
      [equipo_id]
    );
    return rows;
  },

  // Eliminar la asociación de un equipo con un torneo
  removeFromTorneo: async (equipo_id, torneo_id) => {
    await db.query(
      'DELETE FROM equipo_torneos WHERE equipo_id = ? AND torneo_id = ?',
      [equipo_id, torneo_id]
    );
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
