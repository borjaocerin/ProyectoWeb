const Compra = require('../models/compra');

// Obtener todas las compras
const getAllCompras = async (req, res) => {
    try {
        const compras = await Compra.find();
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};

// Obtener un pedido por ID
const getCompraById = async (req, res) => {
    try {
        const compra = await Compra.findById(req.params.id);
        if (!compra) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.status(200).json(compra);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error });
    }
};

// Crear un nuevo pedido
const createCompra = async (req, res) => {
    const { email, id_producto, fecha_pedido, precio } = req.body;

    const nuevaCompra = new Compra({ email, id_producto, fecha_pedido, precio });

    try {
        const savedCompra = await nuevaCompra.save();
        res.status(201).json(savedCompra);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido', error });
    }
};

// Eliminar un pedido por ID
const deleteCompraById = async (req, res) => {
    try {
        const deletedCompra = await Compra.findByIdAndDelete(req.params.id);
        if (!deletedCompra) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.status(200).json({ message: 'Pedido eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido', error });
    }
};

const jwt = require('jsonwebtoken');
const getComprasByUsuarioEmail = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó un token' });
        }

        const decoded = jwt.decode(token);
        const email = decoded?.sub;

        if (!email) {
            return res.status(400).json({ message: 'El token no contiene información válida de email' });
        }

        const compras = await Compra.find({ email });

        if (compras.length === 0) {
            return res.status(404).json({ message: 'No se encontraron compras para este usuario' });
        }

        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las compras', error });
    }
};


module.exports = {
    getAllCompras,
    getComprasByUsuarioEmail,
    getCompraById,
    createCompra,
    deleteCompraById,
};
