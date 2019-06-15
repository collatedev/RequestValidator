import IRequest from "./IRequest";
import IRequestMapping from "./IRequestMapping";

export default class Request implements IRequest {
    private body : IRequestMapping;
    private cookies : IRequestMapping;

    constructor() {
        this.body = {};
        this.cookies = {};
    }

    public getBody(): IRequestMapping {
        return this.body;
    }
    
    public setBody(body: IRequestMapping) : void {
        this.body = body;
    }
    
    public getCookies(): IRequestMapping {
        return this.cookies;
    }

    public setCookies(cookies : IRequestMapping) : void {
        this.cookies = cookies;
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