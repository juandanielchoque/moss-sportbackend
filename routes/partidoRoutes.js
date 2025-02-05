// routes/partidoRoutes.js

const express = require('express');
const router = express.Router();
const partidoController = require('../controllers/partidoController');

// Definir las rutas y asignar los controladores
router.get('/', partidoController.obtenerPartidos);
router.get('/equipos', partidoController.obtenerEquipos);
router.get('/torneos', partidoController.obtenerTorneos);
router.get('/disciplinas', partidoController.obtenerDisciplinas);
router.get('/categorias', partidoController.obtenerCategorias);
router.get('/torneo_disciplinas', partidoController.obtenerTorneoDisciplinas); 
router.get('/disciplina_categorias', partidoController.obtenerDisciplinaCategorias); 
router.post('/', partidoController.crearPartido);
router.put('/:id', partidoController.actualizarPartido);
router.delete('/:id', partidoController.eliminarPartido);
router.put('/:id/finalizar', partidoController.finalizarPartido);
router.post('/competencias_individuales', partidoController.crearCompetenciaIndividual);
router.put('/:id/puntuacion', partidoController.actualizarPuntuacion);


module.exports = router;

