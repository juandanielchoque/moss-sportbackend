const express = require('express');
const router = express.Router();
const torneoController = require('../controllers/torneoController');

// Crear un torneo
router.post('/', torneoController.crearTorneo);

// Obtener torneos
router.get('/', torneoController.obtenerTorneos);

// Eliminar un torneo
router.delete('/:id', torneoController.eliminarTorneo);

// Obtener todos los torneos con disciplinas y categorías
router.get('/con-disciplinas-categorias', torneoController.obtenerTorneosConDisciplinasYCategorias);

// En tu archivo de rutas de torneos
router.get('/estadisticas', torneoController.obtenerEstadisticas);

module.exports = router;