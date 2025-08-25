const pool = require('../db');

function enmascararCedula(cedula) {
    return cedula.slice(0, 4) + '*'.repeat(cedula.length - 4);
}

function enmascararTelefono(telefono) {
    return telefono.slice(0, 6) + '*'.repeat(telefono.length - 6);
}

exports.verificarBoleto = async (req, res) => {
    const { telefono, numero } = req.query;

    try {
        if (telefono) {
            // Buscar todos los boletos comprados por ese teléfono
            const [comprador] = await pool.query(
                'SELECT id, nombre, cedula, telefono FROM compradores WHERE telefono = ?',
                [telefono]
            );
            if (comprador.length === 0) return res.status(404).json({ error: 'No se encontraron boletos para este teléfono' });

            const [boletos] = await pool.query(
                'SELECT numero FROM boletos WHERE comprador_id = ? AND vendido = 1',
                [comprador[0].id]
            );
            if (boletos.length === 0) return res.status(404).json({ error: 'No se encontraron boletos para este teléfono' });

            return res.json({
                nombre: comprador[0].nombre,
                cedula: enmascararCedula(comprador[0].cedula),
                telefono: enmascararTelefono(comprador[0].telefono),
                boletos: boletos.map(b => b.numero)
            });
        } else if (numero) {
            // Buscar el boleto por número
            const [boleto] = await pool.query(
                'SELECT b.numero, c.nombre, c.cedula, c.telefono FROM boletos b JOIN compradores c ON b.comprador_id = c.id WHERE b.numero = ? AND b.vendido = 1',
                [numero]
            );
            if (boleto.length === 0) return res.status(404).json({ error: 'Boleto no encontrado o no vendido' });

            return res.json({
                nombre: boleto[0].nombre,
                cedula: enmascararCedula(boleto[0].cedula),
                telefono: enmascararTelefono(boleto[0].telefono),
                boletos: [boleto[0].numero]
            });
        } else {
            return res.status(400).json({ error: 'Debes enviar teléfono o número de boleto' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al verificar el boleto' });
    }
};