import { useContext, useState, useEffect } from "react";
import { QuotationContext } from "../../../context/QuotationContext.jsx";
import { ParametersContext } from "../../../context/ParametersContext.jsx";
import { apiClient } from "../../../config/axiosConfig.js";
import TextButton from "../../Utils/TextButton";

const ButtonCalculateQuotation = () => {
    const { quotationData, updateQuotationData, updateProduct, updateProcessInProduct } = useContext(QuotationContext);
    const { utilitiesTable, tax } = useContext(ParametersContext);

    const saveCalculatedQuotation = async () => {
        console.log("Quotation to save: ", quotationData);

    }

    const calculateUnitSellingPrice = (totalProductCost, quantity) => {
        const targetUtility = utilitiesTable.find((utility) => totalProductCost < utility.upTo);
        console.log("Total cost: ", totalProductCost, " Quantity: ", quantity);
        console.log("Target Utility: ", targetUtility);

        let minUtilitie = targetUtility.productMinimun;
        let percentageUtilitie = targetUtility.productUtilitie / 100;

        // Defino si es kit o no
        if (quotationData.isKit) {
            // Si es kit, la utilidad es por producto
            console.log("Es un kit");
            minUtilitie = targetUtility.kitMinimun;
            percentageUtilitie = targetUtility.kitUtilitie;
        }
        console.log("Minima: ", minUtilitie, " Porcentaje: ", percentageUtilitie);

        // calculo utilidad por porjentaje
        let newTotalProductCost = parseFloat(totalProductCost / (1 - (percentageUtilitie + tax))).toFixed(2);
        console.log("Costo total por porcentaje: ", newTotalProductCost);
        if (newTotalProductCost * percentageUtilitie < minUtilitie) {
            // si el costo total por porcentaje es menor al minimo, lo cambio por el minimo
            console.log("El costo total por porcentaje es menor al minimo, lo cambio por el minimo");
            console.log("Utilidad por porcentaje: ", newTotalProductCost * percentageUtilitie, " vs Costo total por minimo: ", minUtilitie);
            newTotalProductCost = parseFloat((totalProductCost + minUtilitie) / (1 - tax)).toFixed(2);
        }

        // paso el costo total a costo unitario
        const unitSellingPrice = parseFloat(newTotalProductCost / quantity).toFixed(2);
        return unitSellingPrice;
    };

    const handleCalculateQuotation = () => {
        console.log("Calculando cotización... ", quotationData);

        quotationData.products.map((product) => {
            console.log("Procesando producto: ", product);
            var totalProductCost = 0;
            product.processes = product.processes.map((process) => {
                console.log("Procesando proceso: ", process);
                // Calculo el subtotal del proceso
                // const newSubtotalProcessCost = (process.unitCost * product.quantity) + process.fixedCost;
                const newSubtotalProcessCost = +((process.unitCost * product.quantity) + process.fixedCost).toFixed(2);
                totalProductCost += +newSubtotalProcessCost;
                console.log("Subtotal del proceso: ", newSubtotalProcessCost);
                // Actualizo el subtotal del proceso en el context         
                updateProcessInProduct({ subTotalProcessCost: newSubtotalProcessCost })
                return {
                    ...process,
                    subTotalProcessCost: newSubtotalProcessCost,
                };
            });
            // Levanto los datos del producto del context
            totalProductCost =
                +(
                    +totalProductCost +
                    +product.financingCost +
                    +product.shipmentCost +
                    +product.otherCost
                ).toFixed(2);
            console.log("Subtotal del producto: ", +totalProductCost);
            const unitSellingPrice = calculateUnitSellingPrice(totalProductCost, product.quantity);
            console.log("Precio de venta unitario: ", unitSellingPrice);
            const pesosPrice = parseFloat((unitSellingPrice * quotationData.exchangeRate).toFixed(0));
            console.log("Precio Unitario de Venta en Pesos: ", pesosPrice);
            updateProduct({
                productId: product.productId,
                unitSellingPrice: unitSellingPrice,
                pesosPrice: pesosPrice
            });
        });
        // Guardo la cotización calculada en la DB
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
