const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importar cors
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const app = express();
const PORT = 2000;
// Carga el archivo openapi.yaml
const openapiDocument = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

// Añade un endpoint para servir la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Middleware para permitir CORS
app.use(cors({
    origin: ['http://localhost:3000','http://frontend:3000'],// Permitir solicitudes desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permitir credenciales
}));

app.use(express.json()); // Middleware para procesar el JSON

// Enrutar solicitudes al microservicio de usuarios
// Endpoint de Logout en el Gateway
app.post('/api/users/logout', async (req, res) => {
    console.log('Solicitud de logout recibida');

    // Verifica si el token está en los encabezados
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó el token de autorización.' });
    }

    try {
        const response = await axios({
            method: 'POST',
            url: 'http://microservicio_usuarios:5000/logout', // URL del microservicio de logout
            headers: {
                'Authorization': authHeader, // Pasa el token JWT
            },
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error en el logout del microservicio de usuarios:', error.message);
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});
app.get('/api/users/auth0-login', (req, res) => {
    console.log('Solicitud de login con Auth0 recibida');
    
    // Redirigir al microservicio que maneja Auth0 
    res.redirect('http://microservicio_usuarios:5000/auth0-login'); 
});



app.use('/api/users', async (req, res) => {

    console.log('Solicitud recibida en el Gateway para usuarios:', req.method, req.originalUrl);
    console.log('Authorization Header en Gateway:', req.headers['Authorization']); // Debug
    
    try {
        const response = await axios({
            method: req.method,
            url: 'http://microservicio_usuarios:5000' + req.originalUrl.replace('/api/users', ''), // Ajustar la ruta
            data: req.body,
            headers: {
                'Authorization': req.headers['Authorization'] ? req.headers['Authorization'] : undefined,
            },
        });
        console.log('Respuesta del microservicio de usuarios:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error en el microservicio de usuarios:', error.response?.data.message || error.message);
        console.error('Detalles del error:', error.response); // Esto te dará más información
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Enrutar solicitudes al microservicio de productos
app.use('/api/products', async (req, res) => {
    console.log('Solicitud recibida en el Gateway para productos:', req.method, req.originalUrl);
    try {
        const response = await axios({
            method: req.method,
            url: 'http://microservicio_my-elasticsearch-productos:4000' + req.originalUrl, 
            data: req.body,
            headers: {
                'Authorization': req.headers['Authorization'] ? req.headers['Authorization'] : undefined,
            },
        });
        console.log('Respuesta del microservicio de productos:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error en el microservicio de productos:', error.message);
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});
// Enrutar solicitudes al microservicio de compras
app.use('/api/compras', async (req, res) => {

    //console.log('Solicitud recibida en el Gateway para compras:', req.method, req.originalUrl);
    console.log('Headers de solicitud:', req.headers);

    try {
        const response = await axios({
            method: req.method,
            url: 'http://microservicio_compras:1000' + req.originalUrl,
            data: req.body,
            headers: {
                'Authorization': req.headers['authorization'],
            },
        });
        //console.log('Respuesta del microservicio de compras:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error en el microservicio de compras:', error.response?.data.message || error.message);
        console.error('Detalles del error:', error.response); // Esto te dará más información
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`API Gateway escuchando en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
