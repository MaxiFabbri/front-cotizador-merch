import { useState, useEffect } from "react";
import "./QuotationContainer.css";
import { apiClient } from "../../config/axiosConfig.js";
import { Link } from "react-router-dom";
import TextButton from "../Utils/TextButton.jsx";
import Quotation from "../Quotation/Quotation.jsx";

const Quotations = () => {
    const [quotations, setQuotations] = useState([]); // Estado para las cotizaciones
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updated, setUpdated] = useState(true);

    useEffect(() => {
        // Función para realizar la solicitud GET
        const fetchQuotations = async () => {
            setUpdated(true);
            try {
                const response = await apiClient.get("/quotations/populated");
                setQuotations(response.data.response); // Asigna el array de la respuesta
                console.log("")
            } catch (error) {
                setError("Error al cargar las cotizaciones");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotations();
    }, [updated, loading]);

    // Funcion para abrir la cotización detallada
    const handleClick = (e) =>{
        console.log("Click en Cotización: ",e)
    }

    // Función para eliminar una cotización
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta cotización?")) {
            setUpdated(false);
            try {
                await apiClient.delete(`/quotations/${id}`);
            } catch (error) {
                console.error("Error al eliminar la cotización:", error);
            }
        }
    };

    // Renderizado condicional
    if (loading) return <p>Cargando cotizaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="quotations-header">
                <h3>Lista de Cotizaciones</h3>
                <Link to="/new-quotation">
                    <TextButton text="Nueva Cotización" />
                </Link>
            </div>
            {quotations.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Mpneda</th>
                            <th>Kit</th>
                            <th>Cantidad</th>
                            <th>Producto</th>
                            <th>Precio Unitario</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations.map((quote) => (
                            <Quotation
                                key={quote._id}
                                quote={quote}
                                onDelete={handleDelete} // Pasa la función al componente hijo
                                onClick={handleClick}
                            />
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

