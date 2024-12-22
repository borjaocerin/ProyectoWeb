// PaymentForm.js
import React, { useState } from 'react';
import './PaymentForm.css';
import { useAuth } from '../context/AuthContext'; 
import pedidosService from '../services/pedidosService';

const PaymentForm = ({ product, closeModal }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState(null);
    const { email } = useAuth();
    // Verificación del email
    React.useEffect(() => {
        console.log('Email desde AuthContext:', email);
    }, [email]);

    const handlePayment = async () => {
        // Validar los datos de la tarjeta
        if (!cardNumber || !expiryDate || !cvv) {
            setError('Por favor completa todos los campos.');
            return;
        }

        // Asegúrate de que el email no sea null o undefined
        if (!email) {
            setError('Error: no se encontró el email. Asegúrate de estar logueado.');
            return;
        }

        // Crear el objeto de compra
        const compraData = {
            email: email,
            id_producto: product.id, 
            fecha_pedido: new Date().toISOString(), // Fecha actual
            precio: parseFloat(product.price), // Asegúrate de que el precio es un número
        };

        console.log('Datos de compra:', compraData); // Imprime los datos a la consola

        try {
            const response = await pedidosService.createCompra(compraData);
            alert(`Pago realizado para el producto ${product.name}. Compra ID: ${response._id}`);
            closeModal(); // Cierra el modal después del pago
        } catch (error) {
            console.error('Error al crear la compra:', error);
            setError('Error al realizar el pago. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="payment-form">
            <h2>Pago de {product.name}</h2>
            <div className="input-group">
                <label htmlFor="cardNumber">Número de Tarjeta</label>
                <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="expiryDate">Fecha de Expiración</label>
                <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="cvv">CVV</label>
                <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                />
            </div>
            <button className="pay-button" onClick={handlePayment}>Pagar {product.price} €</button>
            {error && <p className="error">{error}</p>} {/* Muestra el error si hay */}
        </div>
    );
};

export default PaymentForm;
