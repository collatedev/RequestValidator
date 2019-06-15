import IRequestBuilder from "../../src/Request/IRequestBuilder";
import IRequest from "../../src/Request/IRequest";
import IRequestMapping from "../../src/Request/IRequestMapping";
import RequestBuilder from "../../src/Request/RequestBuilder";

const EmptyMapping : IRequestMapping = {};

test('creates an empty request', () => {
    const builder : IRequestBuilder = new RequestBuilder();

    const request : IRequest = builder.build();

    expect(request.getBody()).toEqual(EmptyMapping);
    expect(request.getCookies()).toEqual(EmptyMapping);
    expect(request.getHeaders()).toEqual(EmptyMapping);
    expect(request.getParams()).toEqual(EmptyMapping);
    expect(request.getQuery()).toEqual(EmptyMapping);
});