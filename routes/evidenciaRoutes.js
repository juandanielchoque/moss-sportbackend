// routes/evidenciaRoutes.js
const express = require('express');
const router = express.Router();
const evidenciasController = require('../controllers/evidenciaController');

// Subir una nueva evidencia
router.post('/', evidenciasController.subirEvidencia);

// Obtener todas las evidencias
router.get('/', evidenciasController.obtenerTodasLasEvidencias);

// Obtener evidencias de un partido específico
router.get('/partido/:partido_id', evidenciasController.obtenerEvidenciasPorPartido);

// Verificar si existe evidencia para un partido
router.get('/verificar/:partido_id', evidenciasController.verificarEvidenciaExistente);

// Eliminar una evidencia
router.delete('/:id', evidenciasController.eliminarEvidencia);
module.exports = router;