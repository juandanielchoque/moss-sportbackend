const Equipo = require('../models/Equipo');

const equipoController = {
  // Crear un nuevo equipo
  createEquipo: async (req, res) => {
    const { nombre, capitan_id, torneo_id } = req.body;

    try {
      // Verificar si el capitán ya está asignado a un equipo en este torneo
      const equipoExistente = await Equipo.getByCapitanAndTorneo(capitan_id, torneo_id);

      if (equipoExistente) {
        return res.status(400).json({ message: 'El capitán ya está asignado a un equipo en este torneo.' });
      }

      // Si no existe, crear el nuevo equipo
      const nuevoEquipo = await Equipo.create(nombre, capitan_id, torneo_id);
      res.status(201).json(nuevoEquipo);
    } catch (err) {
      console.error('Error al crear el equipo:', err);
      res.status(500).json({ message: 'Error al crear el equipo', error: err.message });
    }
  },

  // Obtener todos los equipos
  getAllEquipos: async (req, res) => {
    try {
      const equipos = await Equipo.getAll();
      res.status(200).json(equipos);
    } catch (err) {
      console.error('Error al obtener los equipos:', err);
      res.status(500).json({ message: 'Error al obtener los equipos', error: err.message });
    }
  },

  // Obtener un equipo por ID
  getEquipoById: async (req, res) => {
    const { id } = req.params;
    try {
      const equipo = await Equipo.getById(id);
      if (!equipo) {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
      res.status(200).json(equipo);
    } catch (err) {
      console.error('Error al obtener el equipo:', err);
      res.status(500).json({ message: 'Error al obtener el equipo', error: err.message });
    }
  },

  // Actualizar un equipo
  updateEquipo: async (req, res) => {
    const { id } = req.params;
    const { nombre, capitan_id, torneo_id } = req.body;

    try {
      const equipoExistente = await Equipo.getByCapitanAndTorneo(capitan_id, torneo_id);

      if (equipoExistente && equipoExistente.id !== parseInt(id)) {
        return res.status(400).json({ message: 'El capitán ya está asignado a un equipo en este torneo.' });
      }

      const equipoActualizado = await Equipo.update(id, nombre, capitan_id, torneo_id);
      res.status(200).json(equipoActualizado);
    } catch (err) {
      console.error('Error al actualizar el equipo:', err);
      res.status(500).json({ message: 'Error al actualizar el equipo', error: err.message });
    }
  },

  // Eliminar un equipo
  deleteEquipo: async (req, res) => {
    const { id } = req.params;

    try {
      const equipoEliminado = await Equipo.delete(id);
      res.status(200).json({ message: 'Equipo eliminado', equipo: equipoEliminado });
    } catch (err) {
      console.error('Error al eliminar el equipo:', err);
      res.status(500).json({ message: 'Error al eliminar el equipo', error: err.message });
    }
  }
};

module.exports = equipoController;
