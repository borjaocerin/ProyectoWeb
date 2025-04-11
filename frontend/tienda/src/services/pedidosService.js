import axios from 'axios';

// Configuración de axios para el servicio de compras
const api = axios.create({
    baseURL: 'https://13.36.88.67:2000/api/compras' // Cambiar el puerto a 1000
});

// Obtener todas las compras
const getAllCompras = async () => {
    const response = await api.get('/');
    return response.data;
};

// Obtener una compra por ID
const getCompraById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

// Crear un nuevo pedido (compra)
const createCompra = async (compraData) => {
    console.log('Datos enviados a la API:', compraData); // Imprimir los datos enviados
    const response = await api.post('/', compraData);
    console.log('Respuesta de la API:', response.data); // Imprimir la respuesta de la API
    return response.data;
};


// Eliminar un pedido por ID
const deleteCompraById = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};


const getComprasByUsuarioEmail = async (email) => {
    const token = localStorage.getItem('token'); // Obtiene el token almacenado en localStorage
    
    // Imprimir los headers antes de enviar la solicitud
    const headers = {
        'Authorization': `Bearer ${token}`, // El token que se enviará en los headers
        'Content-Type': 'application/json'  // El tipo de contenido que estás enviando
    };
    console.log('Headers de solicitud:', headers); // Imprime los headers de la solicitud

    const response = await api.get(`/usuario/${email}`, { headers });

    // Retorna la respuesta
    return response.data;
};
export default {
    getAllCompras,
    getCompraById,
    createCompra,
    deleteCompraById,
    getComprasByUsuarioEmail,
};
