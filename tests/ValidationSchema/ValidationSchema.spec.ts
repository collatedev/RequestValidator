import ValidationSchema from "../../src/ValidationSchema/ValidationSchema";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";

test('Fails to create a validation schema', () => {
    expect(new ValidationSchema({})).toThrow(IllegalSchemaError);
});