import IRequestMapping from "./IRequestMapping";
import IRequest from "./IRequest";

export default interface IRequestBuilder {
    setBody(body : IRequestMapping | null) : IRequestBuilder;
    setCookies(cookies : IRequestMapping | null) : IRequestBuilder;
    setHeaders(headers : IRequestMapping | null) : IRequestBuilder;
    setParams(params : IRequestMapping | null) : IRequestBuilder;
    setQuery(query : IRequestMapping | null) : IRequestBuilder;
    build() : IRequest;
}