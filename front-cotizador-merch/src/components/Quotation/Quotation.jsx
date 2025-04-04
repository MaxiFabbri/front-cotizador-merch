import React from "react";
import IconButton from "../Utils/IconButton.jsx";

const Quotation = ({ quote, onDelete }) => {
    return (
        <tr id={quote._id}>
            <td>
                <IconButton
                    icon="/delete.png"
                    text="Eliminar"
                    onClick={() => onDelete(quote._id)} // Llama a la función pasada como prop
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

