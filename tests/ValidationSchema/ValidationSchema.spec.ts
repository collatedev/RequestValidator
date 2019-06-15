import ValidationSchema from "../../src/ValidationSchema/ValidationSchema";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";
import IValidationSchema from "../../src/ValidationSchema/IValidationSchema";
import ITypeConfiguration from "../../src/ValidationSchema/ITypeConfiguration";
import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";

test('Fails to create a validation schema due to null json', () => {
    expect(createValidationSchema(null)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to illegal json', () => {
    expect(createValidationSchema(1)).toThrow(IllegalSchemaError);
});

test('Fails to create a validation schema due to empty json', () => {
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

test('Creates a validation schema with an empty type', () => {
    const json : any = {
        types: {
            body: {

            }
        }
    };

    const schema : IValidationSchema = new ValidationSchema(json);
    const bodyType : ITypeConfiguration = schema.getTypeConfiguration("body");

    expect(schema).not.toBeNull();
    expect(schema.getTypes()).toHaveLength(1);
    expect(schema.hasType("body")).toBeTruthy();
    expect(bodyType).not.toBeNull();
    expect(bodyType.getFields()).toHaveLength(0);
});

test('Creates a validation schema with a non-empty type', () => {
    const json : any = {
        types: {
            body: {
                foo: {
                    required: true,
                    type: "string"
                }
            }
        }
    };

    const schema : IValidationSchema = new ValidationSchema(json);
    const bodyType : ITypeConfiguration = schema.getTypeConfiguration("body");
    const fooField : IFieldConfiguration = bodyType.getConfiguration("foo");

    expect(schema).not.toBeNull();
    expect(schema.getTypes()).toHaveLength(1);
    expect(schema.hasType("body")).toBeTruthy();
    expect(bodyType).not.toBeNull();
    expect(bodyType.getFields()).toHaveLength(1);
    expect(bodyType.getFields()[0]).toEqual("foo");
    expect(fooField.type).toEqual("string");
    expect(fooField.required).toBeTruthy();
});

function createValidationSchema(json : any) : () => IValidationSchema {
    return (() : IValidationSchema => {
        return new ValidationSchema(json);
    });
}

