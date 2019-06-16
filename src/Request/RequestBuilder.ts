import IRequestBuilder from "./IRequestBuilder";
import IRequestMapping from "./IRequestMapping";
import IRequest from "./IRequest";
import Request from "./Request";

export default class RequestBuilder implements IRequestBuilder {
    private body : IRequestMapping | null;
    private cookies : IRequestMapping | null;
    private headers : IRequestMapping | null;
    private params : IRequestMapping | null;
    private query : IRequestMapping | null;

    constructor() {
        this.body = null;
        this.cookies = null;
        this.headers = null;
        this.params = null;
        this.query = null;
    }

    public setBody(body: IRequestMapping | null): IRequestBuilder {
        this.body = body;
        return this;
    }    
    
    public setCookies(cookies: IRequestMapping | null): IRequestBuilder {
        this.cookies = cookies;
        return this;
    }

    public setHeaders(headers: IRequestMapping | null): IRequestBuilder {
        this.headers = headers;
        return this;
    }

    public setParams(params: IRequestMapping | null): IRequestBuilder {
        this.params = params;
        return this;
    }

    public setQuery(query: IRequestMapping | null): IRequestBuilder {
        this.query = query;
        return this;
    }

    public build(): IRequest {
        return new Request(this.body, this.cookies, this.headers, this.params, this.query);
    }
}