const express = require('express');
const router = express.Router();
const authAdmin = require('../middlewares/auth');
const boletosController = require('../controllers/boletosController');

// =========================================================================
// RUTAS PÚBLICAS (ACCESIBLES PARA CUALQUIER USUARIO DEL FRONTEND)
// =========================================================================

// GET /api/boletos/disponibles/:sorteoId
// Obtiene la lista de boletos disponibles para un sorteo específico.
// Esta es la ruta que tu frontend está buscando y que estaba dando un error 404.
router.get('/disponibles/:sorteoId', boletosController.getBoletosDisponibles);

// =========================================================================
// RUTAS DE ADMINISTRADOR (PROTEGIDAS)
// =========================================================================

// GET /api/boletos/
// Listar todos los boletos de un sorteo (solo para administradores).
router.get('/', authAdmin, boletosController.listarBoletos);

// GET /api/boletos/:id
// Ver detalles de un boleto específico (solo para administradores).
router.get('/:id', authAdmin, boletosController.verBoleto);

// POST /api/boletos/
// Crear boletos para un sorteo (solo para administradores).
router.post('/', authAdmin, boletosController.crearBoletos);

// PUT /api/boletos/:id
// Actualizar el estado de un boleto (solo para administradores).
router.put('/:id', authAdmin, boletosController.actualizarEstadoBoleto);

module.exports = router;
