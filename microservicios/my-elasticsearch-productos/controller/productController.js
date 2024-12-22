// controllers/productController.js
const esClient = require('../config/elasticsearchClient');




// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const { body } = await esClient.search({
            index: 'products',
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        // Incluyendo el ID del producto en la respuesta
        const products = body.hits.hits.map(hit => ({
            id: hit._id,  // Agrega el ID aquí
            ...hit._source // Mantiene el resto de los datos del producto
        }));
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: error.message });
    }
};



// Obtener un producto por ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const { body } = await esClient.get({
            index: 'products',
            id: id
        });

        // Add the id to the product data before sending it back
        const productWithId = {
            id: body._id, // Get the id from the response
            ...body._source // Spread the rest of the product data
        };

        res.json(productWithId); // Send the modified product object
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const { body } = await esClient.search({
            index: 'products',
            body: {
                query: {
                    match: {
                        category: category
                    }
                }
            }
        });
        const products = body.hits.hits.map(hit => hit._source);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener productos por consola
const getProductsByConsole = async (req, res) => {
    const { console } = req.params;
    try {
        const { body } = await esClient.search({
            index: 'products',
            body: {
                query: {
                    match: {
                        consola: console
                    }
                }
            }
        });
        const products = body.hits.hits.map(hit => hit._source);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener productos por nombre
const getProductsByName = async (req, res) => {
    const { name } = req.params;
    try {
        const { body } = await esClient.search({
            index: 'products',
            body: {
                query: {
                    match: {
                        name: {
                            query: name,
                            fuzziness: 'AUTO'
                        }
                    }
                }
            }
        });
        const products = body.hits.hits.map(hit => hit._source);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
    const product = req.body;
    try {
        await createIndexIfNotExists(); 
        const { body } = await esClient.index({
            index: 'products',
            body: product
        });
        res.status(201).json(body);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener productos por rango de precio
const getProductsByPriceRange = async (req, res) => {
    let { min, max } = req.query;

    // Convertir los parámetros a números
    min = parseFloat(min) || 0;
    max = parseFloat(max);

    // Validar max y reemplazar Infinity por un valor máximo seguro
    if (isNaN(max) || max === Infinity) {
        max = Number.MAX_SAFE_INTEGER;
    }

    try {
        const { body } = await esClient.search({
            index: 'products',
            body: {
                query: {
                    range: {
                        price: {
                            gte: min,
                            lte: max,
                        },
                    },
                },
            },
        });
        const products = body.hits.hits.map((hit) => hit._source);
        res.json(products);
    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


// Eliminar un producto por ID
const deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const { body } = await esClient.delete({
            index: 'products',
            id: id
        });
        res.json(body);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Eliminar todos los productos
const deleteAllProducts = async (req, res) => {
    try {
        const { body } = await esClient.deleteByQuery({
            index: 'products',
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        res.json({
            message: `Se eliminaron ${body.deleted} productos del índice 'products'.`,
            details: body
        });
    } catch (error) {
        console.error("Error al eliminar todos los productos:", error);
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsByConsole,
    getProductsByName,
    createProduct,
    getProductsByPriceRange,
    deleteProductById,
    deleteAllProducts
};
