import GenericRepository from "./GenericRepository.js";

export default class ProcessRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getProcessByProductId = (productId) =>{
        return this.dao.getByProductPopulated({productId});
    }
    getProcessById = (id) =>{
        return this.getBy({_id:id})
    }
    deleteProcessById = (id) =>{
        return this.delete(id)
    }
    deleteProcessByProductId = (productId) => {
        return this.deleteAll({productId})
    }
    
}