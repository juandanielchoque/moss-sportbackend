// routes/resultadoRoutes.js

const express = require('express');
const router = express.Router();
const resultadoController = require('../controllers/resultadoController');

// Crear resultado
router.post('/', resultadoController.createResultado);

// Obtener todos los resultados
router.get('/', resultadoController.getAllResultados);

// Obtener resultados por ID de partido
router.get('/partido/:partidoId', resultadoController.getResultadosByPartido);

// Actualizar un resultado
router.put('/:id', resultadoController.updateResultado);

// Eliminar un resultado
router.delete('/:id', resultadoController.deleteResultado);

module.exports = router;
