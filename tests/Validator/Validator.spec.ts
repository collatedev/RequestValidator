import IValidator from '../../src/Validator/IValidator';
import IValidationResult from '../../src/ValidationResult/IValidationResult';
import Validator from '../../src/Validator/Validator';
import ValidationSchema from '../../src/ValidationSchema/ValidationSchema';
import IRequestBuilder from '../../src/Request/IRequestBuilder';
import RequestBuilder from '../../src/Request/RequestBuilder';
import IRequest from '../../src/Request/IRequest';

import ValidatorTestSchemas from '../models/ValidatorTestSchemas.json';

test('Validates empty body', () => {
    const schemaIndex : number = 0;
    const validator : IValidator = getValidator(schemaIndex);
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.build();

    assertValidResult(validator.validate(request));
});

test('Validates a body that is a number', () => {
    const schemaIndex : number = 14;
    const validator : IValidator = getValidator(schemaIndex);
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder.setBody(1).build();

    assertValidResult(validator.validate(request));
});


test('Validates a request with incorrect custom type', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: 1
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body.foo", "Property 'foo' should be type 'bar'");
});

test('Validates a request with incorrect nested custom type', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: {
                                        baz: "a"
                                    }
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body.foo.baz", "Property 'baz' should be type 'number'");
});

test('Validates a request with correct nested custom type', () => {
    const schemaIndex : number = 8;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: {
                                        baz: 1
                                    }
                                })
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request body', () => {
    const schemaIndex : number = 1;
    const validator : IValidator = getValidator(schemaIndex);

    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({ foo : 1 })
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request body with a missing property', () => {
    const schemaIndex : number = 2;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({})
                                .build();

    assertResultHasError(validator.validate(request), "body", "Missing property 'foo'");
});

test('Validates a request body with an optional property', () => {
    const schemaIndex : number = 3;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({})
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request body with extra properties', () => {
    const schemaIndex : number = 13;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
									foo: 1,
                                    bar: "baz"
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body", "Unexpected property 'bar'");
});

test('Validates a request with incorrect number type', () => {
    const schemaIndex : number = 1;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    foo: true
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body.foo", "Property 'foo' should be type 'number'");
});

test('Validates a request with incorrect string type', () => {
    const schemaIndex : number = 4;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: true
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body.bar", "Property 'bar' should be type 'string'");
});

test('Validates a request with incorrect boolean type', () => {
    const schemaIndex : number = 5;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: 1
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body.bar", "Property 'bar' should be type 'boolean'");
});

test('Validates a request with incorrect enum type', () => {
    const schemaIndex : number = 6;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: 1
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body.bar", "Property 'bar' should be type 'enum'");
});

test('Validates a request with correct enum type', () => {
    const schemaIndex : number = 6;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: "A"
                                })
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request with incorrect array type', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: 1
                                })
                                .build();

    assertResultHasError(validator.validate(request), "body.bar", "Property 'bar' should be type 'array[string]'");
});

test('Validates a request with an empty array', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: []
                                })
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request with an array that has incorrect element types', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [1]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request), 
        "body.bar[0]", 
        "Property 'bar[0]' should be type 'string'"
    );
});

test('Validates a request with a nested array that has an incorrect structure', () => {
    const schemaIndex : number = 9;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [1]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request), 
        "body.bar[0]", 
        "Property 'bar[0]' should be type 'array'"
    );
});

test('Validates a request with an array that has nested arrays', () => {
    const schemaIndex : number = 9;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[1]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request), 
        "body.bar[0][0]", 
        "Property 'bar[0][0]' should be type 'string'"
    );
});

test('Validates a request with an array that has nested arrays', () => {
    const schemaIndex : number = 9;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [["A", "B"]]
                                })
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request with an array that has nested arrays of enums', () => {
    const schemaIndex : number = 10;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [["A", "B"]]
                                })
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request with nested arrays expecting a nested type', () => {
    const schemaIndex : number = 11;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[false]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request), 
        "body.bar[0][0]", 
        "Property 'bar[0][0]' should be type 'foo'"
    );
});

test('Validates a request with with nested arrays and finds an error on the baz property', () => {
    const schemaIndex : number = 11;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: false
                                    }]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request), 
        "body.bar[0][0].baz", 
        "Property 'baz' should be type 'number'"
    );
});

test('Validates a request with with nested arrays of nested types', () => {
    const schemaIndex : number = 11;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: 1
                                    }]]
                                })
                                .build();

    assertValidResult(validator.validate(request));
});

test('Validates a request with with nested arrays and finds an error on the quux property', () => {
    const schemaIndex : number = 12;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: false
                                    }]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request), 
        "body.bar[0][0].baz", 
        "Property 'baz' should be type 'qux'"
    );
});

test('Validates a request with with nested arrays and finds an error on the quux property', () => {
    const schemaIndex : number = 12;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: {
                                            quux: false
                                        }
                                    }]]
                                })
                                .build();

    assertResultHasError(
        validator.validate(request), 
        "body.bar[0][0].baz.quux", 
        "Property 'quux' should be type 'number'"
    );
});

test('Validates a request with with nested arrays of nested types', () => {
    const schemaIndex : number = 12;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: [[{
                                        baz: {
                                            quux: 1
                                        }
                                    }]]
                                })
                                .build();

    assertValidResult(validator.validate(request));
});


test('Validates a request with an array that has a correct array', () => {
    const schemaIndex : number = 7;
    const validator : IValidator = getValidator(schemaIndex);
    
    const requestBuilder : IRequestBuilder = new RequestBuilder();
    const request : IRequest = requestBuilder
                                .setBody({
                                    bar: ["A"]
                                })
                                .build();

    assertValidResult(validator.validate(request));
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