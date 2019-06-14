import ValidationSchema from "../../src/ValidationSchema/ValidationSchema";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";
import IValidationSchema from "../../src/ValidationSchema/IValidationSchema";

test('Fails to create a validation schema', () => {
    expect(createValidationSchema({})).toThrow(IllegalSchemaError);
});

test('Creates a validation schema', () => {
    const schema : any = {
        types: {

        }
    };

    expect(new ValidationSchema(schema)).not.toBeNull();
});

function createValidationSchema(json : any) : () => IValidationSchema {
    return (() : IValidationSchema => {
        return new ValidationSchema(json);
    });
}

