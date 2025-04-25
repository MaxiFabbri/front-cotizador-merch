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
        // preparo la informacion de Quotation para guardar en la DB

        const quotationId = quotationData.id;
        const quotationToSave = {
            date: quotationData.date,
            customerId: quotationData.customerId,
            paymentMethodId: quotationData.paymentMethodId,
            monthlyRate: quotationData.monthlyRate,
            currency: quotationData.currency,
            exchangeRate: quotationData.exchangeRate,
            quoteStatus: quotationData.quoteStatus,
            quoteProductsDescription: quotationData.quoteProductsDescription,
            isKit: quotationData.isKit,
        }
        // Actualizo en la DB la información de Quotation
        try {
            const responseQuote = await apiClient.put(`/quotations/${quotationId}`, quotationToSave);
            console.log("Cotización guardada: ", responseQuote.data); 
        } catch (error) {
            console.error("Error al guardar la cotización: ", error);
        }
        
        // Paso por todos los productos
        
        quotationData.products.map( async (product) => {
            console.log("Guardando producto: ", product);
            let newProductId = product.productId;
            // preparo la informacion de Product para guardar en la DB
            const productToSave = {
                quotationId: quotationId,
                quantity: product.quantity,
                productionDays: product.productionDays,
                financingCost: product.financingCost,
                shipmentCost: product.shipmentCost,
                otherCost: product.otherCost,
                productDescription: product.productDescription,
                savedToDb: product.savedToDb,
            }

            // guardo en la DB la información de Product
            try {
                console.log("ver producto: ", product);
                if (product.savedToDb) {
                    // Si el producto ya está guardado, lo actualizo
                    const responseProduct = await apiClient.put(`/products/${product.productId}`, productToSave);
                    console.log("Producto Actualizado: ", responseProduct.data);
                } else {
                    // Si el producto no está guardado, lo guardo
                    const responseProduct = await apiClient.post('/products/', productToSave);
                    console.log("Producto guardado: ", responseProduct.data);
                    newProductId = responseProduct.data.response._id;
                    // Actualizo el ID del producto en el context
                    updateProduct({
                        productId: newProductId,
                        savedToDb: true,
                    }, product.productId);
                } 
            } catch (error) {
                console.error("Error al guardar el producto: ", error);    
            }
            product.processes.map( async (process) => {
                // preparo la informacion de Process para guardar en la DB con el ID del producto
                const processToSave = {
                    productId: newProductId,
                    description: process.description,
                    suppllierId: process.supplierId,
                    daysToPayment: process.daysToPayment,
                    unitCost: process.unitCost,
                    fixedCost: process.fixedCost,
                    subTotalProcessCost: process.subTotalProcessCost,
                }
                // guardo en la DB la información de Process
                console.log("Guardando proceso: ", processToSave);
                try {
                    if (process.savedToDb) {
                        // Si el proceso ya está guardado, lo actualizo
                        const responseProcess = await apiClient.put(`/processes/${process.processId}`, processToSave);
                    } else {
                        // Si el proceso no está guardado, lo guardo
                        const responseProcess = await apiClient.post('/processes/', processToSave);
                        console.log("Proceso guardado: ", responseProcess.data);
                        // Actualizo el ID del proceso y el ID de Producto en el context
                        updateProcessInProduct({
                            processId: responseProcess.data.response._id,
                            productId: newProductId,
                            savedToDb: true,
                        }, process.processId);
                    }
                } catch (error) {
                        console.error("Error al guardar el proceso: ", error);
                }
            });  
        });
    }

    const calculateUnitSellingPrice = (totalProductCost, quantity) => {
        const targetUtility = utilitiesTable.find((utility) => totalProductCost < utility.upTo);
        // console.log("Total cost: ", totalProductCost, " Quantity: ", quantity);
        // console.log("Target Utility: ", targetUtility);

        let minUtilitie = targetUtility.productMinimun;
        let percentageUtilitie = targetUtility.productUtilitie / 100;

        // Defino si es kit o no
        if (quotationData.isKit) {
            // Si es kit, la utilidad es por producto
            console.log("Es un kit");
            minUtilitie = targetUtility.kitMinimun;
            percentageUtilitie = targetUtility.kitUtilitie;
        }
        // console.log("Minima: ", minUtilitie, " Porcentaje: ", percentageUtilitie);

        // calculo utilidad por porjentaje
        let newTotalProductCost = parseFloat(totalProductCost / (1 - (percentageUtilitie + tax))).toFixed(2);
        // console.log("Costo total por porcentaje: ", newTotalProductCost);
        if (newTotalProductCost * percentageUtilitie < minUtilitie) {
            // si el costo total por porcentaje es menor al minimo, lo cambio por el minimo
            console.log("El costo total por porcentaje es menor al minimo, lo cambio por el minimo");
            console.log("Utilidad por porcentaje: ", newTotalProductCost * percentageUtilitie, " vs Costo total por minimo: ", minUtilitie);
            newTotalProductCost = parseFloat((totalProductCost + minUtilitie) / (1 - tax)).toFixed(2);
        }

        // paso el costo total a costo unitario
        const unitSellingPrice = parseFloat(newTotalProductCost / quantity).toFixed(4);
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
                const newSubtotalProcessCost = +((process.unitCost * product.quantity) + process.fixedCost).toFixed(2);
                totalProductCost += +newSubtotalProcessCost;
                // console.log("Subtotal del proceso: ", newSubtotalProcessCost);
                // Actualizo el subtotal del proceso en el context         
                updateProcessInProduct({ subTotalProcessCost: newSubtotalProcessCost }, process.processId);
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
            // console.log("Subtotal del producto: ", +totalProductCost);
            const unitSellingPrice = calculateUnitSellingPrice(totalProductCost, product.quantity);
            const pesosPrice = parseFloat((unitSellingPrice * quotationData.exchangeRate).toFixed(0));
            updateProduct({
                productId: product.productId,
                unitSellingPrice: unitSellingPrice,
                pesosPrice: pesosPrice
            }, product.productId);
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
