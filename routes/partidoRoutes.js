// routes/partidoRoutes.js

const express = require('express');
const router = express.Router();
const partidoController = require('../controllers/partidoController');

router.post('/', partidoController.createPartido);  // Crear un partido
router.get('/', partidoController.getAllPartidos);  // Obtener todos los partidos
router.get('/:id', partidoController.getPartidoById);  // Obtener un partido por ID
router.put('/:id', partidoController.updatePartido);  // Actualizar un partido
router.delete('/:id', partidoController.deletePartido);  // Eliminar un partido

module.exports = router;
