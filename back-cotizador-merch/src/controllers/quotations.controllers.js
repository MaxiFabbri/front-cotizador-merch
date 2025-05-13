import { quotationService, customerService, productService, processService } from "../services/index.service.js";


async function createQuotation(req, res) {
    const message = "QUOTATION CREATED";
    const data = req.body;
    const response = await quotationService.create(data);
    return res.status(201).json({ response, message });
}
async function readQuotation(req, res) {
    const message = "QUOTATIONS FOUND";
    const response = await quotationService.getAll();
    return res.status(200).json({ response, message });
}
async function readQuotationByIdPopulated(req, res) {
    const { id } = req.params;
    const message = "QUOTATIONS FOUND";
    const response = await quotationService.getQuotationsByIdPopulated(id);
    return res.status(200).json({ response, message });
}
async function readQuotationPopulatedByCustomerName(req, res) {
    const name = req.query.name;
    console.log("Quotations Controllers name recieved: ",name);
    try {
        
        // Busco el customer por name recibido en la consulta
        const customers = await customerService.getCustomerByNameOrCode(name);
        // Recivo los customers que coinciden con el name
        const customerIds = customers.map(customer => customer._id);
        const response = await quotationService.getQuotationsFilteredByCustomerIdsPopulated(customerIds)

        const message = "QUOTATIONS FOUND";
        return res.status(200).json({ response, message });

    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
        return [];
    }
    // console.lo
    // return []
}

async function readQuotationPopulated(req, res) {
    const message = "QUOTATIONS FOUND";
    const response = await quotationService.getAllQuotationsPopulated();
    return res.status(200).json({ response, message });
}

async function readQuotationById(req, res) {
    const { id } = req.params;
    const message = "QUOTATION FOUND";
    const response = await quotationService.getQuotationById(id);
    return res.status(200).json({ response, message });
}

async function updateQuotation(req, res) {
    const { id } = req.params;
    const data = req.body;
    const message = "QUOTATION UPDATED";
    const response = await quotationService.update(id, data);
    return res.status(200).json({ response, message });
}

async function destroyQuotation(req, res) {
    const { id } = req.params;
    // Busco los products con este quotation id
    const responseProducts = await productService.getProductByQuotationId(id);
    responseProducts.map( async (product) => {
        // elimino los procesos de ese Producto
        const resProcDel = await processService.deleteAll({"productId": product._id})
        // elimino el producto
        await productService.delete(product._id)
    })
    const message = "QUOTATION DELETED 2";
    const response = await quotationService.delete(id);
    return res.status(200).json({ response, message });
}


export {
    createQuotation, 
    readQuotation,
    readQuotationPopulated,
    readQuotationByIdPopulated,
    readQuotationPopulatedByCustomerName,
    readQuotationById,
    updateQuotation, 
    destroyQuotation 
}