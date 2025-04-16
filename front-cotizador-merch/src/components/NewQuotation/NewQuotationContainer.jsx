import { useContext, useEffect, useState } from "react";
import { QuotationHeader, ProductHeader, ProcessHeader } from "./QuotationUtils/NewQuotationHeaders.jsx";
import NewQuotation from "./NewQuotation"; // Asegúrate de importar tu componente NewQuotation
import NewProduct from "./QuotationElements/NewProduct";
import NewProcess from "./QuotationElements/NewProcess";
import { ParametersContext } from '../../context/ParametersContext.jsx';
import { QuotationContext } from "../../context/QuotationContext";

import ButtonCalculateQuotation from "./QuotationUtils/ButtonCalculateQuotation.jsx";
import ButtonAddProduct from "./QuotationUtils/ButtonAddProduct";

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

    return (
        <>
            <table>
                <QuotationHeader />
                <tbody>
                    <NewQuotation />
                </tbody>
            </table>
            {quotationData.products && quotationData.products.length > 0 ? (
                <div>
                    <table key={`table-${quotationData.id}`}>
                            <ProductHeader />
                            {quotationData.products.map((product) => (
                                <tbody key={"body-" + product.productId} id={"body-" + product.productId}>
                                    <tr key={product.productId} id={product.productId}>
                                        <NewProduct productData={product} />
                                    </tr>
                                    <tr key={"processes-" + product.productId} id={"processes-" + product.productId}>
                                        <td colSpan="12">
                                            {product.processes && product.processes.length > 0 ? (
                                                <table>
                                                    <ProcessHeader />
                                                    <tbody>
                                                        {product.processes.map((process) => (
                                                            <tr key={process.processId} id={process.processId}>
                                                                <NewProcess initialProcessData={process} />
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>No hay procesos para este producto</p>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        
                    </table>
                    <div>
                        <ButtonAddProduct />
                        <ButtonCalculateQuotation />
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
    );
}

export default NewQuotationContainer;
