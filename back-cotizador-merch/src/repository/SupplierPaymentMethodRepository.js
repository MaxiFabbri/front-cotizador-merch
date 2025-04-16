
import e from "express";
import GenericRepository from "./GenericRepository.js";

export default class SupplierPaymentMethodRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getSupplierPaymentMethodById = (id) =>{
        return this.getBy({_id:id});
    }
    getSupplierPaymentMethodByName = (name) => {
        console.log("Repository Supplier Name: ", name)
        return this.getAll({
            supplier_payment_description: { $regex: name, $options: "i" }
        })
    }
    deleteSupplierPaymentMethodById = (id) =>{
        return this.delete(id)
    }
}