const express = require('express');
const router = express.Router();
const authAdmin = require('../middlewares/auth');
const pagosController = require('../controllers/pagosController');

// Aquí puedes agregar más rutas protegidas para verificar, anular, etc.

// Listar pagos
router.get('/', authAdmin, pagosController.listarPagos);

// Actualizar estado de un pago (verificado/anulado)
router.patch('/:id', authAdmin, pagosController.actualizarEstadoPago);

module.exports = router;