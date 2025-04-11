import { useState, useEffect, useContext } from "react";
import { QuotationContext } from "../../../context/QuotationContext";

import IconButton from "../../Utils/IconButton";

const NewProcess = ({ initialProcessData }) => {
    const { updateProcessInProduct, removeProcessInProduct } = useContext(QuotationContext);

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
        }, 1000);
        return () => {
            clearTimeout(handler); // Limpiar el temporizador previo
        };
    }, [processData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProcessData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

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
                <input
                    type="text"
                    name="supplierName"
                    value={processData.supplierName}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="supplierPaymentMethodName"
                    value={processData.supplierPaymentMethodName}
                    onChange={handleInputChange}
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
                    name="unitCost"
                    value={processData.unitCost}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="fixedCost"
                    value={processData.fixedCost}
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