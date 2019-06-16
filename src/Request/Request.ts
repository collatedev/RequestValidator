import IRequest from "./IRequest";
import IRequestMapping from "./IRequestMapping";

export default class Request implements IRequest {
    private readonly body : IRequestMapping | null;
    private readonly cookies : IRequestMapping | null;
    private readonly headers : IRequestMapping | null;
    private readonly params : IRequestMapping | null;
    private readonly query : IRequestMapping | null;

    constructor(
        body : IRequestMapping | null, 
        cookies : IRequestMapping | null, 
        headers : IRequestMapping | null, 
        params : IRequestMapping | null, 
        query : IRequestMapping | null
    ) {
        this.body = body;
        this.cookies = cookies;
        this.headers = headers;
        this.params = params;
        this.query = query;
    }

    public getBody(): IRequestMapping | null {
        return this.body;
    }
    
    public getCookies(): IRequestMapping | null {
        return this.cookies;
    }
    
    public getHeaders(): IRequestMapping | null {
        return this.headers;
    }
    
    public getParams(): IRequestMapping | null {
        return this.params;
    }
    
    public getQuery(): IRequestMapping | null {
        return this.query;
    }


}