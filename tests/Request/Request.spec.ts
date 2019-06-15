import Request from "../../src/Request/Request";
import IRequest from "../../src/Request/IRequest";
import IRequestMapping from "../../src/Request/IRequestMapping";

const EmptyMapping : IRequestMapping = {};
const TestMapping : IRequestMapping = {
    foo: "bar"
};

test('Creates an empty request', () => {
    testRequest(EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

function testRequest(
    body : IRequestMapping, 
    cookies : IRequestMapping,
    headers : IRequestMapping, 
    params : IRequestMapping, 
    query : IRequestMapping
) {
    const request : IRequest = new Request(body, cookies, headers, params, query);

    expect(request.getBody()).toEqual(body);
    expect(request.getCookies()).toEqual(cookies);
    expect(request.getHeaders()).toEqual(headers);
    expect(request.getParams()).toEqual(params);
    expect(request.getQuery()).toEqual(query);
}

test('Creates a request with a body', () => {
    testRequest(TestMapping, EmptyMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

test('Creates a request with cookies', () => {
    testRequest(EmptyMapping, TestMapping, EmptyMapping, EmptyMapping, EmptyMapping);
});

