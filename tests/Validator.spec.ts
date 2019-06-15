import IValidator from '../src/IValidator';
import IValidationResult from '../src/ValidationResult/IValidationResult';
import Validator from '../src/Validator';
import TestSchema from './models/TestSchema.json';
import ValidationSchema from '../src/ValidationSchema/ValidationSchema';
import IRequestBuilder from '../src/Request/IRequestBuilder';
import RequestBuilder from '../src/Request/RequestBuilder';

test('Validates empty body', () => {
    const validator : IValidator = new Validator(new ValidationSchema(TestSchema));
    const requestBuilder : IRequestBuilder = new RequestBuilder();

    const result : IValidationResult = validator.validate(requestBuilder.build());

    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
});