import { useState, useEffect, useContext } from "react";
import { ParametersContext } from '../../context/ParametersContext.jsx';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from "../../config/axiosConfig.js";

import DateField from "./InputComponents/DateField.jsx";
import CurrencySelect from "./InputComponents/CurrencySelect.jsx";
import ExchangeRateInput from "./InputComponents/ExchangeRateInput.jsx";
import QuoteStatusSelect from "./InputComponents/QuoteStatusSelect.jsx";
import IsKitCheckbox from "./InputComponents/IsKitCheckbox.jsx";
import MonthlyRateInput from "./InputComponents/MonthlyRateInput.jsx";
import UseQuotationForm from "./InputComponents/UseQuotationForm.jsx";
import UseCustomerPaymentMethod from "./InputComponents/UseCustomerPaymentMethod.jsx";

import SelectCustomer from "./Selectors/SelectCustomer.jsx";
import SelectCustomerPayMethod from "./Selectors/SelectCustomerPaymentMethod.jsx";

import TextButton from '../Utils/TextButton.jsx';
import IconButton from "../Utils/IconButton.jsx";

import NewProduct from "./QuotationElements/NewProduct.jsx";


const NewQuotation = () => {
    const { dolarPrice, paramMonthlyRate, getDolarPrice } = useContext(ParametersContext);
    const today = new Date().toISOString().split("T")[0];
    useEffect(() => { getDolarPrice() }, [getDolarPrice]);

    const initialFormState = {
        id: "",
        date: today,
        customerId: "",
        customerName: "",
        paymentMethodId: " ",
        paymentMethodName: " ",
        monthlyRate: paramMonthlyRate,
        currency: "Peso",
        exchangeRate: dolarPrice,
        quoteStatus: "Cotizado",
        quoteUnitSellingPrice: 0,
        quoteProductsDescription: " ",
        isKit: false,
    };

    const { formData, handleInputChange, setFormData } = UseQuotationForm(initialFormState);
    const [quotationCreated, setQuotationCreated] = useState(false);
    const [products, setProducts] = useState([]);
    const [tempRowId, setTempRowId] = useState(uuidv4());

    const { paymentMethodName, isLoading, error } = UseCustomerPaymentMethod(formData.paymentMethodId);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            paymentMethodName: paymentMethodName || ""
        }));
    }, [paymentMethodName, setFormData]);

    const handleCustomerUpdate = (customer) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            customerId: customer._id || "",
            customerName: customer.name || "",
            paymentMethodId: customer.customerPaymentMethodId || "",
        }));
    };

    const handleCustomerPaymentMethodUpdate = (customerPaymentMethod) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            paymentMethodId: customerPaymentMethod._id || "",
        }));
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

        try {
            const response = await apiClient.post("/quotations", dataToSubmit);
            const id = response.data.response._id;
            if (id) {
                setQuotationCreated(true);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    id: id,
                }));
            }
        } catch (error) {
            console.error("Error submitting quotation:", error);
        }
    };

    const handleAddProduct = () => {
        if (formData.id) {
            setProducts(prevProducts => [
                ...prevProducts,
                { quotationId: formData.id }
            ]);
        } else {
            console.warn("Quotation ID is not yet available.");
        }
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
                            <td><label htmlFor="exchangeRate">Cambio</label></td>
                            <td><label htmlFor="quoteStatus">Estado</label></td>
                            <td><label htmlFor="isKit">Kit</label></td>
                            <td><label htmlFor="quoteProductsDescription-display"></label>Descripción</td>
                            <td><label htmlFor="quoteUnitSellingPrice-display"></label>Precio Unitario Consolidado</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={tempRowId} >
                            <DateField value={formData.date} onChange={handleInputChange} />
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
                            <MonthlyRateInput value={formData.monthlyRate} onChange={handleInputChange} />
                            <CurrencySelect value={formData.currency} onChange={handleInputChange} />
                            <ExchangeRateInput value={formData.exchangeRate} onChange={handleInputChange} />
                            <QuoteStatusSelect value={formData.quoteStatus} onChange={handleInputChange} />
                            <IsKitCheckbox checked={formData.isKit} onChange={handleInputChange} />
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
                                        onClick={handleSubmit}
                                    />
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <>
                {quotationCreated && (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Quote Id</th>
                                    <th>Cantidad</th>
                                    <th>Dias Producción</th>
                                    <th>Costo Financiero</th>
                                    <th>Costo de Fletes</th>
                                    <th>Otros Costos</th>
                                    <th>Precio Unitario</th>
                                    <th>Descripción</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                < NewProduct quotationId={formData.id} />

                            </tbody>
                        </table>
                        {/* <TextButton
                        text="Agregar Producto"
                        onClick={handleAddProduct}
                        /> */}
                    </div>
                )}
            </>
        </div>
    );
};

export default NewQuotation;