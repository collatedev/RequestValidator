export default interface IRequest {
    getBody() : { [ key: string ] : any };
    getCookie() : { [ key: string ] : any };
    getHeaders() : { [ key: string ] : any };
    getParams() : { [ key: string ] : any };
    getQuery() : { [ key: string ] : any };
}