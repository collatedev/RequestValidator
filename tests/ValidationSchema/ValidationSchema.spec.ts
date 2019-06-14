import ValidationSchema from "../../src/ValidationSchema/ValidationSchema";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";
import IValidationSchema from "../../src/ValidationSchema/IValidationSchema";

test('Fails to create a validation schema', () => {
    expect(createValidationSchema({})).toThrow(IllegalSchemaError);
});

test('Creates a validation schema', () => {
    const json : any = {
        types: {

        }
    };

    const schema : IValidationSchema = new ValidationSchema(json);

    expect(schema).not.toBeNull();
    expect(schema.getTypes()).toHaveLength(0);
});

function createValidationSchema(json : any) : () => IValidationSchema {
    return (() : IValidationSchema => {
        return new ValidationSchema(json);
    });
}

