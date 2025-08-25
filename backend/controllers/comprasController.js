const pool = require('../db');
const Joi = require('joi');

// Esquema de validación con Joi
const compraSchema = Joi.object({
    nombre: Joi.string().min(3).max(60).required(),
    cedula: Joi.string().pattern(/^\d+$/).required(),
    telefono: Joi.string().pattern(/^(\+58|58|0)?\d{10}$/).required(),
    referencia: Joi.string().pattern(/^\d{6}$/).required(),
    sorteo_id: Joi.number().integer().required(),
    boletos: Joi.array().items(Joi.number().integer().min(1).max(10000)).min(1).required()
});

exports.comprarBoletos = async (req, res) => {
    console.log("Datos recibidos:", req.body);
    
    // Aquí está la corrección: Convertir la cadena de boletos a un arreglo ANTES de la validación.
    if (req.body.boletos && typeof req.body.boletos === 'string') {
        try {
            req.body.boletos = JSON.parse(req.body.boletos);
        } catch (e) {
            console.error('Error al parsear el arreglo de boletos:', e);
            // El error de validación de Joi lo capturará más adelante.
        }
    }

    // Convertir sorteo_id a un número si existe antes de la validación
    if (req.body.sorteo_id && typeof req.body.sorteo_id === 'string') {
        req.body.sorteo_id = parseInt(req.body.sorteo_id, 10);
    }
    
    // Validar datos
    const { error } = compraSchema.validate(req.body);
    if (error) {
        console.error("Error de validación:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }
    console.log("Validación exitosa.");

    const { nombre, cedula, telefono, referencia, sorteo_id, boletos } = req.body;
    const comprobante = req.file ? req.file.filename : null;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        console.log("Transacción iniciada.");

        // ====> CORRECCIÓN CLAVE: Verificar la disponibilidad de boletos PRIMERO <====
        for (let numero of boletos) {
            const [boleto] = await conn.query(
                'SELECT id FROM boletos WHERE sorteo_id = ? AND numero = ? AND vendido = 0',
                [sorteo_id, numero]
            );
            // Si el boleto no existe o ya está vendido, se revierte la transacción.
            if (boleto.length === 0) {
                await conn.rollback();
                console.error(`Error: El boleto ${numero} ya fue vendido.`);
                return res.status(400).json({ error: `El boleto ${numero} ya fue vendido` });
            }
        }
        console.log("Todos los boletos están disponibles. Continuando con el registro.");

        // 2. Punto de control: Búsqueda o registro de comprador
        let [compradores] = await conn.query(
            'SELECT id FROM compradores WHERE cedula = ? AND telefono = ?', [cedula, telefono]
        );
        let comprador_id;
        if (compradores.length > 0) {
            comprador_id = compradores[0].id;
            console.log("Comprador existente encontrado, ID:", comprador_id);
        } else {
            const [result] = await conn.query(
                'INSERT INTO compradores (nombre, cedula, telefono) VALUES (?, ?, ?)',
                [nombre, cedula, telefono]
            );
            comprador_id = result.insertId;
            console.log("Nuevo comprador registrado, ID:", comprador_id);
        }

        // 3. Punto de control: Registro de pago
        const [pagoResult] = await conn.query(
            'INSERT INTO pagos (comprador_id, sorteo_id, referencia, comprobante, estado) VALUES (?, ?, ?, ?, ?)',
            [comprador_id, sorteo_id, referencia, comprobante, 'pendiente']
        );
        const pago_id = pagoResult.insertId;
        console.log("Pago registrado, ID:", pago_id);

        // 4. Punto de control: Bucle de boletos
        // ====> Ahora actualizamos los boletos, ya que su disponibilidad fue verificada <====
        for (let numero of boletos) {
            await conn.query(
                'UPDATE boletos SET vendido = 1, comprador_id = ?, pago_id = ? WHERE sorteo_id = ? AND numero = ?',
                [comprador_id, pago_id, sorteo_id, numero]
            );
            console.log(`Boleto ${numero} actualizado.`);
        }

        await conn.commit();
        console.log("Transacción finalizada con éxito.");
        res.json({ message: 'Compra registrada. Esperando verificación de pago.' });
    } catch (err) {
        await conn.rollback();
        console.error("Error inesperado en la transacción:", err);
        res.status(500).json({ error: 'Error al procesar la compra' });
    } finally {
        conn.release();
        console.log("Conexión a la base de datos liberada.");
    }
};
