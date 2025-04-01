import { useState, useEffect, useContext, useRef } from "react";
import { apiClient } from "../../config/axiosConfig";
import NewProduct from "./NewProduct"; // Asegúrate de importar tu componente NewProduct
import { ParametersContext } from '../../context/ParametersContext.jsx';
import SelectCustomer from "./Selectors/SelectCustomer.jsx"; // Asegúrate de importar tu componente SelectCustomer
import SelectCustomerPayMethod from "./Selectors/SelectCustomerPaymentMethod.jsx"; // Asegúrate de importar tu componente SelectCustomerPaymentMethod


const NewQuotation = () => {
    const { dolarPrice } = useContext(ParametersContext);
    const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const { paramMonthlyRate } = useContext(ParametersContext); // Extraer monthlyRate del contexto

    const [formData, setFormData] = useState({
        id: "", // El ID se inicializa con un uno
        date: today, // La fecha se inicializa vacía
        customerId: "",
        customerName: "", // Nuevo campo para almacenar el nombre del cliente
        paymentMethodId: "",
        paymentMethodName: "", // Nuevo campo para almacenar el nombre del método de pago
        monthlyRate: paramMonthlyRate, // El monthlyRate se inicializa con el valor del context
        currency: "Peso", // Valor por defecto
        exchangeRate: dolarPrice,
        quoteStatus: "Cotizado", // Valor por defecto
        quoteUnitSellingPrice: 0, // Valor por defecto
        quoteProductsDescription: " ", // Valor por defecto
        isKit: false
    });

    // const [defaultPayment, serDefaultPayment] = useState("")
    const [products, setProducts] = useState([]); // Estado para los productos agregados
    const [processes, setProcesses] = useState([]); // Estado para los procesos agregados

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log("Input changed: ", name, value);
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
        console.log("New Form Data after Input Change: ", formData)
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
            "exchangeRate": formData.exchangeRate,
            "quoteStatus": formData.quoteStatus,
            "quoteProductsDescription": formData.quoteProductsDescription,
            "quoteUnitSellingPrice": formData.quoteUnitSellingPrice,
            "isKit": formData.isKit
        };
        console.log("Quotation data to submit: ", dataToSubmit);
        try {
            const response = await apiClient.post("/quotations", dataToSubmit);
            setFormData((prevFormData) => ({
                ...prevFormData,
                id: response.data.response._id,
            }));
        } catch (error) {
            console.error("Error submitting quotation:", error);
        }
    };

    const fetchCustomersPayMethodById = async (id) => {
        try {
            const response = await apiClient.get(`customer-payment-methods/${id}`);
            return response.data.response.customer_payment_description;
        } catch (error) {
            console.error("Error al buscar clientes:", error);
            // setFormData.paymentMethodName("ERROR"); // Restablece a vacío en caso de error
        }
    };

    const handleCustomerUpdate = async (customer) => {
        const customerPayMethodName = await fetchCustomersPayMethodById(customer.customerPaymentMethodId);
        setFormData((prevFormData) => ({
            ...prevFormData,
            customerId: customer._id || "",
            customerName: customer.name || "",
            paymentMethodId: customer.customerPaymentMethodId || "",
            paymentMethodName: customerPayMethodName || "",
        }));
    };

    const handleCustomerPaymentMethodUpdate = (customerPaymentMethod) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            paymentMethodId: customerPaymentMethod._id || "",
            paymentMethodName: customerPaymentMethod.customer_payment_description || "",
        }));
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <td></td>
                            <td><label htmlFor="date">Fecha</label></td>
                            <td><label htmlFor="customer">Cliente</label></td>
                            <td><label htmlFor="paymentMethodId">Forma de pago</label></td>
                            <td><label htmlFor="monthlyRate">Tasa de Interes</label></td>
                            <td><label htmlFor="currency">Moneda</label></td>
                            <td><label htmlFor="exchangeRate">Cambio</label></td>
                            <td><label htmlFor="quoteStatus">Estado</label></td>
                            <td><label htmlFor="isKit">Kit</label></td>
                            <td><label htmlFor="quoteProductsDescription-display"></label>Descripción</td>
                            <td><label htmlFor="quoteUnitSellingPrice-display"></label>Precio Unitario Consolidado</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id={formData.id} >
                            <td>
                                <button>
                                    <img src="/delete.png" alt="delete" width="20" height="20" />
                                </button>
                            </td>
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
                                <SelectCustomer onSelectCustomer={handleCustomerUpdate} />
                            </td>
                            <td>
                                <SelectCustomerPayMethod
                                    defaultPayment={formData.paymentMethodName}
                                    onSelectCustomerPayMethod={handleCustomerPaymentMethodUpdate} />
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
                                    {/* <option value="Euro">Euro</option> */}
                                    <option value="Peso">Peso</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="exchangeRate"
                                    name="exchangeRate"
                                    value={formData.exchangeRate}
                                    onChange={handleInputChange}
                                    required
                                />
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
                            <td>
                                <span id="quoteProductsDescription-display">{formData.quoteProductsDescription}</span>
                            </td>
                            <td>
                                <span id="quoteUnitSellingPrice-display">{formData.quoteUnitSellingPrice}</span>
                            </td>
                            {/* <td>
                                <button type="submit">Crear Cotización</button>
                            </td> */}
                            <td>
                                <button type="submit">
                                    <img src="/create.png" alt="Submit" width="20" height="20" />
                                </button>
                            </td>
                            <td>
                                <button>
                                    <img src="/edit.png" alt="edit" width="20" height="20" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {/* <div>
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
            </div> */}
        </div>

    );
};

export default NewQuotation;
