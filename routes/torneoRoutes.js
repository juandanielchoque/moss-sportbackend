// routes/torneoRoutes.js
const express = require('express');
const router = express.Router();
const torneoController = require('../controllers/torneoController');
const authMiddleware = require('../utils/authMiddleware');
const roleMiddleware = require('../utils/roleMiddleware');

// Ruta para crear un nuevo torneo (solo administradores)
router.post('/', authMiddleware, roleMiddleware(['administrador']), torneoController.crearTorneo);

// Ruta para actualizar un torneo (solo administradores y con restricciones)
router.put('/:id', authMiddleware, roleMiddleware(['administrador']), torneoController.actualizarTorneo);

// Ruta para eliminar un torneo (solo administradores y con restricciones)
router.delete('/:id', authMiddleware, roleMiddleware(['administrador']), torneoController.eliminarTorneo);

// Rutas de visualización de torneos (todos los usuarios pueden acceder)
router.get('/', torneoController.obtenerTorneos);
router.get('/:id', torneoController.obtenerTorneoPorId);

module.exports = router;
