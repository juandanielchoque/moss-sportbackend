// controllers/torneoController.js

// Actualizar un torneo por ID
exports.actualizarTorneo = async (req, res) => {
    const torneoId = req.params.id;
    const { nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas } = req.body;
  
    try {
      const [torneo] = await db.query('SELECT * FROM torneos WHERE id = ?', [torneoId]);
  
      if (torneo.length === 0) {
        return res.status(404).json({ message: 'Torneo no encontrado' });
      }
  
      if (torneo[0].estado === 'finalizado') {
        return res.status(403).json({ message: 'No se puede editar un torneo que ya está finalizado.' });
      }
  
      // Lógica para actualizar el torneo
      await db.query('UPDATE torneos SET nombre = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, lugar = ?, max_equipos = ?, min_equipos = ?, estado = ?, reglas = ? WHERE id = ?',
        [nombre, tipo, fecha_inicio, fecha_fin, lugar, max_equipos, min_equipos, estado, reglas, torneoId]);
  
      res.status(200).json({ message: 'Torneo actualizado exitosamente' });
  
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el torneo', error: error.message });
    }
  };
  