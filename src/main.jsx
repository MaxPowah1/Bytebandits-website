import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';            // ← our Tailwind + globals
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
