import { useState, useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';

import './App.css'

import { AuthContext } from './context/AuthContext.jsx';
import LoginForm from './components/Login/LoginForm.jsx';
import Quotations from './components/QuotationsContainer/QuotationContainer.jsx';
import Button from './components/Utils/Button.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import NewQuotation from "./components/NewQuotation/NewQuotation"; // Componente NewQuotation



function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  // useEffect(() => {
  //   console.log('App.jsx mounted')
  // }, [])


  return (
    <>
      {isAuthenticated ?
        <>
          <Navbar />          
          <Routes>
            <Route path="/" element={<Quotations />} /> {/* Página principal */}
            <Route path="/new-quotation" element={<NewQuotation />} /> {/* Página de Nueva Cotización */}
          </Routes>

        </>
        : <LoginForm />
      }
    </>
  )
}

export default App;
