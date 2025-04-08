import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import NewProduct from "../components/NewQuotation/QuotationElements/NewProduct";
import NewQuotation from "../components/NewQuotation/NewQuotation";
import NewQuotationContainer from "../components/NewQuotation/NewQuotationContainer";

export const QuotationContext = createContext();

export const QuotationProvider = ({ children }) => {

    const initialQuotationDataState = {
        id: "",
        date: "",
        customerId: "",
        customerName: "",
        paymentMethodId: "",
        paymentMethodName: "",
        paymentDaysToCollect: 0,
        monthlyRate: 0,
        currency: "Peso",
        exchangeRate: 0,
        quoteStatus: "Cotizado",
        quoteUnitSellingPrice: 0,
        quoteProductsDescription: "",
        isKit: false,
        products: [], // Array de productos
    };

    const [quotationData, setQuotationData] = useState(initialQuotationDataState);

    // Función para actualizar la cotización completa
    const updateQuotationData = (updatedData) => {
        console.log("Actualizando datos de cotización: ", {...updatedData});
        setQuotationData((prevData) => ({
            ...prevData,
            ...updatedData,
        }));
    };

    // Funcion para vaciar el objeto quotationData
    const clearQuotationData = () => {
        setQuotationData(initialQuotationDataState);
    }

    // Función para agregar un producto al array de productos
    const addProduct = (prodData) => {
        console.log("Producto para agregar: ", prodData);
        setQuotationData((prevData) => ({
            ...prevData,
            products: [ ...prevData.products, prodData ],
        }));
    };

    // Función para actualizar un producto específico
    const updateProduct = (updatedProduct) => {
        setQuotationData((prevData) => ({
            ...prevData,
            products: prevData.products.map((product) =>
                (product.productId === updatedProduct.productId)
                    ? { ...product, ...updatedProduct }
                    : product
            ),
        }));
        // console.log("Producto actualizado: ", updatedProduct);
    };

    const removeProduct = (productId) => {
        setQuotationData((prevData) => ({
            ...prevData,
            products: prevData.products.filter((product) => product.productId !== productId),
        }));
        console.log("Producto eliminado con ID: ", productId);
    };


    // Función para agregar un proceso a un producto específico
    const addProcessToProduct = (productId, newProcess) => {
        setQuotationData((prevData) => ({
            ...prevData,
            products: prevData.products.map((product) =>
                product.id === productId
                    ? { ...product, processes: [...product.processes, newProcess] }
                    : product
            ),
        }));
    };

    // Función para actualizar un proceso específico dentro de un producto
    const updateProcessInProduct = (productId, updatedProcess) => {
        setQuotationData((prevData) => ({
            ...prevData,
            products: prevData.products.map((product) =>
                product.id === productId
                    ? {
                        ...product,
                        processes: product.processes.map((process) =>
                            process.id === updatedProcess.id ? { ...process, ...updatedProcess } : process
                        ),
                    }
                    : product
            ),
        }));
    };

    return (
        <QuotationContext.Provider
            value={{
                quotationData,
                clearQuotationData,
                updateQuotationData,
                addProduct,
                updateProduct,
                removeProduct,
                addProcessToProduct,
                updateProcessInProduct,
            }}
        >
            {children}
        </QuotationContext.Provider>
    );
}