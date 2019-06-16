import IRequestMapping from "./IRequestMapping";

export default interface IRequest {
    getBody() : IRequestMapping | null;
    getCookies() : IRequestMapping | null;
    getHeaders() : IRequestMapping | null;
    getParams() : IRequestMapping | null;
    getQuery() : IRequestMapping | null;
}