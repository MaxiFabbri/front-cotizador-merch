import { useContext, useState, useEffect } from "react";
import { QuotationContext } from "../../../context/QuotationContext.jsx";
import { apiClient } from "../../../config/axiosConfig.js";
import TextButton from "../../Utils/TextButton";

const ButtonCalculateQuotation = () => {
    const { quotationData, updateQuotationData } = useContext(QuotationContext);

    const saveCalculatedQuotation = async () => {
        console.log("Quotation to save: ", quotationData);

    }

    const currencyConverterFromDolar = (value) => {
        if (quotationData.currency === "Dolar") {
            return value;
        } else {
            return value * quotationData.exchangeRate
        }
    }
    const currencyConverterToDolar = (value) => {
        if (quotationData.currency === "Dolar") {
            return value;
        } else {
            return value / quotationData.exchangeRate
        }
    }

    const handleCalculateQuotation = () => {
        console.log("Calculando cotización... ", quotationData);

        
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
