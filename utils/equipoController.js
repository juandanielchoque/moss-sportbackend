// controllers/equipoController.js

exports.inscribirEquipo = async (req, res) => {
    const { torneoId, equipoId } = req.body;
    const userId = req.user.id; // El id del usuario se obtiene del JWT
  
    try {
      const [torneo] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);
  
      if (torneo.length === 0) {
        return res.status(404).json({ message: 'Torneo no encontrado' });
      }
  
      if (torneo[0].estado !== 'pendiente') {
        return res.status(400).json({ message: 'No se pueden inscribir equipos en un torneo que ya ha comenzado o finalizado.' });
      }
  
      const [equiposInscritos] = await db.query('SELECT COUNT(*) AS totalEquipos FROM equipos WHERE torneo_id = ?', [torneoId]);
      if (equiposInscritos[0].totalEquipos >= torneo[0].max_equipos) {
        return res.status(400).json({ message: 'El torneo ya ha alcanzado el número máximo de equipos.' });
      }
  
      // Lógica para inscribir el equipo al torneo
      await db.query('INSERT INTO equipos (equipo_id, torneo_id, capitán_id) VALUES (?, ?, ?)', [equipoId, torneoId, userId]);
  
      res.status(201).json({ message: 'Equipo inscrito exitosamente en el torneo.' });
  
    } catch (error) {
      res.status(500).json({ message: 'Error al inscribir el equipo', error: error.message });
    }
  };
  