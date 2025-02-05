const express = require('express');
const router = express.Router();
const competicionController = require('../controllers/competicionController');

router.get('/', competicionController.obtenerCompetenciasIndividuales);
router.get('/:id/equipos', competicionController.obtenerEquiposDeCompetencia);
router.put('/:id/finalizar', competicionController.finalizarCompetenciaIndividual);
router.delete('/:id', competicionController.eliminarCompetenciaIndividual);
router.put('/actualizar-resultado', competicionController.actualizarResultado);
router.get('/resultados', competicionController.obtenerResultadosCompetencia);

module.exports = router;
