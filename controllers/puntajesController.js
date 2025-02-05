const puntajesController = {
    obtenerPuntajes: async (req, res) => {
      const db = req.app.get('db');
      try {
        const [rows] = await db.query('SELECT id, disciplina, puntaje_primer_puesto FROM disciplinas_puntaje ORDER BY id');
        res.json({ success: true, data: rows });
      } catch (error) {
        console.error('Error al obtener puntajes:', error);
        res.status(500).json({
          success: false,
          message: 'Error al obtener puntajes',
        });
      }
    },
  
    actualizarPuntaje: async (req, res) => {
      const db = req.app.get('db');
      try {
        const { id } = req.params;
        const { puntaje_primer_puesto } = req.body;
  
        if (!id || puntaje_primer_puesto === undefined) {
          return res.status(400).json({
            success: false,
            message: 'ID y puntaje_primer_puesto son obligatorios',
          });
        }
  
        const [result] = await db.query(
          'UPDATE disciplinas_puntaje SET puntaje_primer_puesto = ? WHERE id = ?',
          [puntaje_primer_puesto, id]
        );
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: 'Disciplina no encontrada' });
        }
  
        res.json({ success: true, message: 'Puntaje actualizado correctamente' });
      } catch (error) {
        console.error('Error al actualizar puntaje:', error);
        res.status(500).json({
          success: false,
          message: 'Error al actualizar puntaje',
        });
      }
    },
  
    inicializarPuntajes: async (req, res) => {
      const db = req.app.get('db');
      try {
        const puntajesIniciales = [
          { disciplina: 'INDIVIDUALES', puntaje_primer_puesto: 10 },
          { disciplina: 'COLECTIVOS', puntaje_primer_puesto: 20 },
          { disciplina: 'FULBITO Y BALONCESTO', puntaje_primer_puesto: 30 },
          { disciplina: 'TENIS DE MESA Y AJEDREZ', puntaje_primer_puesto: 15 },
        ];
  
        await db.query('TRUNCATE TABLE disciplinas_puntaje');
  
        const insertQuery = 'INSERT INTO disciplinas_puntaje (disciplina, puntaje_primer_puesto) VALUES (?, ?)';
        for (const puntaje of puntajesIniciales) {
          await db.query(insertQuery, [puntaje.disciplina, puntaje.puntaje_primer_puesto]);
        }
  
        res.json({
          success: true,
          message: 'Puntajes inicializados correctamente',
          data: puntajesIniciales,
        });
      } catch (error) {
        console.error('Error al inicializar puntajes:', error);
        res.status(500).json({
          success: false,
          message: 'Error al inicializar puntajes',
        });
      }
    },
  
    guardarMultiplesPuntajes: async (req, res) => {
      const db = req.app.get('db');
      try {
        const puntajes = req.body;
  
        if (!Array.isArray(puntajes)) {
          return res.status(400).json({
            success: false,
            message: 'Los datos deben ser un array de puntajes',
          });
        }
  
        for (const puntaje of puntajes) {
          if (!puntaje.disciplina || puntaje.puntaje === undefined) {
            return res.status(400).json({
              success: false,
              message: `Datos inválidos: ${JSON.stringify(puntaje)}`,
            });
          }
        }
  
        await db.query('TRUNCATE TABLE disciplinas_puntaje');
  
        const insertQuery = 'INSERT INTO disciplinas_puntaje (disciplina, puntaje_primer_puesto) VALUES (?, ?)';
        for (const puntaje of puntajes) {
          await db.query(insertQuery, [puntaje.disciplina, puntaje.puntaje]);
        }
  
        const [rowsAfter] = await db.query('SELECT * FROM disciplinas_puntaje');
  
        res.json({
          success: true,
          message: 'Puntajes guardados correctamente',
          data: rowsAfter,
        });
      } catch (error) {
        console.error('Error al guardar múltiples puntajes:', error);
        res.status(500).json({
          success: false,
          message: 'Error al guardar puntajes',
        });
      }
    },
  };
  
  module.exports = puntajesController;
  