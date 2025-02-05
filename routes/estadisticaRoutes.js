const express = require('express');
const router = express.Router();
const estadisticaController = require('../controllers/estadisticaController');

router.get('/', estadisticaController.obtenerPuntuaciones);
router.get('/equipo/:equipoId', estadisticaController.obtenerEstadisticasEquipo);

module.exports = router;