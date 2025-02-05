const express = require('express');
const router = express.Router();
const disciplinaCategoriaController = require('../controllers/disciplinaCategoriaController');

// Asignar una categoría a una disciplina
router.post('/', disciplinaCategoriaController.asignarCategoria);

// Obtener categorías de una disciplina
router.get('/:disciplina_id', disciplinaCategoriaController.obtenerCategoriasPorDisciplina);

module.exports = router;