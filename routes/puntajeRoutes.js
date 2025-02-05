// routes/puntajesRoutes.js
const express = require('express');
const router = express.Router();
const puntajesController = require('../controllers/puntajesController');

// Define las rutas
router.get('/', puntajesController.obtenerPuntajes);
router.put('/:id', puntajesController.actualizarPuntaje);
router.post('/inicializar', puntajesController.inicializarPuntajes);
router.post('/multiple', puntajesController.guardarMultiplesPuntajes);

module.exports = router;