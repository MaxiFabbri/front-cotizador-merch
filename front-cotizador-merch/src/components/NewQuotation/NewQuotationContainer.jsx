import { useContext } from "react";
import NewQuotation from "./NewQuotation"; // Asegúrate de importar tu componente NewQuotation
import { QuotationContext } from "../../context/QuotationContext";

import { apiClient } from "../../config/axiosConfig.js";


const NewQuotationContainer = () => {
    const { quotationData } = useContext(QuotationContext);
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
        </>
    );
};

export default NewQuotationContainer;
