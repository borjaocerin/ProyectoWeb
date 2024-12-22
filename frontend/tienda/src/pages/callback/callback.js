import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Intentar obtener los parámetros de la URL o del localStorage si no están presentes
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token') || localStorage.getItem('token');
    const username = params.get('username') || localStorage.getItem('username');
    const email = params.get('email') || localStorage.getItem('email');

    console.log("URL actual:", window.location.search);
    console.log('Access Token:', accessToken);
    console.log('Username:', username);
    console.log('Email:', email);

    if (accessToken && username && email) {
      // Guardar los datos en localStorage si aún no están guardados
      localStorage.setItem('token', accessToken);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);

      // Redirigir a la página de productos
      navigate('/products', { replace: true });
    } else {
      // Redirigir a una página de error si faltan datos
      navigate('/error', { replace: true });
    }
  }, [navigate]);

  return (
    <div>
      <h2>Procesando tu sesión...</h2>
    </div>
  );
};

export default AuthCallback;
