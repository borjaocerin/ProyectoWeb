import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import esFlag from '../images/spain.png';  
import enFlag from '../images/ingles.png';  
import eusFlag from '../images/euskera.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { i18n } = useTranslation(); 
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const { t } = useTranslation();
    

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        setLanguageMenuOpen(false); 
    };

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
                        <button className="logout-button" onClick={logout}>{t('logout')}</button>
                    </>
                ) : (
                    <Link className="login-button" to="/login">{t('login')}</Link>
                )}

                {/* Selector de idioma con banderas */}
                <div className="language-selector">
                    <button
                        className="language-selector-btn"
                        onClick={() => setLanguageMenuOpen(!languageMenuOpen)} 
                    >
                        <img 
                            src={i18n.language === 'es' ? esFlag : i18n.language === 'en' ? enFlag : eusFlag} 
                            alt="Idioma"
                            className="language-flag"
                        />
                    </button>
                    {languageMenuOpen && (
                        <div className="language-dropdown">
                            <div onClick={() => handleLanguageChange('es')} className="language-option">
                                <img src={esFlag} alt="Español" className="language-flag" /> Español
                            </div>
                            <div onClick={() => handleLanguageChange('en')} className="language-option">
                                <img src={enFlag} alt="English" className="language-flag" /> English
                            </div>
                            <div onClick={() => handleLanguageChange('eus')} className="language-option">
                                <img src={eusFlag} alt="Euskera" className="language-flag" /> Euskera
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
