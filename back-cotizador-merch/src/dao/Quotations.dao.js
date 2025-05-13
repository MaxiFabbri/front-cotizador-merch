import quotationModel from './models/Quotation.js';


export default class quotations {

    get = (params) => {
        return quotationModel.find(params);
    }

    getQuotationsWithCustomerDetails = () => {
        return quotationModel.find()
            .populate({
                path: 'customerId',
                populate: {
                    path: 'customerPaymentMethodId'
                }
            })
    }

    getOneQuotationByIdwithCustomerDetails = (id) => {
        return quotationModel.findOne({_id:id})
            .populate({
                path: 'customerId',
                populate: {
                    path: 'customerPaymentMethodId'
                }
            })
    }

    getQuotationsByIdWithCustomerDetails = (query) => {
        const response = quotationModel.find(query)
        .populate({
            path: 'customerId',
            populate: {
                path: 'customerPaymentMethodId'
            }
        })
        return response
    }

    getBy = (params) => {
        return quotationModel.findOne(params);
    }

    save = (doc) => {
        return quotationModel.create(doc);
    }

    update = (id, doc) => {
        return quotationModel.findByIdAndUpdate(id, { $set: doc })
    }

    delete = (id) => {
        return quotationModel.findByIdAndDelete(id);
    }
}