import GenericRepository from "./GenericRepository.js";

export default class QuotationRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    getAllQuotationsPopulated = () =>{
        return this.dao.getQuotationsWithCustomerDetails()
    }
    getQuotationsByIdPopulated = (id) =>{
        return this.dao.getOneQuotationByIdwithCustomerDetails(id)
    }
    getQuotationById = (id) =>{
        return this.getBy({_id:id})
    }
    deleteQuotationById = (id) =>{
        return this.delete(id)
    }
    getQuotationsFilteredByCustomerIdsPopulated(customerIds){
        return this.dao.getQuotationsByIdWithCustomerDetails( { customerId: { $in: customerIds } } );
    }
    
}