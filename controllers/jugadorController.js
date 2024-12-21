// controllers/jugadorController.js

const Jugador = require('../models/Jugador');

const createJugador = async (req, res) => {
  const { nombre, edad, posicion, numero_camiseta, equipo_id } = req.body;
  
  try {
    const jugador = await Jugador.create({ nombre, edad, posicion, numero_camiseta, equipo_id });
    res.status(201).json(jugador);
  } catch (err) {
    console.error('Error al crear el jugador:', err);
    res.status(500).json({ message: 'Error al crear el jugador', error: err.message });
  }
};

const getAllJugadores = async (req, res) => {
  try {
    const jugadores = await Jugador.getAll();
    res.status(200).json(jugadores);
  } catch (err) {
    console.error('Error al obtener los jugadores:', err);
    res.status(500).json({ message: 'Error al obtener los jugadores', error: err.message });
  }
};

const getJugadorById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const jugador = await Jugador.getById(id);
    if (jugador) {
      res.status(200).json(jugador);
    } else {
      res.status(404).json({ message: 'Jugador no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el jugador:', err);
    res.status(500).json({ message: 'Error al obtener el jugador', error: err.message });
  }
};

const updateJugador = async (req, res) => {
  const { id } = req.params;
  const { nombre, edad, posicion, numero_camiseta, equipo_id } = req.body;
  
  try {
    const jugadorActualizado = await Jugador.update(id, { nombre, edad, posicion, numero_camiseta, equipo_id });
    if (jugadorActualizado) {
      res.status(200).json(jugadorActualizado);
    } else {
      res.status(404).json({ message: 'Jugador no encontrado' });
    }
  } catch (err) {
    console.error('Error al actualizar el jugador:', err);
    res.status(500).json({ message: 'Error al actualizar el jugador', error: err.message });
  }
};

const deleteJugador = async (req, res) => {
  const { id } = req.params;
  
  try {
    const jugadorEliminado = await Jugador.delete(id);
    if (jugadorEliminado) {
      res.status(200).json({ message: 'Jugador eliminado' });
    } else {
      res.status(404).json({ message: 'Jugador no encontrado' });
    }
  } catch (err) {
    console.error('Error al eliminar el jugador:', err);
    res.status(500).json({ message: 'Error al eliminar el jugador', error: err.message });
  }
};

module.exports = {
  createJugador,
  getAllJugadores,
  getJugadorById,
  updateJugador,
  deleteJugador
};
