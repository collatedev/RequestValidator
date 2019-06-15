import Request from "../../src/Request/Request";
import IRequest from "../../src/Request/IRequest";

test('Creates an empty request', () => {
    const request : IRequest = new Request();

    expect(request.getBody()).toEqual({});
    expect(request.getCookie()).toEqual({});
    expect(request.getHeaders()).toEqual({});
    expect(request.getParams()).toEqual({});
    expect(request.getQuery()).toEqual({});
});

test('Creates a request with a body', () => {
    const request : Request = new Request();

    request.setBody({
        foo: 1
    });

    expect(request.getBody()).toEqual({
        foo: 1
    });
    expect(request.getCookie()).toEqual({});
    expect(request.getHeaders()).toEqual({});
    expect(request.getParams()).toEqual({});
    expect(request.getQuery()).toEqual({});
});