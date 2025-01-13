// models/Posicion.js
const db = require('../config/db'); // Importa la conexión de la base de datos

const Posicion = {
  // Método para obtener las posiciones por categoría
  getPosicionesPorCategoria: async (categoriaId) => {
    const [rows] = await db.query(`
      SELECT e.id, e.nombre, SUM(p.goles_local + p.goles_visitante) AS puntos
      FROM equipos e
      JOIN partidos p ON e.id = p.equipo_local_id OR e.id = p.equipo_visitante_id
      WHERE e.categoria_id = ?
      GROUP BY e.id
      ORDER BY puntos DESC
    `, [categoriaId]);
    return rows;
  }
};

module.exports = Posicion;
