import React, { useEffect, useState } from 'react';
import comprasService from '../../services/pedidosService'; // Importa el servicio de pedidos
import productService from '../../services/productService'; // Importa el servicio de productos
import { useAuth } from '../../context/AuthContext';
import "./Pedidos.css"
import { useTranslation } from 'react-i18next';
const Pedidos = () => {
    const [orders, setOrders] = useState([]);
    const { user, email } = useAuth(); // Obtén el usuario logueado y el email
    const { t } = useTranslation();
    // Función para obtener el historial de pedidos
    const fetchOrderHistory = async () => {
        if (!user) return; // Si no hay usuario, no hacer la petición

        try {
            // Obtiene las compras por el email de usuario
            const orderList = await comprasService.getComprasByUsuarioEmail(email);
            
            // Obtén detalles del producto para cada pedido
            const ordersWithProductDetails = await Promise.all(orderList.map(async (order) => {
                try {
                    const productDetails = await productService.getProductById(order.id_producto); // Llama a la API para obtener detalles del producto
                    return { ...order, productDetails }; // Combina el pedido original con los detalles del producto
                } catch (error) {
                    console.error(`Error fetching details for product ID ${order.id_producto}:`, error);
                    return { ...order, productDetails: null }; // Si hay un error, asigna null a los detalles del producto
                }
            }));
            
            setOrders(ordersWithProductDetails); // Guarda los pedidos con los detalles de producto en el estado
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, [user]); // Ejecuta cuando cambia el usuario

    return (
        <div className="pedidos-container">
            <div className="pedidos-title">{t('yourPurchases')}</div>
            {orders.length === 0 ? (
                <p>{t('noPedidos')}</p>
            ) : (
                <ul className="pedidos-list">
                    {orders.map(order => (
                        <li key={order._id} className="pedido-item">
                            {order.productDetails ? (
                                <>
                                    <img src={order.productDetails.imageUrl} alt={order.productDetails.name} className="pedido-image" />
                                    <div className="pedido-details">
                                        <div className="pedido-name">{order.productDetails.name}</div>
                                        <div className="pedido-date">{new Date(order.fecha_pedido).toLocaleDateString()}</div>
                                        <div className="pedido-price">€{order.productDetails.price}</div>
                                    </div>
                                </>
                            ) : (
                                <p>{t('errorPedidos')}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
};

export default Pedidos;
