// models/Partido.js

const db = require('../config/db');  // Importa la conexión a la base de datos

const Partido = {
  create: async ({ torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro }) => {
    try {
      const [result] = await db.query(
        `INSERT INTO partidos (torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro]
      );
      return { id: result.insertId, torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro };
    } catch (err) {
      throw new Error('Error al crear el partido: ' + err.message);
    }
  },
  
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM partidos');
      return rows;
    } catch (err) {
      throw new Error('Error al obtener los partidos: ' + err.message);
    }
  },
  
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM partidos WHERE id = ?', [id]);
      return rows[0];  // Retorna el primer partido encontrado
    } catch (err) {
      throw new Error('Error al obtener el partido: ' + err.message);
    }
  },
  
  update: async (id, updatedFields) => {
    try {
        if (!id || typeof id !== 'number') {
            throw new Error('El ID del partido es obligatorio y debe ser un número.');
        }

        if (!updatedFields || typeof updatedFields !== 'object' || Object.keys(updatedFields).length === 0) {
            throw new Error('Debes proporcionar al menos un campo para actualizar.');
        }

        // Construcción dinámica de la consulta
        const keys = Object.keys(updatedFields);
        const values = Object.values(updatedFields);

        const setClause = keys.map((key) => `${key} = ?`).join(', ');
        const query = `UPDATE partidos SET ${setClause} WHERE id = ?`;

        // Ejecuta la consulta con los valores y el ID
        const [result] = await db.query(query, [...values, id]);

        if (result.affectedRows === 0) {
            throw new Error(`No se encontró un partido con el ID ${id} para actualizar.`);
        }

        // Retorna los campos actualizados
        return { id, ...updatedFields };
    } catch (err) {
        console.error(`Error al actualizar el partido con ID ${id}:`, err.message);
        throw new Error('Error al actualizar el partido: ' + err.message);
    }
},


  // Función para eliminar un partido
delete: async (id) => {
  try {
    const [result] = await db.query('DELETE FROM partidos WHERE id = ?', [id]);
    return result.affectedRows > 0;  // Retorna true si se eliminó el partido
  } catch (err) {
    // Aquí se puede mejorar el manejo del error, añadiendo más detalles si es necesario
    throw new Error('Error al eliminar el partido: ' + err.message);
  }
},

// Función para obtener partidos por equipo
getByEquipo: async (equipoId) => {
  try {
    const [partidos] = await pool.query(
      `SELECT * FROM partidos 
       WHERE equipo_local_id = ? OR equipo_visitante_id = ?
       ORDER BY fecha_hora DESC`,
      [equipoId, equipoId]
    );
    return partidos; // Retorna los partidos relacionados con el equipo
  } catch (error) {
    throw error;  // Relanzamos el error para que sea manejado más arriba si es necesario
  }
}};

module.exports = Partido;
