import Request from "../../src/Request/Request";
import IRequest from "../../src/Request/IRequest";
import IRequestMapping from "../../src/Request/IRequestMapping";
import RequestMapping from "../../src/Request/RequestMapping";

const EmptyMapping : IRequestMapping = new RequestMapping({});
const TestMapping : IRequestMapping = new RequestMapping({
    foo: "bar"
});

test('Creates an empty request', () => {
    testRequest(EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with a body', () => {
    testRequest(TestMapping, EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with cookies', () => {
    testRequest(EmptyMapping, TestMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with headers', () => {
    testRequest(EmptyMapping, EmptyMapping, TestMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with params', () => {
    testRequest(EmptyMapping, EmptyMapping, EmptyMapping, TestMapping, EmptyMapping);
});

test('Creates a request with query', () => {
    testRequest(EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping, TestMapping);
});

function testRequest(
    body : IRequestMapping, 
    cookies : IRequestMapping,
    headers : IRequestMapping, 
    params : IRequestMapping, 
    query : IRequestMapping
) : void {
    const request : IRequest = new Request(body, cookies, headers, params, query);

    expect(request.getBody()).toEqual(body);
    expect(request.getCookies()).toEqual(cookies);
    expect(request.getHeaders()).toEqual(headers);
    expect(request.getParams()).toEqual(params);
    expect(request.getQuery()).toEqual(query);
}
