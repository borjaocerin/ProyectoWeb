import React from 'react';
import ReactDOM from 'react-dom/client'; // Solo necesitas esta importación en React 18
import './index.css';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <App />
</React.StrictMode>
);
