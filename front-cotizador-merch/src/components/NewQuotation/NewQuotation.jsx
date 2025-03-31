import { useState, useEffect, useContext, useRef } from "react";
import { apiClient } from "../../config/axiosConfig";
import NewProduct from "./NewProduct"; // Asegúrate de importar tu componente NewProduct
import { ParametersContext } from '../../context/ParametersContext.jsx';
import SelectCustomer from "./SelectCustomer"; // Asegúrate de importar tu componente SelectCustomer

const NewQuotation = () => {
    const { monthlyRate } = useContext(ParametersContext); // Extraer monthlyRate del contexto
    const [formData, setFormData] = useState({
        id: "", // El ID se inicializa vacío
        date: "", // La fecha se inicializa vacía
        customerId: "",
        customerName: "", // Nuevo campo para almacenar el nombre del cliente
        paymentMethodId: "",
        pamentMethodName: "", // Nuevo campo para almacenar el nombre del método de pago
        monthlyRate: "", // El monthlyRate se inicializa vacío
        currency: "Peso", // Valor por defecto
        quoteStatus: "Cotizado", // Valor por defecto
        isKit: false
    });

    const [products, setProducts] = useState([]); // Estado para los productos agregados
    const [processes, setProcesses] = useState([]); // Estado para los procesos agregados

    useEffect(() => {
        // Inicializar fecha del día y monthlyRate desde el contexto
        const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
        setFormData((prevFormData) => ({
            ...prevFormData,
            date: today,
            monthlyRate: monthlyRate // Asigna monthlyRate desde el contexto
        }));
    }, []); // Ejecuta el efecto cuando monthlyRate cambia

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleAddProduct = () => {
        setProducts([...products, {}]); // Agrega un nuevo producto vacío
    };

    const handleRemoveProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index)); // Elimina un producto
    };

    const handleProductChange = (index, newProductData) => {
        const updatedProducts = products.map((product, i) =>
            i === index ? newProductData : product
        );
        setProducts(updatedProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = {
            "date": formData.date,
            "customerId": formData.customerId,
            "paymentMethodId": formData.paymentMethodId,
            "monthlyRate": formData.monthlyRate,
            "currency": formData.currency,
            "quoteStatus": formData.quoteStatus,
            "isKit": formData.isKit
        };
        console.log("Quotation data to submit: ", dataToSubmit);
        try {
            const response = await apiClient.post("/api/quotations", dataToSubmit);
            console.log("Quotation submitted:", response.data);
        } catch (error) {
            console.error("Error submitting quotation:", error);
        }
    };

    const handleCustomerSelect = (customer) => {
        setFormData({
            ...formData,
            customerId: customer._id,
            customerName: customer.name,
            paymentMethodId: customer.paymentMethodId,
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <td><label htmlFor="date">Fecha</label></td>
                            <td><label htmlFor="customer">Cliente</label></td>
                            <td><label htmlFor="paymentMethodId">Forma de pago</label></td>
                            <td><label htmlFor="monthlyRate">Tasa de Interes</label></td>
                            <td><label htmlFor="currency">Moneda</label></td>
                            <td><label htmlFor="quoteStatus">Estado</label></td>
                            <td><label htmlFor="isKit">Kit</label></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </td>
                            <td>
                                {/* Usa el componente SelectCustomer */}
                                <SelectCustomer onSelectCustomer={handleCustomerSelect} />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    id="paymentMethodId"
                                    name="paymentMethodId"
                                    value={formData.paymentMethodId}
                                    onChange={handleInputChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="monthlyRate"
                                    name="monthlyRate"
                                    value={formData.monthlyRate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </td>
                            <td>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Dolar">Dolar</option>
                                    <option value="Euro">Euro</option>
                                    <option value="Peso">Peso</option>
                                </select>
                            </td>
                            <td>
                                <select
                                    id="quoteStatus"
                                    name="quoteStatus"
                                    value={formData.quoteStatus}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Cotizado">Cotizado</option>
                                    <option value="Enviada">Enviada</option>
                                    <option value="Aceptada">Aceptada</option>
                                    <option value="Rechazada">Rechazada</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    id="isKit"
                                    name="isKit"
                                    checked={formData.isKit}
                                    onChange={handleInputChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit">Guardar Cotización</button>
            </form>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Product Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>
                                    <NewProduct
                                        data={product}
                                        onChange={(newProductData) =>
                                            handleProductChange(index, newProductData)
                                        }
                                    />
                                </td>
                                <td>
                                    <button type="button" onClick={() => handleRemoveProduct(index)}>
                                        Remove Product
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="2">
                                <button type="button" onClick={handleAddProduct}>
                                    Add New Product
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default NewQuotation;
