import IRequestBuilder from "./IRequestBuilder";
import IRequestMapping from "./IRequestMapping";
import IRequest from "./IRequest";
import Request from "./Request";
import RequestError from "./RequestError";

export default class RequestBuilder implements IRequestBuilder {
    private body : IRequestMapping;
    private cookies : IRequestMapping;
    private headers : IRequestMapping;
    private params : IRequestMapping;
    private query : IRequestMapping;

    constructor() {
        this.body = {};
        this.cookies = {};
        this.headers = {};
        this.params = {};
        this.query = {};
    }

    public setBody(body: IRequestMapping): IRequestBuilder {
        this.body = body;
        return this;
    }    
    
    public setCookies(cookies: IRequestMapping): IRequestBuilder {
        this.cookies = cookies;
        return this;
    }

    public setHeaders(headers: IRequestMapping): IRequestBuilder {
        this.headers = headers;
        return this;
    }

    public setParams(params: IRequestMapping): IRequestBuilder {
        this.params = params;
        return this;
    }

    public setQuery(query: IRequestMapping): IRequestBuilder {
        this.query = query;
        return this;
    }

    public build(): IRequest {
        return new Request(this.body, this.cookies, this.headers, this.params, this.query);
    }
}