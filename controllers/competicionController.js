const db = require("../config/db");

exports.obtenerCompetenciasIndividuales = async (req, res) => {
  try {
    const [competencias] = await db.query(`
      SELECT ci.*, 
             t.nombre AS torneo_nombre, 
             d.nombre AS disciplina_nombre
      FROM competencias_individuales ci
      LEFT JOIN torneos t ON ci.torneo_id = t.id
      LEFT JOIN disciplinas d ON ci.disciplina_id = d.id
    `);

    res.json({ 
      success: true, 
      data: competencias 
    });
  } catch (error) {
    console.error('Error al obtener competencias individuales:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las competencias.',
      error: error.message 
    }); 
  }
};
  
  // Obtener equipos de una competencia
  exports.obtenerEquiposDeCompetencia = async (req, res) => {
    const { id } = req.params;
    try {
      const [equipos] = await db.query(`
        SELECT ce.*, 
               e.nombre AS equipo_nombre 
        FROM competencia_equipos ce
        LEFT JOIN equipos e ON ce.equipo_id = e.id
        WHERE ce.competencia_id = ?
      `, [id]);
  
      res.json({ 
        success: true, 
        data: equipos 
      });
    } catch (error) {
      console.error('Error al obtener equipos de competencia:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al obtener los equipos de la competencia.',
        error: error.message 
      }); 
    }
  };
  
  // Finalizar una competencia
  exports.finalizarCompetenciaIndividual = async (req, res) => {
    const { id } = req.params;
    const { resultados } = req.body;
    try {
      await db.query(`
        UPDATE competencias_individuales 
        SET estado = 'finalizado', 
            resultados = ? 
        WHERE id = ?
      `, [resultados, id]);
  
      res.json({ 
        success: true, 
        message: 'Competencia finalizada correctamente.' 
      });
    } catch (error) {
      console.error('Error al finalizar competencia:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al finalizar la competencia.',
        error: error.message 
      }); 
    }
  };
  
  // Eliminar una competencia
  exports.eliminarCompetenciaIndividual = async (req, res) => {
    const { id } = req.params;
    try {
      await db.query(`
        DELETE FROM competencias_individuales 
        WHERE id = ?
      `, [id]);
  
      res.json({ 
        success: true, 
        message: 'Competencia eliminada correctamente.' 
      });
    } catch (error) {
      console.error('Error al eliminar competencia:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar la competencia.',
        error: error.message 
      }); 
    }
  };

  exports.actualizarResultado = async (req, res) => {
    const { competencia_id, equipo_id, resultado } = req.body;
  
    try {
      // Validate input
      if (!competencia_id || !equipo_id || resultado === undefined) {
        return res.status(400).json({ message: 'Datos incompletos' });
      }
  
      const query = `
        UPDATE competencia_equipos 
        SET resultado_equipo = ? 
        WHERE competencia_id = ? AND equipo_id = ?
      `;
  
      const [result] = await db.execute(query, [resultado, competencia_id, equipo_id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No se encontró el registro' });
      }
  
      res.status(200).json({ message: 'Resultado actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar resultado:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

  exports.obtenerResultadosCompetencia = async (req, res) => {
    try {
 
      const resultados = await db.query(`
        SELECT * 
        FROM competencia_equipos;
      `);
  
      res.status(200).json({
        success: true,
        data: resultados, 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al obtener resultados', 
        error: error.message 
      });
    }
  };