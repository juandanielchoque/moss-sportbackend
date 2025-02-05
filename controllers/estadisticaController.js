const pool = require("../config/db");

const estadisticaController = {
  obtenerPuntuaciones: async (req, res) => {
    try {
      const [puntuaciones] = await pool.query("SELECT * FROM puntuacion");
      res.json(puntuaciones);
    } catch (error) {
      console.error("Error al obtener puntuaciones:", error);
      res.status(500).json({
        message: "Error al obtener puntuaciones",
        error: error.message,
      });
    }
  },

  obtenerEstadisticasEquipo: async (req, res) => {
    const { equipoId } = req.params;
    const { disciplina, categoria, torneo } = req.query;

    console.log('1. Parámetros recibidos:', {
        equipoId,
        disciplina,
        categoria,
        torneo
    });

    try {
        const [puntuaciones] = await pool.query(
            `SELECT puntaje_por_equipo 
             FROM puntuacion 
             WHERE equipo_id = ? 
             AND disciplina_id = ? 
             AND categoria_id = ? 
             AND torneo_id = ?`,
            [equipoId, disciplina, categoria, torneo]
        );

      console.log("3. Puntuaciones obtenidas:", puntuaciones);

      // Calculamos las estadísticas
      let partidosGanados = 0;
      let partidosEmpatados = 0;
      let partidosPerdidos = 0;
      let puntajeTotal = 0;

      puntuaciones.forEach((partido) => {
        const puntos = partido.puntaje_por_equipo;
        puntajeTotal += puntos;

        if (puntos === 3) partidosGanados++;
        else if (puntos === 1) partidosEmpatados++;
        else if (puntos === 0) partidosPerdidos++;
      });

      const estadisticas = {
        partidosGanados,
        partidosEmpatados,
        partidosPerdidos,
        puntaje_por_equipo: puntajeTotal,
        partidosJugados: partidosGanados + partidosEmpatados + partidosPerdidos,
      };

      console.log("4. Estadísticas calculadas:", estadisticas);

      res.json(estadisticas);
    } catch (error) {
      console.error("5. Error detallado:", {
        message: error.message,
        stack: error.stack,
        sqlMessage: error.sqlMessage, // Si es un error de MySQL
      });

      res.status(500).json({
        message: "Error al obtener estadísticas del equipo",
        error: error.message,
      });
    }
  },
};

module.exports = estadisticaController;
