const pool = require('../db');
const path = require('path');

// Crear sorteo
exports.crearSorteo = async (req, res) => {
    const { titulo, descripcion, fecha, hora, minimo_boletos } = req.body;
    const imagen = req.file ? req.file.filename : null;

    if (!titulo || !descripcion || !fecha || !hora) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        const sorteo = await Sorteo.create({
            titulo,
            descripcion,
            imagen,
            fecha,
            hora,
            minimo_boletos: minimo_boletos || 1
        });
        res.json({ message: 'Sorteo creado', sorteo_id: sorteo.id });
    } catch (err) {
        console.error('Error al crear el sorteo:', err);
        res.status(500).json({ error: 'Error al crear el sorteo' });
    }
};

// Editar sorteo
exports.editarSorteo = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const imagen = req.file ? req.file.filename : null;

    if (imagen) {
        updateData.imagen = imagen;
    }

    try {
        const sorteo = await Sorteo.findById(id);
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        await sorteo.update(updateData);
        res.json({ message: 'Sorteo actualizado' });
    } catch (err) {
        console.error('Error al actualizar el sorteo:', err);
        res.status(500).json({ error: 'Error al actualizar el sorteo' });
    }
};

// Finalizar sorteo
exports.finalizarSorteo = async (req, res) => {
    const { id } = req.params;
    try {
        const sorteo = await Sorteo.findById(id);
        if (!sorteo) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        await sorteo.update({ estado: 'finalizado' });
        res.json({ message: 'Sorteo finalizado' });
    } catch (err) {
        console.error('Error al finalizar el sorteo:', err);
        res.status(500).json({ error: 'Error al finalizar el sorteo' });
    }
};

// Listar todos los sorteos (admin)
exports.listarSorteos = async (req, res) => {
    try {
        const sorteos = await Sorteo.findAll({ order: [['created_at', 'DESC']] });
        res.json({ sorteos });
    } catch (err) {
        console.error('Error al obtener los sorteos:', err);
        res.status(500).json({ error: 'Error al obtener los sorteos' });
    }
};

// Listar sorteos activos (para frontend público)
exports.listarSorteosActivos = async (req, res) => {
    try {
        const [sorteos] = await pool.query('SELECT * FROM sorteos WHERE estado = "activo" ORDER BY created_at DESC');
        res.json({ sorteos });
    } catch (err) {
        console.error('Error al obtener los sorteos activos:', err); // Añadir el log de error
        res.status(500).json({ error: 'Error al obtener los sorteos activos' });
    }
};

// Listar sorteos finalizados (para frontend público)
exports.listarSorteosFinalizados = async (req, res) => {
    try {
        const sorteos = await Sorteo.findAll({
            where: { estado: 'finalizado' },
            order: [['created_at', 'DESC']]
        });
        res.json({ sorteos });
    } catch (err) {
        console.error('Error al obtener los sorteos finalizados:', err);
        res.status(500).json({ error: 'Error al obtener los sorteos finalizados' });
    }
};