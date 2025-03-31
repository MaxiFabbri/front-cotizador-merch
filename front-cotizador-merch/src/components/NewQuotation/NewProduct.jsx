import { useState } from "react";
import { apiClient } from "../../config/axiosConfig";
import NewProcess from "./NewProcess"; // Asegúrate de importar el componente NewProcess

const ProcessForm = () => {
    const [formData, setFormData] = useState({
        quotationId: "",
        quantity: "",
        productionDays: "",
        financingCost: "",
        shipmentCost: "",
        otherCost: "",
        unitSellingPrice: "",
        productDescription: ""
    });

    const [showNewProcess, setShowNewProcess] = useState(false); // Estado para mostrar/ocultar el componente NewProcess

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post("/api/products", formData);
            console.log("Process submitted:", response.data);
        } catch (error) {
            console.error("Error submitting process:", error);
        }
    };

    const handleAddProcess = () => {
        setShowNewProcess(true); // Muestra el componente NewProcess
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Quotation ID:</label>
                    <input
                        type="text"
                        name="quotationId"
                        value={formData.quotationId}
                        onChange={handleInputChange}
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
                        required
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

                <button type="submit">Submit</button>
            </form>

            <button type="button" onClick={handleAddProcess}>
                Add New Process
            </button>

            {showNewProcess && <NewProcess />} {/* Renderiza el componente NewProcess */}
        </div>
    );
};

export default ProcessForm;
