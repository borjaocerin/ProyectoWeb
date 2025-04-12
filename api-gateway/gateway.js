const express = require('express');
const axios = require('axios');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 2000;

// Cargar certificados SSL
const sslOptions = {
    key: fs.readFileSync(path.join('/app', 'privkey.pem')),
    cert: fs.readFileSync(path.join('/app', 'fullchain.pem')),
  };
// 📘 Cargar OpenAPI
const openapiDocument = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://frontend:3000',
        'http://frontborjaocerin.s3-website-us-east-1.amazonaws.com',
        'https://d2ewsbyoiyhkjo.cloudfront.net',
        'https://dtk38116n0747.cloudfront.net',
        'https://frontborjaocerin.s3-website-us-east-1.amazonaws.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

// Logout
app.post('/api/users/logout', async (req, res) => {
    console.log('Solicitud de logout recibida');

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó el token de autorización.' });
    }

    try {
        const response = await axios.post('http://microservicio_usuarios:5000/logout', {}, {
            headers: { 'Authorization': authHeader },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error en logout:', error.message);
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Auth0 login redirect
app.get('/api/users/auth0-login', (req, res) => {
    console.log('Solicitud de login con Auth0 recibida');
    res.redirect('http://13.36.88.67:5000/auth0-login');
});

// Usuarios
app.use('/api/users', async (req, res) => {
    console.log('Solicitud usuarios:', req.method, req.originalUrl);
    try {
        const response = await axios({
            method: req.method,
            url: 'http://microservicio_usuarios:5000' + req.originalUrl.replace('/api/users', ''),
            data: req.body,
            headers: {
                'Authorization': req.headers['Authorization'] || undefined,
            },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error usuarios:', error.message);
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Productos
app.use('/api/products', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: 'http://microservicio_my-elasticsearch-productos:4000' + req.originalUrl,
            data: req.body,
            headers: {
                'Authorization': req.headers['Authorization'] || undefined,
            },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error productos:', error.message);
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// Compras
app.use('/api/compras', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: 'http://microservicio_compras:1000' + req.originalUrl,
            data: req.body,
            headers: {
                'Authorization': req.headers['authorization'],
            },
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error compras:', error.message);
        res.status(error.response?.status || 500).json({ message: error.message });
    }
});

// 🔒 Iniciar servidor HTTPS
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔐 API Gateway HTTPS escuchando en https://localhost:${PORT}`);
    console.log(`📚 Documentación disponible en https://localhost:${PORT}/api-docs`);
});
