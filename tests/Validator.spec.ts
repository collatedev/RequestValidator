import IValidator from '../src/IValidator';
import IValidationResult from '../src/ValidationResult/IValidationResult';
import Validator from '../src/Validator';
import ValidationSchema from '../src/ValidationSchema/ValidationSchema';
import IRequestBuilder from '../src/Request/IRequestBuilder';
import RequestBuilder from '../src/Request/RequestBuilder';
import IRequest from '../src/Request/IRequest';
import RequestMapping from '../src/Request/RequestMapping';

test('Validates empty body', () => {
    const validator : IValidator = new Validator(new ValidationSchema({
        types: {
            body: {
            }
        }
    }));
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.build();

    const result : IValidationResult = validator.validate(request);

    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
});

test('Validates a request body', () => {
    const validator : IValidator = new Validator(new ValidationSchema({
        types: {
            body: {
                foo: {
                    type: "number",
                    required: true
                }
            }
        }
    }));

    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody(new RequestMapping({ foo : 1 }))
                                .build();

    const result : IValidationResult = validator.validate(request);

    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
});

test('Validates a request body with a missing property', () => {
    const validator : IValidator = new Validator(new ValidationSchema({
        types: {
            body: {
                foo: {
                    type: "number",
                    required: true
                }
            }
        }
    }));
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody(new RequestMapping({}))
                                .build();

    const result : IValidationResult = validator.validate(request);

    expect(result.isValid()).toBeFalsy();
    expect(result.errors()).toHaveLength(1);
    expect(result.errors()[0].location).toEqual("body");
    expect(result.errors()[0].message).toEqual("Missing property foo");
});

test('Validates a request body with an optional property', () => {
    const validator : IValidator = new Validator(new ValidationSchema({
        types: {
            body: {
                foo: {
                    type: "number",
                    required: false
                }
            }
        }
    }));
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody(new RequestMapping({}))
                                .build();

    const result : IValidationResult = validator.validate(request);

    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
});

test('Validates a request cookies with a missing property', () => {
    const validator : IValidator = new Validator(new ValidationSchema({
        types: {
            cookies: {
                foo: {
                    type: "number",
                    required: true
                }
            }
        }
    }));
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setCookies(new RequestMapping({}))
                                .build();

    const result : IValidationResult = validator.validate(request);

    expect(result.isValid()).toBeFalsy();
    expect(result.errors()).toHaveLength(1);
    expect(result.errors()[0].location).toEqual("cookies");
    expect(result.errors()[0].message).toEqual("Missing property foo");
});

test('Validates a request cookies with an optional property', () => {
    const validator : IValidator = new Validator(new ValidationSchema({
        types: {
            cookies: {
                foo: {
                    type: "number",
                    required: false
                }
            }
        }
    }));
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setCookies(new RequestMapping({}))
                                .build();

    const result : IValidationResult = validator.validate(request);

    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
});