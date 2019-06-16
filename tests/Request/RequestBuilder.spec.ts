import IRequestBuilder from "../../src/Request/IRequestBuilder";
import IRequest from "../../src/Request/IRequest";
import IRequestMapping from "../../src/Request/IRequestMapping";
import RequestBuilder from "../../src/Request/RequestBuilder";
import RequestMapping from "../../src/Request/RequestMapping";

const EmptyMapping : IRequestMapping | null = null;
const TestMapping : IRequestMapping | null = new RequestMapping({
    foo: 1
});

test('creates an empty request', () => {
    const builder : IRequestBuilder = new RequestBuilder();

    const request : IRequest = builder.build();

    expect(request.getBody()).toEqual(EmptyMapping);
    expect(request.getCookies()).toEqual(EmptyMapping);
    expect(request.getHeaders()).toEqual(EmptyMapping);
    expect(request.getParams()).toEqual(EmptyMapping);
    expect(request.getQuery()).toEqual(EmptyMapping);
});

test('creates a full request', () => {
    const builder : IRequestBuilder = new RequestBuilder();

    const request : IRequest = builder.setBody(TestMapping)
                                        .setCookies(TestMapping)
                                        .setHeaders(TestMapping)
                                        .setParams(TestMapping)
                                        .setQuery(TestMapping)
                                        .build();

    expect(request.getBody()).toEqual(TestMapping);
    expect(request.getCookies()).toEqual(TestMapping);
    expect(request.getHeaders()).toEqual(TestMapping);
    expect(request.getParams()).toEqual(TestMapping);
    expect(request.getQuery()).toEqual(TestMapping);
});