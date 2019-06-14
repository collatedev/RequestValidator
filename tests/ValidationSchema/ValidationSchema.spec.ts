import ValidationSchema from "../../src/ValidationSchema/ValidationSchema";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";
import IValidationSchema from "../../src/ValidationSchema/IValidationSchema";

test('Fails to create a validation schema', () => {
    expect(createValidationSchema).toThrow(IllegalSchemaError);
});

function createValidationSchema() : IValidationSchema {
    return new ValidationSchema({});
}