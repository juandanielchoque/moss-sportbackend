const express = require('express');
const router = express.Router();
const torneoController = require('../controllers/torneoController');
const authMiddleware = require('../utils/authMiddleware');
const roleMiddleware = require('../utils/roleMiddleware');

// Rutas POST
// Ruta para crear un nuevo torneo (solo administradores)
router.post('/', authMiddleware, roleMiddleware(['administrador']), torneoController.crearTorneo);

// Ruta para agregar categorías a un torneo existente (recomendación para una ruta más limpia)
router.post('/:id/categorias', authMiddleware, roleMiddleware(['administrador']), torneoController.agregarCategorias);


// Rutas PUT
// Ruta para actualizar un torneo (solo administradores y con restricciones)
router.put('/:id', authMiddleware, roleMiddleware(['administrador']), torneoController.actualizarTorneo);

// Rutas DELETE
// Ruta para eliminar un torneo (solo administradores y con restricciones)
router.delete('/:id', authMiddleware, roleMiddleware(['administrador']), torneoController.eliminarTorneo);

// Rutas GET
// Obtener estadísticas
router.get('/estadisticas', torneoController.obtenerEstadisticas);

// Rutas de visualización de torneos (todos los usuarios pueden acceder)
router.get('/', torneoController.obtenerTorneos);
router.get('/:id', torneoController.obtenerTorneoPorId);



module.exports = router;
