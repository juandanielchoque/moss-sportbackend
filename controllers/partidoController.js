// controllers/partidoController.js

const Partido = require('../models/Partido');

const createPartido = async (req, res) => {
  const { torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro } = req.body;
  
  try {
    const partido = await Partido.create({ torneo_id, equipo_local_id, equipo_visitante_id, fecha_hora, lugar, estado, goles_local, goles_visitante, arbitro });
    res.status(201).json(partido);
  } catch (err) {
    console.error('Error al crear el partido:', err);
    res.status(500).json({ message: 'Error al crear el partido', error: err.message });
  }
};

const getAllPartidos = async (req, res) => {
  try {
    const partidos = await Partido.getAll();
    res.status(200).json(partidos);
  } catch (err) {
    console.error('Error al obtener los partidos:', err);
    res.status(500).json({ message: 'Error al obtener los partidos', error: err.message });
  }
};

const getPartidoById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const partido = await Partido.getById(id);
    if (partido) {
      res.status(200).json(partido);
    } else {
      res.status(404).json({ message: 'Partido no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el partido:', err);
    res.status(500).json({ message: 'Error al obtener el partido', error: err.message });
  }
};

const updatePartido = async (req, res) => {
  const { id } = req.params;
  const { goles_local, goles_visitante, estado } = req.body;
  
  try {
    const partidoActualizado = await Partido.update(id, { goles_local, goles_visitante, estado });
    if (partidoActualizado) {
      res.status(200).json(partidoActualizado);
    } else {
      res.status(404).json({ message: 'Partido no encontrado' });
    }
  } catch (err) {
    console.error('Error al actualizar el partido:', err);
    res.status(500).json({ message: 'Error al actualizar el partido', error: err.message });
  }
};

const deletePartido = async (req, res) => {
  const { id } = req.params;
  
  try {
    const partidoEliminado = await Partido.delete(id);
    if (partidoEliminado) {
      res.status(200).json({ message: 'Partido eliminado' });
    } else {
      res.status(404).json({ message: 'Partido no encontrado' });
    }
  } catch (err) {
    console.error('Error al eliminar el partido:', err);
    res.status(500).json({ message: 'Error al eliminar el partido', error: err.message });
  }
};

module.exports = {
  createPartido,
  getAllPartidos,
  getPartidoById,
  updatePartido,
  deletePartido
};
