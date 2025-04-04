import { useState } from "react";
import { apiClient } from "../../../config/axiosConfig";

const ProcessForm = () => {
    const [formData, setFormData] = useState({
        productId: "",
        description: "",
        supplierId: "",
        daysToPayment: "",
        unitCost: "",
        fixedCost: "",
        subTotalProcessCost: ""
    });

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
            const response = await apiClient.post("/processes", formData);
            console.log("Process created:", response.data);
        } catch (error) {
            console.error("Error creating process:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Product ID:</label>
                <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Description:</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Supplier ID:</label>
                <input
                    type="text"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Days to Payment:</label>
                <input
                    type="number"
                    name="daysToPayment"
                    value={formData.daysToPayment}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Unit Cost:</label>
                <input
                    type="number"
                    name="unitCost"
                    value={formData.unitCost}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Fixed Cost:</label>
                <input
                    type="number"
                    name="fixedCost"
                    value={formData.fixedCost}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Subtotal Process Cost:</label>
                <input
                    type="number"
                    name="subTotalProcessCost"
                    value={formData.subTotalProcessCost}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};

export default ProcessForm;