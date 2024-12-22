import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';  // Ya tienes el AuthProvider aquí para manejar el login y el estado del usuario.
import Navbar from './components/Navbar';
import Products from './pages/Products/Products';
import Pedidos from './pages/Pedidos/Pedidos';
import AuthCallback from './pages/callback/callback'
import Login from './pages/Login/Login';
import ProductDetail from './pages/ProductDetail/ProductDetail'; // Importa el componente de detalles del producto
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => (
    <Router>
        <AuthProvider>  {/* AuthProvider sigue siendo necesario para manejar el estado de autenticación */}
            <Navbar />
            <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products/:id" element={<ProductDetail />} /> {/* Nueva ruta para los detalles del producto */}
                <Route path="/auth/callback" element={<AuthCallback />} /> {/* Ruta para el callback de Auth0 */}
            </Routes>
        </AuthProvider>
    </Router>
);

export default App;
