// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Navbar from './components/Navbar';
import './index.css';

<Navbar/>
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
