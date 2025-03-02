// app.js
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); 
const path = require('path');
const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
// Middleware para manejar JSON
app.use(express.json());

// Rutas para productos
app.use('/api/products', productRoutes);
// Cargar la documentación OpenAPI desde el archivo YAML
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Configurar Swagger UI en la ruta /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
