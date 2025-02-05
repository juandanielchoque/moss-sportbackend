const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/miequipo', authenticateToken, jugadorController.obtenerEquipoPorCapitan);


router.get('/detalles', jugadorController.getJugadoresConEquipo);
router.get('/', jugadorController.obtenerJugadores);
router.post('/', jugadorController.agregarJugador);
router.get('/:id', jugadorController.getJugadorById);
router.put('/:id', jugadorController.updateJugador);
router.delete('/:id', jugadorController.deleteJugador);

module.exports = router;