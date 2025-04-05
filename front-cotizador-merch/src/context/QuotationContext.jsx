import { createContext, useState } from "react";

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
        setQuotationData((prevData) => ({
            ...prevData,
            ...updatedData,
        }));
    };

    // Función para agregar un producto al array de productos
    const addProduct = (newProduct) => {
        setQuotationData((prevData) => ({
            ...prevData,
            products: [...prevData.products, { ...newProduct, processes: [] }],
        }));
    };

    // Función para actualizar un producto específico
    const updateProduct = (updatedProduct) => {
        setQuotationData((prevData) => ({
            ...prevData,
            products: prevData.products.map((product) =>
                product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            ),
        }));
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
                updateQuotationData,
                addProduct,
                updateProduct,
                addProcessToProduct,
                updateProcessInProduct,
            }}
        >
            {children}
        </QuotationContext.Provider>
    );
}