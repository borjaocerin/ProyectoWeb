import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]); // Productos filtrados
    const [categories, setCategories] = useState([]); // Todas las categorías, cargadas al inicio
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConsole, setSelectedConsole] = useState('All Consoles');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Cargar todas las categorías al inicio
    const fetchCategories = async () => {
        const data = await productService.getAllProducts(); // Asume que devuelve todos los productos
        const uniqueCategories = Array.from(new Set(data.map(product => product.category)));
        setCategories(uniqueCategories);
    };

    // Filtrar productos llamando al backend
    const fetchFilteredProducts = async () => {
        let data = await productService.getAllProducts(); // Inicializamos un arreglo vacío para almacenar los productos filtrados
    
        // Filtrar por nombre (si hay un término de búsqueda)
        if (searchTerm) {
            const filteredByName = await productService.getProductsByName(searchTerm);
            data = filteredByName;
        }
    
        // Filtrar por consola (si se seleccionó una consola específica)
        if (selectedConsole !== 'All Consoles') {
            const filteredByConsole = await productService.getProductsByConsole(selectedConsole);
            // Si ya hay datos, realizamos una intersección de productos, sino simplemente cargamos los productos filtrados por consola
            data = data.length ? data.filter(product =>
                filteredByConsole.some(filteredProduct => filteredProduct.name === product.name)
            ) : filteredByConsole;
        }
    
        // Filtrar por categoría (si se seleccionó una categoría específica)
        if (selectedCategory !== 'All Categories') {
            const filteredByCategory = await productService.getProductsByCategory(selectedCategory);
            // Realizamos la intersección con los productos obtenidos hasta el momento
            data = data.length ? data.filter(product =>
                filteredByCategory.some(filteredProduct => filteredProduct.name === product.name)
            ) : filteredByCategory;
        }
    
        // Filtrar por precio (si se ha establecido un rango de precio)
        if (minPrice || maxPrice) {
            const parsedMinPrice = parseFloat(minPrice) || 0;
            const parsedMaxPrice = parseFloat(maxPrice) || Infinity;
            const filteredByPrice = await productService.getProductsByPriceRange(parsedMinPrice , parsedMaxPrice);
            // Intersección de los productos filtrados por precio
            data = data.length ? data.filter(product =>
                filteredByPrice.some(filteredProduct => filteredProduct.name === product.name)
            ) : filteredByPrice;
        }
    
        // Actualizamos el estado con los productos filtrados
        setProducts(data);
    };
    
    

    // Llamada inicial para cargar categorías
    useEffect(() => {
        fetchCategories();
    }, []);

    // Llamada al backend cuando cambian los filtros
    useEffect(() => {
        fetchFilteredProducts();
    }, [searchTerm, selectedConsole, selectedCategory, minPrice, maxPrice]);

    return (
        <div className="products-page">
            <aside className="filters-panel">
                <input
                    type="text"
                    placeholder="Search games..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <label>Console</label>
                <select
                    className="filter-select"
                    value={selectedConsole}
                    onChange={(e) => setSelectedConsole(e.target.value)}
                >
                    <option>All Consoles</option>
                    <option>PS</option>
                    <option>Switch</option>
                    <option>Xbox</option>
                    <option>PC</option>
                </select>

                <label>Category</label>
                <select
                    className="filter-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option>All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <label>Price Range</label>
                <div className="price-range">
                    <input
                        type="number"
                        placeholder="Min"
                        className="price-input"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="price-input"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </aside>

            <div className="products-list">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default Products;
