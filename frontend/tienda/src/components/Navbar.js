import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/products">
                    <span className="navbar-title">Gaming Store</span>
                </Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <Link to="/pedidos">
                            <i className="fas fa-shopping-cart"></i>
                        </Link>

                        {user}
                        <button className="logout-button" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link className="login-button" to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
