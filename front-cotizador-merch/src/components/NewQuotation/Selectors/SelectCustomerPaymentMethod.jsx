import { useState, useRef, useEffect } from "react";
import { apiClient } from "../../../config/axiosConfig";

const SelectCustomerPayMethod = ({ defaultPayment, onSelectCustomerPayMethod }) => {
    const [customerPayMethodSuggestions, setCustomerPayMethodSuggestions] = useState([]);
    const [searchValue, setSearchValue] = useState(defaultPayment); // Inicializa con el valor por defecto
    const debounceFetch = useRef(null);

    // Sincroniza el valor del input con el valor por defecto cuando este cambie
    useEffect(() => {
        setSearchValue(defaultPayment || ""); // Asegura que no sea undefined
    }, [defaultPayment]);

    // Función para buscar métodos de pago por nombre
    const fetchCustomersPayMethodByName = async (name) => {
        if (!name.trim()) {
            setCustomerPayMethodSuggestions([]);
            return;
        }
        try {
            const response = await apiClient.post("customer-payment-methods/name", { name });
            const data = Array.isArray(response.data.response) ? response.data.response : [];
            setCustomerPayMethodSuggestions(data); // Actualiza las sugerencias
        } catch (error) {
            console.error("Error al buscar métodos de pago:", error);
            setCustomerPayMethodSuggestions([]);
        }
    };

    // Maneja los cambios en el input de búsqueda con debounce
    const handleSearchChange = (e) => {
        const name = e.target.value;
        setSearchValue(name); // Actualiza el estado local del input
        if (debounceFetch.current) {
            clearTimeout(debounceFetch.current);
        }
        debounceFetch.current = setTimeout(() => {
            fetchCustomersPayMethodByName(name); // Realiza la búsqueda después de 300ms
        }, 300);
    };

    // Maneja la selección de un método de pago
    const handleCustomerPayMethodSelect = (customerPayMethod) => {
        setSearchValue(customerPayMethod.description); // Muestra el método seleccionado en el input
        setCustomerPayMethodSuggestions([]); // Limpia las sugerencias
        onSelectCustomerPayMethod(customerPayMethod); // Notifica al padre sobre la selección
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar Condición de venta"
                value={searchValue} // Controla el valor del input
                onChange={handleSearchChange} // Detecta cambios en el input
            />
            <ul>
                {customerPayMethodSuggestions.map((customerPayMethod) => (
                    <li
                        key={customerPayMethod._id}
                        onClick={() => handleCustomerPayMethodSelect(customerPayMethod)} // Selecciona el método
                    >
                        {customerPayMethod.customer_payment_description} {/* Muestra descripción */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectCustomerPayMethod;
