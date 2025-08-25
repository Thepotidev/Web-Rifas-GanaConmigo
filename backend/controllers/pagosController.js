const pool = require('../db');

// Listar todos los pagos
exports.listarPagos = async (req, res) => {
    try {
        const [pagos] = await pool.query(
            `SELECT pagos.*, compradores.nombre, compradores.cedula, compradores.telefono 
             FROM pagos 
             JOIN compradores ON pagos.comprador_id = compradores.id
             ORDER BY pagos.created_at DESC`
        );
        res.json({ pagos });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los pagos' });
    }
};

// Verificar o anular un pago
exports.actualizarEstadoPago = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // 'verificado' o 'anulado'
    if (!['verificado', 'anulado'].includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }
    try {
        await pool.query(
            'UPDATE pagos SET estado = ? WHERE id = ?',
            [estado, id]
        );
        res.json({ message: `Pago marcado como ${estado}` });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el pago' });
    }
};

// (Puedes agregar más métodos: ver detalles, eliminar, etc.)