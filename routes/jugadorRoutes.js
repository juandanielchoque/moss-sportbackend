// routes/jugadorRoutes.js

const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

// Definir las rutas de los jugadores
router.post('/', jugadorController.createJugador);  // Crear un jugador
router.get('/', jugadorController.getAllJugadores);  // Obtener todos los jugadores

// Ruta para obtener los jugadores con información de su equipo
router.get('/detalles', jugadorController.getJugadoresConEquipo);

router.get('/:id', jugadorController.getJugadorById);  // Obtener un jugador por ID
router.put('/:id', jugadorController.updateJugador);  // Actualizar un jugador
router.delete('/:id', jugadorController.deleteJugador);  // Eliminar un jugador

module.exports = router;
