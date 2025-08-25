require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const path = require('path');

const app = express();

// Seguridad HTTP
app.use(helmet());

// CORS solo para tu frontend
app.use(cors());

// Rate limit global
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 peticiones por IP
    message: 'Demasiadas solicitudes, intenta más tarde.'
}));

// Manejo de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Parseo de JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta para comprobantes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/fonts', express.static(path.join(__dirname, '..', 'fonts')));

// 1. Definir TODAS las rutas de la API primero
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const sorteosRoutes = require('./routes/sorteos');
app.use('/api/sorteos', sorteosRoutes);

const boletosRoutes = require('./routes/boletos');
app.use('/api/boletos', boletosRoutes);

const pagosRoutes = require('./routes/pagos');
app.use('/api/pagos', pagosRoutes);

const comprasRoutes = require('./routes/compras');
app.use('/api/compras', comprasRoutes);

const verificadorRoutes = require('./routes/verificador');
app.use('/api/verificador', verificadorRoutes);

const publicRoutes = require('./routes/public');
app.use('/api/public', publicRoutes);

const db = require('./db');

// 2. Servir los archivos estáticos del frontend DESPUÉS de las rutas de la API
// La ruta ahora apunta correctamente a la carpeta 'src'
const frontendPath = path.join(__dirname, '..', 'src');
app.use(express.static(frontendPath));

// 3. Manejar cualquier otra petición no cubierta por las rutas de la API o archivos estáticos
// Esto es útil para rutas de SPA (Single Page Application) o para servir el index.html por defecto.
app.get('/', (req, res) => {
    // ASEGÚRATE de que esta ruta sea correcta para tu index.html
    res.sendFile(path.join(frontendPath, 'assets', 'pages', 'index.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
     const host = 'localhost'; // O puedes usar la IP de tu máquina si es necesario
    const url = `http://${host}:${PORT}`;
    console.log(`Servidor backend escuchando en puerto ${url}`);
    try {
        await db.getConnection(); // Intenta obtener una conexión del pool
        console.log('Conexión a la base de datos MySQL exitosa.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
});