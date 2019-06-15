import IRequestMapping from "./IRequestMapping";

export default interface IRequest {
    getBody() : IRequestMapping;
    getCookie() : IRequestMapping;
    getHeaders() : IRequestMapping;
    getParams() : IRequestMapping;
    getQuery() : IRequestMapping;
}