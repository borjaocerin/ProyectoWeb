// DetallesPago.js
import React from 'react';
import PaymentForm from '../../components/PaymentForm'; 
import './DetallesPago.css';

const DetallesPago = ({ product, closeModal }) => {
    return (
        <div>
            <h2>Detalles de Pago para {product.name}</h2>
            
            {/* Pasa el producto al formulario de pago */}
            <PaymentForm product={product} closeModal={closeModal} />
        </div>
    );
};

export default DetallesPago;
