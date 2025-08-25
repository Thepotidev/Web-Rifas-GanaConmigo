const express = require('express');
const router = express.Router();
const sorteosController = require('../controllers/sorteosController');

// Listar sorteos activos (público)
router.get('/activos', sorteosController.listarSorteosActivos);

// Listar sorteos finalizados (público)
router.get('/finalizados', sorteosController.listarSorteosFinalizados);

module.exports = router;