// models/Posicion.js
const Posicion = {
  // Obtener tabla de posiciones por torneo y categoría
  getTablaPosiciones: async (torneo_id, categoria_id) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          e.id as equipo_id,
          e.nombre as equipo_nombre,
          COUNT(p.id) as partidos_jugados,
          SUM(CASE 
            WHEN (p.equipo_local_id = e.id AND p.goles_local > p.goles_visitante) OR
                 (p.equipo_visitante_id = e.id AND p.goles_visitante > p.goles_local) THEN 1
            ELSE 0
          END) as victorias,
          SUM(CASE 
            WHEN p.goles_local = p.goles_visitante THEN 1
            ELSE 0
          END) as empates,
          SUM(CASE 
            WHEN (p.equipo_local_id = e.id AND p.goles_local < p.goles_visitante) OR
                 (p.equipo_visitante_id = e.id AND p.goles_visitante < p.goles_local) THEN 1
            ELSE 0
          END) as derrotas,
          SUM(CASE 
            WHEN p.equipo_local_id = e.id THEN p.goles_local
            ELSE p.goles_visitante
          END) as goles_favor,
          SUM(CASE 
            WHEN p.equipo_local_id = e.id THEN p.goles_visitante
            ELSE p.goles_local
          END) as goles_contra,
          SUM(CASE 
            WHEN (p.equipo_local_id = e.id AND p.goles_local > p.goles_visitante) OR
                 (p.equipo_visitante_id = e.id AND p.goles_visitante > p.goles_local) THEN 3
            WHEN p.goles_local = p.goles_visitante THEN 1
            ELSE 0
          END) as puntos
        FROM equipos e
        JOIN equipo_torneos et ON e.id = et.equipo_id
        LEFT JOIN partidos p ON (e.id = p.equipo_local_id OR e.id = p.equipo_visitante_id)
          AND p.estado = 'finalizado'
        WHERE et.torneo_id = ? AND et.categoria_id = ?
        GROUP BY e.id
        ORDER BY puntos DESC, (goles_favor - goles_contra) DESC, goles_favor DESC
      `, [torneo_id, categoria_id]);
      return rows;
    } catch (err) {
      throw new Error('Error al obtener tabla de posiciones: ' + err.message);
    }
  }
};

module.exports = {
  Torneo,
  Resultado,
  Posicion
};