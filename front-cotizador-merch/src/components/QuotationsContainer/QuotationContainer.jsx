import React, { useState, useEffect } from 'react';
import { apiClient } from '../../config/axiosConfig.js';
import './QuotationContainer.css';
import Quotation from '../Quotation/Quotation.jsx';

const Quotations = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Función para realizar la solicitud GET
        const fetchQuotations = async () => {
            try {
                const response = await apiClient.get('/quotations/populated');
                setQuotations(response.data.response); // Asigna el array de la respuesta
                console.log('Quotations: ', response.data.response);
            } catch (error) {
                setError('Error al cargar las cotizaciones');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotations();
    }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

    // Renderizado
    if (loading) return <p>Cargando cotizaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Lista de Cotizaciones</h3>
            {quotations.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            {/* <th>Quotation ID</th> */}
                            <th>Fecha</th>
                            <th>Nombre del Cliente</th>
                            <th>Codigo</th>
                            <th>Estado</th>
                            <th>Forma de Pago</th>
                            <th>Moneda</th>
                            <th>¿Es kit?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations.map((quote) => (
                            <Quotation key={quote._id} quote={quote} />
                        ))}
                    </tbody>
                </table>

            ) : (
                <p>No se encontraron cotizaciones.</p>
            )}
        </div>
    );
};

export default Quotations;
