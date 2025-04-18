import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';

import './App.css'

import { AuthContext } from './context/AuthContext.jsx';
import LoginForm from './components/Login/LoginForm.jsx';
import Quotations from './components/QuotationsContainer/QuotationContainer.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import NewQuotationContainer from "./components/NewQuotation/NewQuotationContainer"; // Componente NewQuotation



function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated ?
        <>
          <Navbar />          
          <Routes>
            <Route path="/" element={<Quotations />} /> {/* Página principal */}
            <Route path="/new-quotation" element={<NewQuotationContainer />} /> {/* Página de Nueva Cotización */}
          </Routes>

        </>
        : <LoginForm />
      }
    </>
  )
}

export default App;
