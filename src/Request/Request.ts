import IRequest from "./IRequest";
import IRequestMapping from "./IRequestMapping";

export default class Request implements IRequest {
    public getBody(): IRequestMapping {
        return {};
    }    
    
    public getCookie(): IRequestMapping {
        return {};
    }
    
    public getHeaders(): IRequestMapping {
        return {};
    }
    
    public getParams(): IRequestMapping {
        return {};
    }
    
    public getQuery(): IRequestMapping {
        return {};
    }


}