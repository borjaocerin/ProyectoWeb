const express = require('express');
const router = express.Router();
const {
    getAllCompras,
    getCompraById,
    createCompra,
    deleteCompraById,
    getComprasByUsuarioEmail,
} = require('../controllers/comprasController');


// Obtener un pedido por ID
router.get('/:id', getCompraById);

// Obtener todas las compras de un usuario por email
router.get('/usuario/:email', getComprasByUsuarioEmail); 

// Crear un nuevo pedido
router.post('/', createCompra);

// Eliminar un pedido por ID
router.delete('/:id', deleteCompraById);

module.exports = router;
