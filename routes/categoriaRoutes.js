// routes/categoriaRoutes.js

const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController'); // Importa el controlador

// Ruta para obtener todas las categorías
router.get('/categorias', categoriaController.getAllCategorias);
// Ruta para obtener categorías con torneos, equipos y capitanes asociados
router.get('/categorias-torneos-equipos', categoriaController.getCategoriasWithTorneosEquipos); // Nueva ruta
// Ruta para obtener categorías con torneos asociados
router.get('/categorias-torneos', categoriaController.getCategoriasConTorneos); // Nueva ruta



// Ruta para obtener las categorías de un torneo específico
router.get('/:torneoId', categoriaController.getCategoriasByTorneo);

// Ruta para crear una nueva categoría
router.post('/categorias', categoriaController.createCategoria);

// Ruta para actualizar una categoría
router.put('/categorias/:id', categoriaController.updateCategoria);

// Ruta para eliminar una categoría
router.delete('/categorias/:id', categoriaController.deleteCategoria);


module.exports = router;
