const express = require('express');
const router = express.Router();
const verificadorController = require('../controllers/verificadorController');
const rateLimit = require('express-rate-limit');

// Limita a 10 consultas por minuto por IP
const verificadorLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 10,
    message: { error: 'Demasiadas consultas, intenta más tarde.' }
});

// Buscar por número de boleto o teléfono, aplicando el rate limiter
router.get('/', verificadorLimiter, verificadorController.verificarBoleto);

module.exports = router;