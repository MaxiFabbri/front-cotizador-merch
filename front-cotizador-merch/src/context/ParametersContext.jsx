import { createContext, useState, useEffect } from 'react';
import { apiClient, apiDolar } from '../config/axiosConfig.js';

// Creación del contexto
export const ParametersContext = createContext();

// Proveedor del contexto
export const ParametersProvider = ({ children }) => {
    // Estados separados para los datos
    const [monthlyRate, setMonthlyRate] = useState(null);
    const [tax, setTax] = useState(null);
    const [utilitiesTable, setUtilitiesTable] = useState([]);
    const [dolarPrice, setDolarPrice] = useState(1000);

    // Función para obtener parámetros generales
    const getGeneralParameters = async () => {
        try {
            // Actualizo el precio de dolar
            getDolarPrice();
            // Realizar la solicitud GET
            const response = await apiClient.get('general-parameters');

            // Desestructurar datos de la respuesta y actualizarlos en los estados
            const { monthlyRate, tax, utilitiesTable, dolar } = response.data.response[0];

            setMonthlyRate(monthlyRate);
            setTax(tax);
            setUtilitiesTable(utilitiesTable);
            setDolarPrice(dolar);
        } catch (error) {
            console.error('Hubo un error al intentar recuperar los datos Generales:', error);
            alert('Error al conectar con el servidor');
        }
    };

    // Función para obtener el precio del dólar
    const getDolarPrice = async () => {
        try {
            const response = await apiDolar.get();
            const newDolar = response.data.venta
            // Actualizar el estado con el precio del dólar
            if(newDolar !== dolarPrice){
                setDolarPrice(newDolar);
                updateDolarPrice(newDolar);
            }; 
        } catch (error) {
            console.error('Hubo un error al intentar recuperar los datos del dólar:', error);
            alert('Error al conectar con el servidor');
        }
    };
    // funcion para actualizar el dolar en la base de datos
    const updateDolarPrice = async (newDolar) => {
        try {
            // Actualizar el estado con el precio del dólar
            console.log('actualizando dolar: ', newDolar);
            setDolarPrice(newDolar);
            const updatedDolar = await apiClient.put('general-parameters/67ddd1f2ef05d862858798c3', { dolar: newDolar });
        } catch (error) {
            console.error('Hubo un error al intentar recuperar los datos del dólar:', error);
            alert('Error al conectar con el servidor');
        }
    }
    // useEffect para actualizar los datos al montar el componente
    useEffect(() => {
        getGeneralParameters();
    }, []);

    // Exponer estados y funciones en el contexto
    return (
        <ParametersContext.Provider
            value={{
                monthlyRate,
                tax,
                utilitiesTable,
                dolarPrice,
                getGeneralParameters,
                getDolarPrice,
            }}
        >
            {children}
        </ParametersContext.Provider>
    );
};