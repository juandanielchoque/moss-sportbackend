const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Obtener todas las categorías
router.get('/', categoriaController.obtenerCategorias);

// Crear una categoría
router.post('/', categoriaController.crearCategoria); 

// Eliminar una categoría
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;