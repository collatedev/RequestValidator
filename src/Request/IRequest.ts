import IRequestMapping from "./IRequestMapping";

export default interface IRequest {
    getBody() : IRequestMapping;
    getCookies() : IRequestMapping;
    getHeaders() : IRequestMapping;
    getParams() : IRequestMapping;
    getQuery() : IRequestMapping;
}