import IRequestBuilder from "../../src/Request/IRequestBuilder";
import IRequest from "../../src/Request/IRequest";
import IRequestMapping from "../../src/Request/IRequestMapping";
import RequestBuilder from "../../src/Request/RequestBuilder";
import RequestMapping from "../../src/Request/RequestMapping";

const TestJSON : any = {
    foo: 1
};

test('creates an empty request', () => {
    const builder : IRequestBuilder = new RequestBuilder();

	const request : IRequest = builder.build();
	
	const expectedRequest : IRequestMapping = new RequestMapping({});

    expect(request.getRequest()).toEqual(expectedRequest);
});

test('creates a full request', () => {
    const builder : IRequestBuilder = new RequestBuilder();

    const request : IRequest = builder.setBody(TestJSON)
                                        .setCookies(TestJSON)
                                        .setHeaders(TestJSON)
                                        .setParams(TestJSON)
                                        .setQuery(TestJSON)
										.build();
										
	const expectedRequest : IRequestMapping = new RequestMapping({
		body: TestJSON,
		cookies: TestJSON,
		headers: TestJSON,
		params: TestJSON,
		query: TestJSON
	});

    expect(request.getRequest()).toEqual(expectedRequest);
});