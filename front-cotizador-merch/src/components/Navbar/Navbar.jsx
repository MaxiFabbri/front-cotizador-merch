import './Navbar.css';
import React, { use, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ParametersContext } from '../../context/ParametersContext.jsx'; // Asegúrate de importar el contexto
import Button from '../Utils/Button.jsx';


const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const { getGeneralParameters, getDolarPrice, dolarPrice } = useContext(ParametersContext); // Aquí consumes el contexto
    useEffect(() => {  
        getDolarPrice();
    }, []);

    return (
        <nav className="navbar-container sticky">
            <div>
                <h1>Navbar</h1>
            </div>
            <h3>Dolar: {dolarPrice}</h3>
            <Link to="/new-quotation">
                <Button text="Nueva Cotización" />
            </Link>
            {/* <Button text="General Parameters" onClick={getGeneralParameters} /> */}
            {/* <Button text="Dolar Price" onClick={getDolarPrice} /> */}
            <Button text="Cerrar Sesión" onClick={logout} />

        </nav>
    );
};

export default Navbar;