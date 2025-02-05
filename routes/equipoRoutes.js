const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const equipoController = require('../controllers/equipoController');


// Crear un nuevo equipo
router.post('/', upload.single('logo'), equipoController.crearEquipo);

// Obtener todos los equipos
router.get('/', equipoController.obtenerEquipos);

// Actualizar un equipo
router.put('/:id', equipoController.actualizarEquipo);

// Eliminar un equipo
router.delete('/:id', equipoController.eliminarEquipo);

// Obtener equipos por categoría
router.get('/', equipoController.obtenerEquiposPorCategoria);


module.exports = router;