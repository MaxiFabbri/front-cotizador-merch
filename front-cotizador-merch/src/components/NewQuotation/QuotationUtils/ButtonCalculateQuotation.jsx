import { useContext, useState, useEffect } from "react";
import { QuotationContext } from "../../../context/QuotationContext.jsx";
import { ParametersContext } from "../../../context/ParametersContext.jsx";
import { apiClient } from "../../../config/axiosConfig.js";
import TextButton from "../../Utils/TextButton";

const ButtonCalculateQuotation = () => {
    const { quotationData, updateQuotationData, updateProcessInProduct } = useContext(QuotationContext);
    const { utilitiesTable } = useContext(ParametersContext);

    const saveCalculatedQuotation = async () => {
        console.log("Quotation to save: ", quotationData);
    }

    const calculateUnitSellingPrice = (totalProductCost) => {
        const targetUtility = utilitiesTable.find((utility) => totalProductCost < utility.upTo );
        console.log("Target Utility: ", targetUtility);
        // const unitSellingPrice = totalProductCost / quotationData.products.reduce((acc, product) => acc + product.quantity, 0);
        // return unitSellingPrice;
    };

    const handleCalculateQuotation = () => {
        console.log("Calculando cotización... ", quotationData);

        quotationData.products.map((product) => {
            console.log("Procesando producto: ", product);
            var totalProductCost = 0;
            product.processes = product.processes.map((process) => {
                console.log("Procesando proceso: ", process);
                // Aquí podrías realizar la lógica de procesamiento según el estado del proceso
                const newSubtotalProcessCost = ((+process.unitCost * +product.quantity) + +process.fixedCost);
                totalProductCost += newSubtotalProcessCost;               
                updateProcessInProduct({subTotalProcessCost: newSubtotalProcessCost})
                return {
                    ...process,
                    subTotalProcessCost: newSubtotalProcessCost,
                };
            });
            totalProductCost = +totalProductCost + +product.financingCost + +product.shipmentCost + +product.otherCost;
            console.log("Subtotal del producto: ", +totalProductCost);
            calculateUnitSellingPrice(totalProductCost);
            return product;
        });
        
        saveCalculatedQuotation();
    };

    return (
        <TextButton
            text="Calcular Cotización"
            onClick={handleCalculateQuotation}
        />
    );
}

export default ButtonCalculateQuotation;
