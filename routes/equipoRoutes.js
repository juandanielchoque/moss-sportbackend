const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

// Crear un equipo
router.post('/equipos', equipoController.createEquipo);

// Obtener todos los equipos
router.get('/equipos', equipoController.getAllEquipos);

// Obtener un equipo por ID
router.get('/equipos/:id', equipoController.getEquipoById);

// Actualizar un equipo
router.put('/equipos/:id', equipoController.updateEquipo);

// Eliminar un equipo
router.delete('/equipos/:id', equipoController.deleteEquipo);

module.exports = router;
