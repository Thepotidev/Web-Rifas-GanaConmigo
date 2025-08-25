const pool = require('../db');

// =========================================================================
// FUNCIONES PÚBLICAS (ACCESIBLES DESDE EL FRONTEND)
// =========================================================================

// Obtiene los boletos disponibles para un sorteo específico.
exports.getBoletosDisponibles = async (req, res) => {
    const { sorteoId } = req.params;
    try {
        const [boletos] = await pool.query(
            // La consulta obtiene los boletos no vendidos para el sorteo especificado
            'SELECT numero FROM boletos WHERE sorteo_id = ? AND vendido = 0 ORDER BY numero ASC',
            [sorteoId]
        );
        // Envía el array de boletos disponibles como respuesta JSON
        res.json(boletos);
    } catch (err) {
        console.error('Error al obtener boletos disponibles:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener boletos' });
    }
};

// =========================================================================
// FUNCIONES DE ADMINISTRACIÓN
// =========================================================================

// Listar todos los boletos de un sorteo (para el panel de administración).
exports.listarBoletos = async (req, res) => {
    const { sorteo_id } = req.query;
    try {
        const [boletos] = await pool.query(
            // Se usa CAST para ordenar numéricamente, ya que 'numero' es VARCHAR
            'SELECT * FROM boletos WHERE sorteo_id = ? ORDER BY CAST(numero AS UNSIGNED) ASC',
            [sorteo_id]
        );
        res.json({ boletos });
    } catch (err) {
        console.error('Error al obtener los boletos:', err);
        res.status(500).json({ error: 'Error al obtener los boletos' });
    }
};

// Ver detalles de un boleto (para el panel de administración).
exports.verBoleto = async (req, res) => {
    const { id } = req.params;
    try {
        const [boleto] = await pool.query(
            'SELECT * FROM boletos WHERE id = ?',
            [id]
        );
        if (boleto.length === 0) return res.status(404).json({ error: 'Boleto no encontrado' });
        res.json({ boleto: boleto[0] });
    } catch (err) {
        console.error('Error al obtener el boleto:', err);
        res.status(500).json({ error: 'Error al obtener el boleto' });
    }
};

// Crear boletos para un sorteo (por ejemplo, 10.000 boletos).
exports.crearBoletos = async (req, res) => {
    const { sorteo_id, cantidad } = req.body;
    if (!sorteo_id || !cantidad) return res.status(400).json({ error: 'Faltan datos' });
    try {
        const values = [];
        for (let i = 0; i < cantidad; i++) {
            // El número de boleto se formatea con ceros a la izquierda
            const numeroFormateado = i.toString().padStart(4, '0');
            values.push([sorteo_id, numeroFormateado]);
        }
        await pool.query('INSERT INTO boletos (sorteo_id, numero) VALUES ?', [values]);
        res.json({ message: 'Boletos creados' });
    } catch (err) {
        console.error('Error al crear los boletos:', err);
        res.status(500).json({ error: 'Error al crear los boletos' });
    }
};

// Actualizar estado de un boleto (por ejemplo, marcar como vendido).
exports.actualizarEstadoBoleto = async (req, res) => {
    const { id } = req.params;
    const { vendido, comprador_id, pago_id } = req.body;
    try {
        await pool.query(
            'UPDATE boletos SET vendido = ?, comprador_id = ?, pago_id = ? WHERE id = ?',
            [vendido, comprador_id, pago_id, id]
        );
        res.json({ message: 'Boleto actualizado' });
    } catch (err) {
        console.error('Error al actualizar el boleto:', err);
        res.status(500).json({ error: 'Error al actualizar el boleto' });
    }
};
