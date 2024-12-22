const mongoose = require('mongoose');
require('dotenv').config(); // Cargar las variables de entorno

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a MongoDB establecida');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1); // Salir del proceso si hay un error
    }
};

module.exports = connectDB;
