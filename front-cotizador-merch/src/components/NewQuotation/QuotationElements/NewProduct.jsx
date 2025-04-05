import { useState } from "react";
import { apiClient } from "../../../config/axiosConfig";
import { v4 as uuidv4 } from 'uuid';

import IconButton from "../../Utils/IconButton";
import NewProcess from "./NewProcess";

const NewProduct = ({ quotationId }) => {
    const tempId = uuidv4();
    const [prodData, setProdData] = useState({
        productId: tempId,
        quotationId: quotationId,
        quantity: 1,
        productionDays: 15,
        financingCost: 0,
        shipmentCost: 0,
        otherCost: 0,
        unitSellingPrice: 0,
        productDescription: ""
    });
    const [tempProdRowId, setTempProdRowId] = useState(uuidv4());
    const [productCreated, setProductCreated] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProdData({
            ...prodData,
            [name]: value
        });
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        const dataToSubmit = {
            quotationId: prodData.quotationId,
            quantity: prodData.quantity,
            productionDays: prodData.productionDays,
            financingCost: prodData.financingCost,
            shipmentCost: prodData.shipmentCost,
            otherCost: prodData.otherCost,
            unitSellingPrice: prodData.unitSellingPrice,
            productDescription: prodData.productDescription
        }
        try {
            const response = await apiClient.post("/products", dataToSubmit);
            console.log("Process submitted:", response.data);
            const id = response.data.response._id;
            console.log("ID del producto creado: ", id); // Verifica el ID del producto creado
            if (id) {
                setProductCreated(true);
                setProdData(prevProdData => ({
                    ...prevProdData,
                    productId: id,
                }))
            };
        } catch (error) {
            console.error("Error submitting process:", error);
        }
    };

    const deleteProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.delete(`/products/${prodData.productId}`);
            console.log("Product deleted:", response.data);
            setProdData({
                productId: tempId,
                quotationId: quotationId,
                quantity: 1,
                productionDays: 15,
                financingCost: 0,
                shipmentCost: 0,
                otherCost: 0,
                unitSellingPrice: 0,
                productDescription: ""
            });
            setProductCreated(false);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Quote Id</th>
                        <th>Cantidad</th>
                        <th>Descripción</th>
                        <th>Dias Producción</th>
                        <th>Costo Financiero</th>
                        <th>Costo de Fletes</th>
                        <th>Otros Costos</th>
                        <th>Precio Unitario</th> 
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={prodData.productId}>
                        <td>
                            <IconButton
                                icon="/delete.png"
                                text="Eliminar Producto"
                                onClick={deleteProduct}
                            />
                        </td>
                        <td>
                            <span>
                                {prodData.quotationId}
                            </span>
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
                            <span>
                                $ {prodData.unitSellingPrice}
                            </span>
                        </td>
                        <td>
                            <IconButton
                                icon="/create.png"
                                text="Crear Cotizacion"
                                onClick={handleSubmitProduct}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <>
                {productCreated && (
                    <div>
                        <NewProcess productId={prodData.productId} />
                    </div>
                )}
            </>
        </div>
    );
};

export default NewProduct;
