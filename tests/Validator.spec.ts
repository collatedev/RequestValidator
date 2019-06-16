import IValidator from '../src/IValidator';
import IValidationResult from '../src/ValidationResult/IValidationResult';
import Validator from '../src/Validator';
import ValidationSchema from '../src/ValidationSchema/ValidationSchema';
import IRequestBuilder from '../src/Request/IRequestBuilder';
import RequestBuilder from '../src/Request/RequestBuilder';
import IRequest from '../src/Request/IRequest';
import RequestMapping from '../src/Request/RequestMapping';

import ValidatorTestSchemas from './models/ValidatorTestSchemas.json';

test('Validates empty body', () => {
    const schemaIndex : number = 0;
    const validator : IValidator = getValidator(schemaIndex);
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody(new RequestMapping({}))
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request body', () => {
    const schemaIndex : number = 1;
    const validator : IValidator = getValidator(schemaIndex);

    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody(new RequestMapping({ foo : 1 }))
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request body with a missing property', () => {
    const schemaIndex : number = 2;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody(new RequestMapping({}))
                                .build();

    assertResultHasError(validator.validate(request), "body", "Missing property foo");
});

test('Validates a request body with an optional property', () => {
    const schemaIndex : number = 3;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody(new RequestMapping({}))
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request cookies with a missing property', () => {
    const schemaIndex : number = 4;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setCookies(new RequestMapping({}))
                                .build();

    assertResultHasError(validator.validate(request), "cookies", "Missing property foo");
});

test('Validates a request cookies with an optional property', () => {
    const schemaIndex : number = 5;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setCookies(new RequestMapping({}))
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a requests headers with a missing property', () => {
    const schemaIndex : number = 6;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setHeaders(new RequestMapping({}))
                                .build();

    assertResultHasError(validator.validate(request), "headers", "Missing property foo");
});

test('Validates a request headers with an optional property', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setHeaders(new RequestMapping({}))
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request params with a missing property', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setParams(new RequestMapping({}))
                                .build();

    assertResultHasError(validator.validate(request), "params", "Missing property foo");
});

test('Validates a request params with an optional property', () => {
    const schemaIndex : number = 9;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setParams(new RequestMapping({}))
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request query with a missing property', () => {
    const schemaIndex : number = 10;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setQuery(new RequestMapping({}))
                                .build();

    assertResultHasError(validator.validate(request), "query", "Missing property foo");
});

test('Validates a request query with an optional property', () => {
    const schemaIndex : number = 11;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setQuery(new RequestMapping({}))
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request thats missing a body', () => {
    const schemaIndex : number = 0;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();

    assertResultHasError(validator.validate(requestBuilder.build()), "[Request]", "Request is missing body");
});

test('Validates a request thats missing cookies', () => {
    const schemaIndex : number = 4;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();

    assertResultHasError(validator.validate(requestBuilder.build()), "[Request]", "Request is missing cookies");
});

test('Validates a request thats missing headers', () => {
    const schemaIndex : number = 6;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();

    assertResultHasError(validator.validate(requestBuilder.build()), "[Request]", "Request is missing headers");
});

test('Validates a request thats missing params', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();

    assertResultHasError(validator.validate(requestBuilder.build()), "[Request]", "Request is missing params");
});

test('Validates a request thats missing query', () => {
    const schemaIndex : number = 10;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();

    assertResultHasError(validator.validate(requestBuilder.build()), "[Request]", "Request is missing query");
});

function getValidator(schemaIndex : number) : IValidator {
    return new Validator(new ValidationSchema(ValidatorTestSchemas.schemas[schemaIndex]));
}

function assertValidResult(result : IValidationResult) : void {
    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
}

function assertResultHasError(result : IValidationResult, location: string, message : string) : void {
    expect(result.isValid()).toBeFalsy();
    expect(result.errors()).toHaveLength(1);
    expect(result.errors()[0].location).toEqual(location);
    expect(result.errors()[0].message).toEqual(message);
}