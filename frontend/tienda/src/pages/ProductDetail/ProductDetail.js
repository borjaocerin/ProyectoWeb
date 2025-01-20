import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import pedidosService from '../../services/pedidosService';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from '../../context/AuthContext'; // Para obtener el email del usuario
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { email } = useAuth(); // Obtener email del usuario logueado

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

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    const initialOptions = {
        "client-id": "AaAGMq3F-TI42jJXBNp_d2G1NrhImgz1CUSdFWdSwy39Xrje8DdlEAIe-abf5w2z_9RO1IdO0oajRIZl",
        currency: "EUR",
    };

    const handleRegistroCompra = async () => {
        if (!email) {
            alert("Error: no se encontró el email del usuario. Asegúrate de estar logueado.");
            return;
        }

        const compraData = {
            email: email,
            id_producto: product.id,
            fecha_pedido: new Date().toISOString(),
            precio: parseFloat(product.price),
        };

        try {
            const response = await pedidosService.createCompra(compraData);
            alert(`Pago registrado correctamente para el producto ${product.name}. Compra ID: ${response._id}`);
        } catch (err) {
            console.error("Error al registrar la compra:", err);
            alert("Hubo un error al registrar la compra. Por favor, inténtalo nuevamente.");
        }
    };

    return (
        <div className="product-details-page">
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

                        {/* Botón de PayPal */}
                        <PayPalScriptProvider options={initialOptions}>
                            <PayPalButtons
                                style={{
                                    shape: "rect",
                                    layout: "vertical",
                                    color: "gold",
                                    label: "paypal",
                                }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: product.price.toString(), 
                                                },
                                            },
                                        ],
                                    });
                                }}
                                onApprove={async (data, actions) => {
                                    try {
                                        const details = await actions.order.capture();
                                        alert(`Pago completado con éxito por ${details.payer.name.given_name}!`);
                                        console.log("Detalles de la transacción:", details);

                                        // Registrar la compra después del pago
                                        await handleRegistroCompra();
                                    } catch (err) {
                                        console.error("Error al capturar la transacción:", err);
                                        alert("Hubo un error al procesar el pago. Por favor, inténtalo nuevamente.");
                                    }
                                }}
                                onError={(err) => {
                                    console.error("Error en la transacción:", err);
                                    alert("Hubo un error al procesar el pago. Por favor, inténtalo nuevamente.");
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                </div>
            ) : (
                <p>Producto no encontrado.</p>
            )}
        </div>
    );
};

export default ProductDetail;
