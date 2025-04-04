import { useState, useEffect, useContext, useRef } from "react";
import { apiClient } from "../../../config/axiosConfig.js";
import NewProduct from "./NewProduct";
import { ParametersContext } from '../../../context/ParametersContext.jsx';
import SelectCustomer from "../Selectors/SelectCustomer.jsx";
import SelectCustomerPayMethod from "../Selectors/SelectCustomerPaymentMethod.jsx";
import TextButton from '../../Utils/TextButton.jsx';
import IconButton from "../../Utils/IconButton.jsx";


const NewQuotation = () => {
    const { dolarPrice, paramMonthlyRate, getDolarPrice } = useContext(ParametersContext); // Extraer dolarPrice del contexto
    const today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    useEffect(() => { getDolarPrice()},[NewQuotation])

    const [formData, setFormData] = useState({
        id: "", // El ID se inicializa con un uno
        date: today, // La fecha se inicializa vacía
        customerId: "",
        customerName: "", // Nuevo campo para almacenar el nombre del cliente
        paymentMethodId: " ",
        paymentMethodName: " ", // Nuevo campo para almacenar el nombre del método de pago
        monthlyRate: paramMonthlyRate, // El monthlyRate se inicializa con el valor del context
        currency: "Peso", // Valor por defecto
        exchangeRate: dolarPrice,
        quoteStatus: "Cotizado", // Valor por defecto
        quoteUnitSellingPrice: 0, // Valor por defecto
        quoteProductsDescription: " ", // Valor por defecto
        isKit: false
    });

    const [quotationCreated, setQuotationCreated] = useState(false); // Estado para saber si se creó la cotización
    // const [products, setProducts] = useState([]); // Estado para los productos agregados

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log("Input changed: ", name, value);
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
        console.log("New Form Data after Input Change: ", formData)
    };

    const fetchCustomersPayMethodById = async (id) => {
        try {
            const response = await apiClient.get(`customer-payment-methods/${id}`);
            return response.data.response.customer_payment_description;
        } catch (error) {
            console.error("Error al buscar forma de pago:", error);
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
        console.log("Form Data después de setFormData: ", formData);
    }

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
            const id = response.data.response._id;
            if (id) {
                setQuotationCreated(true);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    id: id,
                }));
            }
        } catch (error) {
            console.error("Error submitting quotation:", error);
        }
    };

    const [products, setProducts] = useState([]);

    const handleAddProduct = (quotationId) => {
        console.log('Añadir producto con el quotation ID:', quotationId);
        setProducts((prevProducts) => [
            ...prevProducts,
            { quotationId } 
        ]);

    };

    // const handleRemoveProduct = (index) => {
    //     setProducts(products.filter((_, i) => i !== index)); // Elimina un producto
    // };


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
                            <td><label htmlFor="exchangeRate">Cambio</label></td>
                            <td><label htmlFor="quoteStatus">Estado</label></td>
                            <td><label htmlFor="isKit">Kit</label></td>
                            <td><label htmlFor="quoteProductsDescription-display"></label>Descripción</td>
                            <td><label htmlFor="quoteUnitSellingPrice-display"></label>Precio Unitario Consolidado</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={formData.id} >
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
                                <SelectCustomer
                                defaultCustomer={formData.customerName || ""} 
                                onSelectCustomer={handleCustomerUpdate} />
                            </td>
                            <td>
                                <SelectCustomerPayMethod
                                    defaultPayment={formData.paymentMethodName || ""}
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
                            <td>
                                {!quotationCreated && (
                                    <IconButton
                                    icon="/create.png"
                                    text="Crear Cotizacion"
                                    onClick={() => handleSubmit}
                                    />
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <div>
                {quotationCreated && (
                    <TextButton 
                    text="Agregar Producto" 
                    // onClick={handleAddProduct(formData.id)}
                    onClick={() => handleAddProduct(formData.id)}
                    />
                )}
            </div>
        </div>

    );
};

export default NewQuotation;