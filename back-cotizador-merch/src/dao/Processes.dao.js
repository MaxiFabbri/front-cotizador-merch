import processModel from './models/Process.js';


export default class Processes {
    
    get = (params) =>{
        return processModel.find(params);
    }

    getBy = (params) =>{
        return processModel.findOne(params);
    }

    save = (doc) =>{
        return processModel.create(doc);
    }

    update = (id,doc) =>{
        return processModel.findByIdAndUpdate(id,{$set:doc})
    }

    delete = (id) =>{
        return processModel.findByIdAndDelete(id);
    }
    deleteMany = (params) => {
        return processModel.deleteMany(params);
    }
    getByProductPopulated = (params) => {
        console.log("Processes Dao params: ", params)
        return processModel.find(params)
        .populate({
                path: 'supplierId',
                populate: {
                    path: 'supplierPaymentMethodId'
                }
            })            
    }
}