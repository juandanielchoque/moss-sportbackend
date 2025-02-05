const express = require('express');
const router = express.Router();
const torneoDisciplinaController = require('../controllers/torneoDisciplinaController');

// Asignar una disciplina a un torneo
// Obtener disciplinas de un torneo (sin autenticación)
router.get('/:torneo_id', torneoDisciplinaController.obtenerDisciplinasPorTorneo);

// Obtener disciplinas de un torneo
router.get('/:torneo_id', torneoDisciplinaController.obtenerDisciplinasPorTorneo);

module.exports = router;