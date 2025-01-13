const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

// Crear un equipo
router.post('/equipos', equipoController.createEquipo);

// Obtener todos los equipos
router.get('/equipos', equipoController.getAllEquipos);
router.get('/equipos/detalles', equipoController.getEquiposDetails);
router.get('/equipos/categorias', equipoController.obtenerEquipos);

// Obtener un equipo por ID
router.get('/equipos/:id', equipoController.getEquipoById);
// Ruta para obtener equipos asociados a un torneo y categoría
router.get('/equipos/torneo/:torneo_id/categoria/:categoria_id', equipoController.obtenerEquipos);


// Ruta para editar un equipo
router.put('/equipos', equipoController.editEquipo);  // Asegúrate de que la función 'editEquipo' esté bien referenciada


// Eliminar un equipo
router.delete('/equipos/:id', equipoController.deleteEquipo);



module.exports = router;
