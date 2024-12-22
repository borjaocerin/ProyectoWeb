const fs = require('fs');
const csv = require('csv-parser');
const esClient = require('./config/elasticsearchClient');

const filePath = './data/products.csv';

const loadProductsFromCSV = async () => {
    try {
        // Crear índice si no existe
        await createIndexIfNotExists();

        // Leer productos del CSV
        const products = await readProductsFromCSV();

        // Insertar productos no duplicados
        await insertUniqueProducts(products);
        
        console.log('Carga de productos completada.');
    } catch (error) {
        console.error('Error en la carga de productos:', error);
    }
};

// Función para leer productos desde el CSV y devolverlos en un array
const readProductsFromCSV = () => {
    return new Promise((resolve, reject) => {
        const products = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const price = parseFloat(data.price);
                if (data.name && data.category && data.consola && !isNaN(price)) {
                    products.push({
                        name: data.name,
                        price,
                        description: data.description || '',
                        category: data.category,
                        consola: data.consola,
                        imageUrl: data.imageUrl || ''
                    });
                }
            })
            .on('end', () => resolve(products))
            .on('error', reject);
    });
};

// Función para crear el índice "products" si no existe
const createIndexIfNotExists = async () => {
    const exists = await esClient.indices.exists({ index: 'products' });
    if (!exists.body) {
        await esClient.indices.create({
            index: 'products',
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        price: { type: 'float' },
                        description: { type: 'text' },
                        category: { type: 'keyword' },
                        consola: { type: 'keyword' },
                        imageUrl: { type: 'text' },
                    },
                },
            },
        });
        console.log("Índice 'products' creado exitosamente.");
    } else {
        console.log("El índice 'products' ya existe.");
    }
};

// Función para verificar y agregar productos únicos a Elasticsearch
const insertUniqueProducts = async (products) => {
    const bulkOperations = [];

    for (const product of products) {
        const exists = await checkIfProductExists(product.name);
        if (!exists) {
            bulkOperations.push(
                { index: { _index: 'products', _id: product.name } },
                product
            );
        } else {
            console.log(`Producto duplicado ignorado: ${product.name}`);
        }
    }

    if (bulkOperations.length > 0) {
        await processBulk(bulkOperations);
    }
};

// Verificar si un producto ya existe en el índice
const checkIfProductExists = async (name) => {
    try {
        const { body } = await esClient.search({
            index: 'products',
            body: { query: { match: { name: name } } },
        });
        return body.hits.total.value > 0;
    } catch (error) {
        console.error('Error buscando el producto por nombre:', error);
        return false;
    }
};

// Procesar las operaciones bulk
const processBulk = async (operations) => {
    const { body: bulkResponse } = await esClient.bulk({ refresh: true, body: operations });

    if (bulkResponse.errors) {
        const erroredDocuments = bulkResponse.items.filter(item => item.index && item.index.error);
        console.error('Errores al cargar documentos:', erroredDocuments.map(doc => doc.index.error));
    } else {
        console.log('Operaciones bulk procesadas exitosamente.');
    }
};

// Ejecutar la carga de productos
loadProductsFromCSV();
