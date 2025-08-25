const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authAdmin = require('../middlewares/auth');

// POST /api/admin/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Faltan datos' });

    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

        const admin = rows[0];
        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

        // Generar token JWT
        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ejemplo de ruta protegida:
router.get('/panel', authAdmin, async (req, res) => {
    res.json({ message: 'Bienvenido al panel de administración', admin: req.admin });
});

// Aquí puedes agregar más rutas protegidas usando authAdmin

module.exports = router;