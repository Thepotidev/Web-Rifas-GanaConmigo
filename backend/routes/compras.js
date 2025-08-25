const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para comprobantes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten imágenes'));
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB máximo
});

// Endpoint público para compra de boletos
router.post('/', upload.single('comprobante'), comprasController.comprarBoletos);

module.exports = router;