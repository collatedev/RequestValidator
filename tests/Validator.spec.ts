import IValidator from '../src/IValidator';
import IValidationResult from '../src/ValidationResult/IValidationResult';
import FakeRequest from './FakeRequest';
import Validator from '../src/Validator';

import TestSchema from './TestSchema.json';
import ValidationSchema from '../src/ValidationSchema/ValidationSchema';

test('Validates empty body', () => {
    const validator : IValidator = new Validator(new ValidationSchema(TestSchema));

    const result : IValidationResult = validator.validate(new FakeRequest());

    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
});