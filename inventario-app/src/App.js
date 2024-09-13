// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Profesores from './Profesores';
import RequestSummary from './RequestSummary';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/request-summary/:id" element={<RequestSummary />} /> {/* Ruta para mostrar el resumen */}
                <Route path="/login" element={<Login />} />
                <Route path="/profesores" element={<Profesores />} />
            </Routes>
        </Router>
    );
};

export default App;
