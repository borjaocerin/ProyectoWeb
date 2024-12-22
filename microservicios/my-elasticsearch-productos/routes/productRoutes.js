

// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsByConsole,
    getProductsByName,
    createProduct,
    getProductsByPriceRange,
    deleteProductById,
    deleteAllProducts
} = require('../controller/productController');

// Ruta para obtener todos los productos
router.get('/', getAllProducts);

// Ruta para obtener un producto por ID
router.get('/id/:id', getProductById);

// Ruta para obtener productos por categoría
router.get('/category/:category', getProductsByCategory);

// Ruta para obtener productos por consola
router.get('/console/:console', getProductsByConsole);

// Ruta para obtener productos por nombre
router.get('/name/:name', getProductsByName);

// Ruta para crear un nuevo producto
router.post('/', createProduct);

// Ruta para obtener productos en un rango de precio
router.get('/price', getProductsByPriceRange);

// Ruta para eliminar un producto por ID
router.delete('/deleteAll', deleteAllProducts);
// Ruta para eliminar un producto por ID
router.delete('/:id', deleteProductById);


module.exports = router;
