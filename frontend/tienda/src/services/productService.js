import axios from 'axios';

// Configuración de axios
const api = axios.create({
    baseURL: 'https://api.borjapfg.link:2000/api/products'
});

const getAllProducts = async () => {
    const response = await api.get('/');
    return response.data;
};

const getProductsByCategory = async (category) => {
    const response = await api.get(`/category/${category}`);
    return response.data;
};
const getProductsByConsole = async (consoleName) => {
    const response = await api.get(`/console/${consoleName}`);
    return response.data;
};
const getProductsByName = async (name) => {
    const response = await api.get(`/name/${name}`);
    return response.data;
};

const getProductsByPriceRange = async (minPrice, maxPrice) => {
    const response = await api.get(`/price`, {
        params: {
            min: minPrice,
            max: maxPrice
        }
    });
    return response.data;
};

const getProductById = async (id) => {
    const response = await api.get(`/id/${id}`);
    return response.data;
};
export default {
  getAllProducts,
  getProductsByCategory,
  getProductsByName,
  getProductsByPriceRange,
  getProductsByConsole,
  getProductById,
};
