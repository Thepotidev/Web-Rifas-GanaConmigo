const bcrypt = require('bcryptjs');
const pool = require('./db');

async function crearAdmin() {
    const username = 'admin'; // Cambia si quieres otro usuario
    const passwordPlano = '168631*rr'; // Cambia por tu contraseña segura
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
        if (rows.length > 0) {
            console.log('El usuario admin ya existe.');
            process.exit();
        }
        await pool.query('INSERT INTO admin (username, password) VALUES (?, ?)', [username, passwordHash]);
        console.log('Usuario admin creado con éxito.');
    } catch (err) {
        console.error('Error creando admin:', err);
    } finally {
        process.exit();
    }
}

crearAdmin();