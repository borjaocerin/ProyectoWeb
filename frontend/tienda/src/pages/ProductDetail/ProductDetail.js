import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import DetallesPago from '../DetallesPago/DetallesPago'; 
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                setError('Error fetching product details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="product-details-page"> {/* Clase contenedora única */}
            <h1 className="product-title">Detalles del Producto</h1>
            {product ? (
                <div className="product-content">
                    <div className="product-image-column">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                    </div>
                    <div className="product-info-column">
                        <h2 className="product-name">{product.name}</h2>
                        <p className="product-price">Precio: {product.price} €</p>
                        <p className="product-description">Descripción: {product.description}</p>
                        <button className="buy-button" onClick={openModal}>Comprar</button>
                    </div>
                </div>
            ) : (
                <p>Producto no encontrado.</p>
            )}

            {/* Modal de pago */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>X</button>
                        <DetallesPago product={product} closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
