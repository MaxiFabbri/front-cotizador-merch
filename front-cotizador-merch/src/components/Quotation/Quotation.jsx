import React, { useState, useEffect } from "react";
import IconButton from "../Utils/IconButton.jsx";
import { useNavigate } from "react-router-dom"; // Asegúrate de tener React Router instalado
import { apiClient } from "../../config/axiosConfig.js";

const Quotation = ({ quote, onDelete }) => {
    const navigate = useNavigate(); // Hook para la navegación
    const [isProductsLoaded, setIsProductsLoaded] = useState(false); 
    const [products, setProducts] = useState([]); // Estado para los productos

    // Función para obtener productos
    const getProducts = async (quoteId) => {
        try {
            const response = await apiClient.get(`/products/${quoteId}`);
            setProducts(response.data.response); // Actualiza los productos
            setIsProductsLoaded(true); // Cambia el estado a true una vez cargados
        } catch (error) {
            console.error("Error obteniendo productos:", error);
        }
    };

    // Ejecutar `getProducts()` cuando el componente se monta
    useEffect(() => {
        getProducts(quote._id);
    }, [])

    // Manejo de clic en la fila
    const handleRowClick = () => {
        navigate(`/detailed-quotation/${quote._id}`);
    };

    return (
        <tr id={quote._id} onClick={handleRowClick} style={{ cursor: "pointer" }}>
            <td>
                <IconButton
                    icon="/delete.png"
                    text="Eliminar"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(quote._id);
                    }}
                />
            </td>
            <td>{new Date(quote.date).toLocaleDateString()}</td>
            <td>{quote.customerId.name}</td>
            <td>{quote.currency}</td>
            <td>{quote.isKit ? "Sí" : "No"}</td>    

            {/* Mostrar Loading hasta que los productos estén cargados */}
            <td colSpan="3">
                {!isProductsLoaded ? (
                    <p>Loading...</p>
                ) : (
                    <table>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.quantity}</td>
                                    <td>{product.productDescription || "Prod"}</td>
                                    <td>$ {(product.unitSellingPrice * quote.exchangeRate).toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </td>

            <td>{quote.quoteStatus}</td>
        </tr>
    );
};

export default Quotation;