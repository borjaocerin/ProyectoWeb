import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor de contexto de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para el usuario
    const navigate = useNavigate(); // Hook para navegar
    const [email, setEmail] = useState(null); // Estado para el usuario
    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:2000/api/users/login', { email, password });
            const { access_token, username } = response.data; // Asegúrate de que este campo esté bien
            localStorage.setItem('token', access_token);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email); 
            setUser(username);
            setEmail(email); // Guarda el nombre de usuario en el estado
            navigate('/products');
        } catch (error) {
             // Manejo de errores
            if (error.response) {
                console.error('Error en login:', error.response.data);
                alert('Error en login');
            } else if (error.request) {
                console.error('Error en la solicitud:', error.request);
                alert('Error en la solicitud. Por favor intenta de nuevo.');
            } else {
                console.error('Error:', error.message);
                alert('Ocurrió un error inesperado. Por favor intenta de nuevo.');
            }
        }
    };

    // Función para registrarse
    const register = async (username, email, password) => {
        try {
            const response = await axios.post('http://localhost:2000/api/users/register', { username, email, password });
            console.log('Usuario registrado:', response.data);
            alert('Usuario registrado');
        } catch (error) {
            // Manejo de errores
            if (error.response) {
                console.error('Error al registrarse:', error.response.data);
                alert( 'Error al registrarse');
            } else if (error.request) {
                console.error('Error en la solicitud:', error.request);
                alert('Error en la solicitud. Por favor intenta de nuevo.');
            } else {
                console.error('Error:', error.message);
                alert('Ocurrió un error inesperado. Por favor intenta de nuevo.');
            }
        }
    };
    // Función para login con Auth0
    const loginWithAuth0 = async () => {
        window.location.href = 'http://localhost:2000/api/users/auth0-login';
    };
   

        // Función para cerrar sesión
    const logout = async () => {
        try {
            const token = localStorage.getItem('token')?.trim(); // Elimina espacios
            const authHeader = `Bearer ${token}`; // Crea el encabezado de autorización
            

            // Asegúrate de que el token no esté vacío
            if (!token) {
                console.error("No se encontró un token válido.");
                alert("No se pudo cerrar sesión. No se encontró un token válido.");
                return;
            }

            // Envía una solicitud POST al servidor para cerrar sesión
            await axios.post(
                'http://localhost:2000/api/users/logout',
                {},
                { headers: { Authorization: authHeader } } // Envía el token en los encabezados
             );

             // Si la solicitud es exitosa, elimina el token de localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            setUser(null); 
            setEmail(null);
            navigate('/products'); // Redirige a la página de inicio o a donde desees
        } catch (error) {
            console.error('Error al cerrar sesión:', error.response?.data.message || error.message);
            alert('No se pudo cerrar sesión. Intenta de nuevo.');
        }
    };



    
    
    
    // Verifica si hay un token al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username'); // Obtén el nombre de usuario de localStorage
        const storedEmail = localStorage.getItem('email');
        if (token) {
            setUser(username); // Establece el nombre de usuario en el estado
            setEmail(storedEmail)
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, email, login, logout, register ,loginWithAuth0}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
    }
    return context;
};
