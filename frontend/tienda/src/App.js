import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext'; // Manejo del login y el estado del usuario
import Navbar from './components/Navbar';
import Products from './pages/Products/Products';
import Pedidos from './pages/Pedidos/Pedidos';
import AuthCallback from './pages/callback/callback';
import Login from './pages/Login/Login';
import ProductDetail from './pages/ProductDetail/ProductDetail'; // Detalles del producto
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event); // Guarda el evento para activarlo más tarde
            setIsInstallable(true); // Habilita el botón de instalación
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (installPrompt) {
            installPrompt.prompt(); // Activa el prompt de instalación
            installPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('PWA instalada');
                } else {
                    console.log('PWA no instalada');
                }
                setInstallPrompt(null); // Limpia el evento después de usarlo
            });
        }
    };

    return (
        <Router>
            <AuthProvider>
                <Navbar />
                {isInstallable && (
                    <button onClick={handleInstallClick} className="pwa-install-button">
                        Descargar Aplicación
                    </button>
                )}
                <Routes>
                    <Route path="/products" element={<Products />} />
                    <Route path="/pedidos" element={<Pedidos />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
