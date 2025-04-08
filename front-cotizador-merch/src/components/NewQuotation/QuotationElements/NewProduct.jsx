import { useState, useContext, useEffect } from "react";
import { QuotationContext } from "../../../context/QuotationContext";
import IconButton from "../../Utils/IconButton";


const NewProduct = (productData) => {
    const { updateProduct, removeProduct } = useContext(QuotationContext);
    const [prodData, setProdData] = useState(productData.productData);

    // Estado para manejo de debouncing
    const [debouncedProdData, setDebouncedProdData] = useState(prodData);

    // Actualizar el estado global al cambiar `debouncedProdData`
    useEffect(() => {
        updateProduct(debouncedProdData);
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
        setProdData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Eliminar el producto del contexto
    const handleDeleteProduct = () => {
        removeProduct(prodData.productId); // Eliminamos el producto usando su ID único
        console.log(`Producto eliminado con ID: ${prodData.productId}`);
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
                <span>{prodData.productId}</span>
            </td>
            <td>
                <input
                    type="number"
                    name="quantity"
                    value={prodData.quantity}
                    onChange={handleInputChange}
                    required
                />
            </td>
            <td>
                <input
                    type="text"
                    name="productDescription"
                    value={prodData.productDescription}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="productionDays"
                    value={prodData.productionDays}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="financingCost"
                    value={prodData.financingCost}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="shipmentCost"
                    value={prodData.shipmentCost}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <input
                    type="number"
                    name="otherCost"
                    value={prodData.otherCost}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <span>$ {prodData.unitSellingPrice}</span>
            </td>
            {/* <td>
                <IconButton
                    icon="/create.png"
                    text="Agregar Producto"
                    onClick={handleAddProduct}
                />
            </td> */}
        </>
    );
};

export default NewProduct;
