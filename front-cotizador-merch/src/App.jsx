import { useState, useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'

import { AuthContext } from './context/AuthContext.jsx';
import LoginForm from './components/Login/LoginForm.jsx';
import Quotations from './components/QuotationsContainer/QuotationContainer.jsx';
import Button from './components/Utils/Button.jsx';


function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  useEffect(() => {
    console.log('App.jsx mounted')
  }, [])


  return (
    <>
      {isAuthenticated ?
        <>
          <Button text="Cerrar Sesión" onClick={logout} />
          <Quotations />
        </>
        : <LoginForm />
      }
    </>
  )
}

export default App;
