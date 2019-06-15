import IRequestMapping from "./IRequestMapping";
import IRequest from "./IRequest";

export default interface IRequestBuilder {
    setBody(body : IRequestMapping) : IRequestBuilder;
    setCookies(cookies : IRequestMapping) : IRequestBuilder;
    setHeaders(headers : IRequestMapping) : IRequestBuilder;
    setParams(params : IRequestMapping) : IRequestBuilder;
    setQuery(query : IRequestMapping) : IRequestBuilder;
    build() : IRequest;
}