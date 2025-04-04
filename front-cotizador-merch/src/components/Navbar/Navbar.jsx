import './Navbar.css';
import React, { use, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ParametersContext } from '../../context/ParametersContext.jsx'; // Asegúrate de importar el contexto
import TextButton from '../Utils/TextButton.jsx';


const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const { getDolarPrice, dolarPrice } = useContext(ParametersContext); // Aquí consumes el contexto

    return (
        <nav className="navbar-container sticky">
            <Link to="/">
                <h1>Quattrum</h1>
            </Link>
            <h4>Dolar hoy: {dolarPrice}</h4>
            <TextButton text="Cerrar Sesión" onClick={logout} />

        </nav>
    );
};

export default Navbar;