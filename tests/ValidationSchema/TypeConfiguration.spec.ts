import ITypeConfiguration from "../../src/ValidationSchema/ITypeConfiguration";
import TypeConfiguration from "../../src/ValidationSchema/TypeConfiguration";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";
import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";

test('Throws an error creating an illegal type', () => {
    expect(createType(null)).toThrow(IllegalSchemaError);
});

test('Creates an empty type', () => {
    const type : ITypeConfiguration = new TypeConfiguration({});

    expect(type.getFields()).toHaveLength(0);
});

test('Creates a type with a field', () => {
    const json : any = {
        foo: {
            required: true,
            type: "string"
        }
    };

    const type : ITypeConfiguration = new TypeConfiguration(json);
    const fooField : IFieldConfiguration = type.getConfiguration("foo");

    expect(type.getFields()).toHaveLength(1);
    expect(fooField).not.toBeNull();
    expect(fooField.required).toBeTruthy();
    expect(fooField.type).toEqual("string");
})

function createType(json : any) : () => ITypeConfiguration {
    return (() : ITypeConfiguration => {
        return new TypeConfiguration(json);
    });
}