import React from "react";
import IconButton from "../Utils/IconButton.jsx";
import { useNavigate } from "react-router-dom"; // Asegúrate de tener React Router instalado

const Quotation = ({ quote, onDelete }) => {
    const navigate = useNavigate(); // Hook para la navegación
    

    const handleRowClick = () => {
        navigate(`/detailed-quotation/${quote._id}`); // Cambia a la nueva página con el ID de la cotización
    };

    return (
        <tr id={quote._id} onClick={handleRowClick} style={{ cursor: "pointer" }}>
            <td>
                <IconButton
                    icon="/delete.png"
                    text="Eliminar"
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que el evento `onClick` de la fila se active
                        onDelete(quote._id); 
                    }}
                />
            </td>
            <td>{new Date(quote.date).toLocaleDateString()}</td>
            <td>{quote.customerId.name}</td>
            <td>{quote.quoteProductsDescription}</td>
            <td>$ {quote.quoteUnitSellingPrice}</td>
            <td>{quote.quoteStatus}</td>
            <td>{quote.currency}</td>
            <td>{quote.exchangeRate}</td>
            <td>{quote.isKit ? "Sí" : "No"}</td>
        </tr>
    );
};

export default Quotation;

