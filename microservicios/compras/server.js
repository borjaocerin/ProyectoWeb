const express = require('express');
const connectDB = require('./db/db'); // Importar la conexión a DB
const comprasRoutes = require('./routes/compraRoutes');
require('dotenv').config(); // Cargar las variables de entorno
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // Permite cargar archivos YAML fácilmente
const path = require('path');

const app = express();
// Cargar la documentación OpenAPI desde el archivo YAML
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
// Conectar a la base de datos
connectDB();

app.use(express.json());

// Usar las rutas de compras
app.use('/api/compras', comprasRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 1000; // 

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
