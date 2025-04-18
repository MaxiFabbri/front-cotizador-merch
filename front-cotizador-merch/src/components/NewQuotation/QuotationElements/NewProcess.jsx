import { useState, useEffect, useContext } from "react";
import { QuotationContext } from "../../../context/QuotationContext";
import SelectSupplier from "../Selectors/SelectSupplier";
import SelectSupplierPayMethod from "../Selectors/SelectSupplierPaymentMethod.jsx";
import { apiClient } from "../../../config/axiosConfig";

import IconButton from "../../Utils/IconButton";

const NewProcess = ({ initialProcessData }) => {
    const { updateProcessInProduct, removeProcessInProduct, quotationData } = useContext(QuotationContext);

    const [processData, setProcessData] = useState(initialProcessData);

    // Estado para manejo de debouncing
    const [debouncedProcessData, setDebouncedProcessData] = useState(processData);
    // Actualizar el estado global al cambiar `debouncedProdData`
    useEffect(() => {
        updateProcessInProduct(debouncedProcessData);
    }, [debouncedProcessData]);
    // Debounce: Actualizar `debouncedProdData` después de un retraso
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedProcessData(processData);
        }, 300);
        return () => {
            clearTimeout(handler); // Limpiar el temporizador previo
        };
    }, [processData]);

    const getPaymentMethodData = async (paymentId) => {
        try {
            const response = await apiClient.get(`/supplier-payment-methods/${paymentId}`);
            const paymentMethod = response.data.response;
            return paymentMethod;
        } catch (error) {
            console.error("Error fetching customer payment method:", error);
        }
    };

    // Manejo de cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("temp")) {
            const convertedValue = value / quotationData.exchangeRate;
            const newName = name.replace("temp", "");
            setProcessData((prevData) => ({
                ...prevData,
                [newName]: convertedValue,
            }))
        }
        
        setProcessData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };


    const handleSupplierUpdate = async (supplier) => {
        const paymentMethodData = await getPaymentMethodData(supplier.supplierPaymentMethodId);
        const updatedData = {
            ...processData,
            productId: processData.productId,
            processId: processData.processId,
            supplierId: supplier._id || "",
            supplierName: supplier.name || "",
            supplierPaymentMethodId: paymentMethodData._id || "",
            supplierPaymentMethodName: paymentMethodData.supplier_payment_description || "",
            daysToPayment: paymentMethodData.days_to_payment || 0,
        }
        setProcessData(updatedData);
    }

    const handleSupplierPaymentMethodUpdate = async (supplierPaymentMethod) => {
        console.log("Supplier Payment Method en handle supplier payment method update: ", supplierPaymentMethod);
        const updatedData = {
            ...processData,            
            supplierPaymentMethodId: supplierPaymentMethod._id || "",
            supplierPaymentMethodName: supplierPaymentMethod.supplier_payment_description || "",
            daysToPayment: supplierPaymentMethod.days_to_payment || 0,
        }

        setProcessData(updatedData);
        updateProcessInProduct(updatedData)
    }

    const handleDeleteProcess = async (e) => {
        e.preventDefault();
        removeProcessInProduct(processData.productId, processData.processId);
    };

    return (
        <>
            <td>
                <IconButton
                    icon="/delete.png"
                    text="Eliminar Producto"
                    onClick={handleDeleteProcess}
                />
            </td>
            <td>
                <span>
                    {processData.processId}
                </span>
            </td>
            <td>
                <input
                    type="text"
                    name="description"
                    value={processData.description}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <SelectSupplier
                    defaultSupplier={processData.supplierName || ""}
                    onSelectSupplier={handleSupplierUpdate}
                />
            </td>
            <td>
                <SelectSupplierPayMethod
                    defaultSupplierPay={processData.supplierPaymentMethodName || ""}
                    onSelectSupplierPayMethod={handleSupplierPaymentMethodUpdate}
                />
            </td>
            <td>
                <span>
                    {processData.daysToPayment}
                </span>
            </td>
            <td>
                <input
                    type="number"
                    name="tempunitCost"
                    value={processData.tempunitCost}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="tempfixedCost"
                    value={processData.tempfixedCost}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <span>
                    {processData.subTotalProcessCost}
                </span>
            </td>
        </>
    )
};

export default NewProcess;