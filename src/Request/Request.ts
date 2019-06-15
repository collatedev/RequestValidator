import IRequest from "./IRequest";
import IRequestMapping from "./IRequestMapping";

export default class Request implements IRequest {
    private readonly body : IRequestMapping;
    private readonly cookies : IRequestMapping;
    private readonly headers : IRequestMapping;
    private readonly params : IRequestMapping;
    private readonly query : IRequestMapping;

    constructor(
        body : IRequestMapping, 
        cookies : IRequestMapping, 
        headers : IRequestMapping, 
        params : IRequestMapping, 
        query : IRequestMapping
    ) {
        this.body = body;
        this.cookies = cookies;
        this.headers = headers;
        this.params = params;
        this.query = query;
    }

    public getBody(): IRequestMapping {
        return this.body;
    }
    
    public getCookies(): IRequestMapping {
        return this.cookies;
    }
    
    public getHeaders(): IRequestMapping {
        return this.headers;
    }
    
    public getParams(): IRequestMapping {
        return this.params;
    }
    
    public getQuery(): IRequestMapping {
        return this.query;
    }


}