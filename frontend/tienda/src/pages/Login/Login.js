// src/pages/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar useAuth
import './Login.css'; 

const Login = () => {
    const { login, register, loginWithAuth0 } = useAuth(); // Desestructurar loginWithAuth0
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (isLogin) {
            try {
                await login(email, password);
            } catch (error) {
                setErrorMessage("Error al iniciar sesión: " + error.message);
              
            }
        } else {
            if (password !== confirmPassword) {
                setErrorMessage("Las contraseñas no coinciden");
                return;
            }
            try {
                await register(username, email, password);
                
            } catch (error) {
                setErrorMessage("Error al registrarse: " + error.message);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    
                    <button type="submit" className="login-button">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
             
                {isLogin && (
                <button onClick={loginWithAuth0} className="login-button">
                    Login with Auth0
                </button>
                  )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <p className="toggle-auth">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
