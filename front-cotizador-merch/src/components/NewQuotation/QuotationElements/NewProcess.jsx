import { useState } from "react";
import { apiClient } from "../../../config/axiosConfig";
import { v4 as uuidv4 } from 'uuid';

import IconButton from "../../Utils/IconButton";

const NewProcess = (productId) => {
    const processTempId = uuidv4();
    const [processData, setProcessData] = useState({
        processId: processTempId,
        productId: productId,
        description: "",
        supplierId: "",
        supplierName: "",
        supplierPaymentMethodId: "",
        supplierPaymentMethodName: "",
        daysToPayment: 0,
        unitCost: 0,
        fixedCost: 0,
        subTotalProcessCost: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProcessData({
            ...processData,
            [name]: value
        });
    };

    const handleSubmitProcess = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post("/processes", processData);
            console.log("Process created:", response.data);
        } catch (error) {
            console.error("Error creating process:", error);
        }
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>ID Producto</th>
                        <th>Descripción</th>
                        <th>Proveedor</th>
                        <th>Forma de Pago</th>
                        <th>Dias de Pago</th>
                        <th>Costo Unitario</th>
                        <th>Costo Fijo</th>
                        <th>Subtotal Costo del proceso</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={processData.processId}>
                        <td></td>
                        <td>
                            <span>
                                {processData.productId}
                            </span>
                        </td>

                        <td>
                            <input
                                type="text"
                                name="description"
                                value={processData.description}
                                onChange={handleInputChange}
                            />
                        </td>
                        <td>
                            <input
                            type="text"
                            name="supplierName"
                            value={processData.supplierName}
                            onChange={handleInputChange}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="supplierPaymentMethodName"
                                value={processData.supplierPaymentMethodName}
                                onChange={handleInputChange}
                            />
                        </td>
                        <td>
                            <span>
                                {processData.daysToPayment}
                            </span>
                        </td>
                        <td>
                            <input
                                type="number"
                                name="unitCost"
                                value={processData.unitCost}
                                onChange={handleInputChange}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                name="fixedCost"
                                value={processData.fixedCost}
                                onChange={handleInputChange}
                            />
                        </td>
                        <td>
                            <span>
                                {processData.subTotalProcessCost}
                            </span>
                        </td>
                        <td>
                            <IconButton
                                icon="/create.png"
                                text="Crear Proceso"
                                onClick={handleSubmitProcess}
                            />
                        </td>
                    </tr>
                </tbody>
            </table >
        </div>    
    )       
};

            export default NewProcess;