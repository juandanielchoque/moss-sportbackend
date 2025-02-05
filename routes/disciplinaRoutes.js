const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');

// Crear una disciplina
router.post('/', disciplinaController.crearDisciplina); 

// Obtener todas las disciplinas
router.get('/', disciplinaController.obtenerDisciplinas);

// Eliminar una disciplina
router.delete('/:id', disciplinaController.eliminarDisciplina); 

module.exports = router;