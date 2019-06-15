import IRequest from "./IRequest";
import IRequestMapping from "./IRequestMapping";

export default class Request implements IRequest {
    private body : IRequestMapping;

    constructor() {
        this.body = {};
    }

    public getBody(): IRequestMapping {
        return this.body;
    }
    
    public setBody(body: IRequestMapping) {
        this.body = body;
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