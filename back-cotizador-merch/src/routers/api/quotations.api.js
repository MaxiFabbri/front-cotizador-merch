import CustomRouter from "../../utils/CustomRouter.util.js";
import { 
    createQuotation, 
    readQuotation,
    readQuotationPopulated,
    readQuotationByIdPopulated,
    readQuotationPopulatedByCustomerName,
    readQuotationById,
    updateQuotation, 
    destroyQuotation 
} from "../../controllers/Quotations.controllers.js";


class QuotationsApiRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/", ["USER", "ADMIN"], createQuotation);
        this.read("/", ["USER", "ADMIN"], readQuotation);
        this.read("/name", ["USER", "ADMIN"], readQuotationPopulatedByCustomerName);
        this.read("/populated/", ["USER", "ADMIN"], readQuotationPopulated);
        this.read("/populated/:id", ["USER", "ADMIN"], readQuotationByIdPopulated)
        this.read("/:id", ["USER", "ADMIN"], readQuotationById);
        this.update("/:id", ["USER", "ADMIN"], updateQuotation);
        this.destroy("/:id", ["USER", "ADMIN"], destroyQuotation);      
    };
}

const quotationsApiRouter = new QuotationsApiRouter();
export default quotationsApiRouter.getRouter();