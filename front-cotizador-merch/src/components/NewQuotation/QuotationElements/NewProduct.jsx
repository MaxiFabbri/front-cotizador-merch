import { useState } from "react";
import { apiClient } from "../../../config/axiosConfig";
import IconButton from "../../Utils/IconButton";
// import NewProcess from "./NewProcess"; // Asegúrate de importar el componente NewProcess

const ProductForm = ({ quotationId }) => {
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
        <div>
            <form>
                <div>
                    <label>Quotation ID:</label>
                    <input
                        type="text"
                        name="quotationId"
                        value={formData.quotationId}
                    // onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Production Days:</label>
                    <input
                        type="number"
                        name="productionDays"
                        value={formData.productionDays}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Financing Cost:</label>
                    <input
                        type="number"
                        name="financingCost"
                        value={formData.financingCost}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Shipment Cost:</label>
                    <input
                        type="number"
                        name="shipmentCost"
                        value={formData.shipmentCost}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Other Cost:</label>
                    <input
                        type="number"
                        name="otherCost"
                        value={formData.otherCost}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Unit Selling Price:</label>
                    <input
                        type="number"
                        name="unitSellingPrice"
                        value={formData.unitSellingPrice}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Product Description:</label>
                    <input
                        type="text"
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleInputChange}
                    />
                </div>
                <IconButton
                    icon="/create.png"
                    text="Crear Cotizacion"
                    onClick={() => handleSubmit}
                />
            </form>
        </div>
    );
};

export default ProductForm;
