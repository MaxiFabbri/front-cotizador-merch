import { useContext, useEffect, useState } from "react";
import NewQuotation from "./NewQuotation"; // Asegúrate de importar tu componente NewQuotation
import NewProduct from "./QuotationElements/NewProduct";
import { ParametersContext } from '../../context/ParametersContext.jsx';
import { QuotationContext } from "../../context/QuotationContext";

import ButtonAddProduct from "./Selectors/QuotationUtils/ButtonAddProduct";

import { apiClient } from "../../config/axiosConfig.js";


const NewQuotationContainer = () => {
    const { dolarPrice, paramMonthlyRate } = useContext(ParametersContext);
    const { quotationData, clearQuotationData, updateQuotationData } = useContext(QuotationContext);
    const today = new Date().toISOString().split("T")[0];


    useEffect(() => {
        clearQuotationData()
        updateQuotationData({
            id: '',
            date: today,
            monthlyRate: paramMonthlyRate,
            exchangeRate: dolarPrice,
        });
    }, []);

    console.log("Quotation Data en NewQuotationContainer: ", quotationData);

    return (
        <>
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
                    <NewQuotation />
                </tbody>
            </table>
            <>
                {quotationData.products && quotationData.products.length > 0 ? (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Quote Id</th>
                                    <th>Cantidad</th>
                                    <th>Descripción</th>
                                    <th>Días Producción</th>
                                    <th>Costo Financiero</th>
                                    <th>Costo de Fletes</th>
                                    <th>Otros Costos</th>
                                    <th>Precio Unitario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotationData.products.map((product, index) => (
                                    <tr key={product.productId} id={product.productId}>
                                        <NewProduct 
                                        productData={product} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <ButtonAddProduct />
                        </div>
                    </div>             
                ) : (
                <div>
                    {quotationData.id !== '' ? (
                        <ButtonAddProduct />
                    ) : (
                        <p>Complete la Cotización</p>
                    )}
                </div>
                )}
            </>
        </>
    );
};

export default NewQuotationContainer;
