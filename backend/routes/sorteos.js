const express = require('express');
const router = express.Router();
const authAdmin = require('../middlewares/auth');
const sorteosController = require('../controllers/sorteosController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer
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
        // Solo imágenes
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten imágenes'));
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB máximo
});

// Crear nuevo sorteo
router.post('/', authAdmin, upload.single('imagen'), sorteosController.crearSorteo);

// Editar sorteo
router.put('/:id', authAdmin, upload.single('imagen'), sorteosController.editarSorteo);

// Finalizar sorteo
router.patch('/:id/finalizar', authAdmin, sorteosController.finalizarSorteo);

module.exports = router;