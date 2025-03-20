import './Navbar.css'
import React, { useContext } from 'react';
import { NavLink, Link } from "react-router-dom"
import { AuthProvider, AuthContext } from '../../context/AuthContext.jsx';
import LoginForm from '../Login/LoginForm.jsx';


const ProtectedContent = () => {
    return <h1>¡Bienvenido! Has iniciado sesión.</h1>;
};

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    
    return (
        // <AuthProvider>
            <nav className="navbar-container sticky">
                <div>
                    {isAuthenticated ? (
                        <>
                            < ProtectedContent />
                            <button onClick={logout}>Cerrar sesión</button>
                        </>
                    ) : (
                        <LoginForm />
                    )}
                </div>
            
                <div className="Categories">
                    <h1>Navbar</h1>
                </div>
            </nav>
        // </AuthProvider>
    )
}

export default Navbar