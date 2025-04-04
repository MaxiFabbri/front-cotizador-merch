import { useState } from "react";
import { apiClient } from "../../../config/axiosConfig";
import IconButton from "../../Utils/IconButton";
// import NewProcess from "./NewProcess"; // Asegúrate de importar el componente NewProcess

const NewProduct = ({ quotationId }) => {
    const [prodData, setProdData] = useState({
        quotationId: quotationId,
        quantity: 1,
        productionDays: 15,
        financingCost: 0,
        shipmentCost: 0,
        otherCost: 0,
        unitSellingPrice: 0,
        productDescription: ""
    });

    console.log("Prod data inicial: ", prodData); // Verifica los datos iniciales

    const [showNewProducts, setShowNewProducts] = useState(false); // Estado para mostrar/ocultar el componente NewProcess

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProdData({
            ...prodData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Prod data a enviar: ", prodData); // Verifica los datos del formulario
        try {
            const response = await apiClient.post("/products", prodData);
            console.log("Process submitted:", response.data);
        } catch (error) {
            console.error("Error submitting process:", error);
        }
    };

    // const handleAddProcess = () => {
    //     setShowNewProcess(true); // Muestra el componente NewProcess
    // };

    return (
        <tr>
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
                <input
                    type="text"
                    name="productDescription"
                    value={prodData.productDescription}
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <IconButton
                    icon="/create.png"
                    text="Crear Cotizacion"
                    onClick={() => handleSubmit}
                />
            </td>
        </tr>
    );
};

export default NewProduct;
