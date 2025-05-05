import { useState, useContext, useEffect } from "react";
import { QuotationContext } from "../../../context/QuotationContext";
import IconButton from "../../Utils/IconButton";
import ButtonAddProcess from "../QuotationUtils/ButtonAddProcess";


const NewProduct = ({productData}) => {
    const { quotationData, updateProduct, removeProduct } = useContext(QuotationContext);
    const [prodData, setProdData] = useState(productData);
    const [debouncedProdData, setDebouncedProdData] = useState(prodData);

    useEffect(() => {
        updateProdData();
    }, [quotationData]);

    const updateProdData = () => {
        const newProductData = quotationData.products.find((product) => product.productId === prodData.productId);
        if (JSON.stringify(newProductData) !== JSON.stringify(prodData)) {
            setProdData(newProductData);
        }
    }

    // Actualizar el estado global al cambiar `debouncedProdData`
    useEffect(() => {
        console.log("Actualizando producto en el contexto: ", debouncedProdData);
        updateProduct(debouncedProdData, debouncedProdData.productId);
    }, [debouncedProdData]);

    // Debounce: Actualizar `debouncedProdData` después de un retraso
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedProdData(prodData);
        }, 1000);
        return () => {
            clearTimeout(handler); // Limpiar el temporizador previo
        };
    }, [prodData]);

    // Manejo de cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // updateProdData();
        if (name.startsWith("temp")) {
            const convertedValue = +((value / quotationData.exchangeRate).toFixed(2));
            const newName = name.replace("temp", "");
            setProdData((prevData) => ({
                ...prevData,
                [newName]: convertedValue,
            }))
        }
        
        setProdData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    // Eliminar el producto del contexto
    const handleDeleteProduct = () => {
        removeProduct(prodData.productId); // Eliminamos el producto usando su ID único
    };

    return (
        <>
            <td>
                <IconButton
                    icon="/delete.png"
                    text="Eliminar Producto"
                    onClick={handleDeleteProduct}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="quantity"
                    defaultValue={prodData.quantity}
                    onInput={handleInputChange}
                    required
                />
            </td>
            <td>
                <span>{prodData.productDescription}</span>
                {/* <input
                    type="text"
                    name="productDescription"
                    defaultValue={prodData.productDescription}
                    onInput={handleInputChange}
                /> */}
            </td>
            <td>
                <input
                    type="number"
                    name="productionDays"
                    defaultValue={prodData.productionDays}
                    onInput={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="tempfinancingCost"
                    defaultValue={prodData.tempfinancingCost}
                    onInput={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="tempshipmentCost"
                    defaultValue={prodData.tempshipmentCost}
                    onInput={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="tempotherCost"
                    defaultValue={prodData.tempotherCost}
                    onInput={handleInputChange}
                />
            </td>
            <td>
                <span>$ {prodData.pesosPrice}</span>
            </td>
            <td>
                <ButtonAddProcess
                    productId={prodData.productId}
                />
            </td>

        </>
    );
};

export default NewProduct;
