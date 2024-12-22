// ProductCard.js
import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const handleImageClick = () => {
        navigate(`/products/${product.id}`);
    };

    return (
        <div className="product-card">
            <img
                src={product.imageUrl}
                alt={product.name}
                onClick={handleImageClick}
                className="product-image"
            />
            <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <div className="product-console">{product.console}</div>
            </div>
            <div className="product-tag">{product.category}</div>
        </div>
    );
};

export default ProductCard;
