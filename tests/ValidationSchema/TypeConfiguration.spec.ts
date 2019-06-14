import ITypeConfiguration from "../../src/ValidationSchema/ITypeConfiguration";
import TypeConfiguration from "../../src/ValidationSchema/TypeConfiguration";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";

test('Throws an error creating an illegal type', () => {
    expect(createType(null)).toThrow(IllegalSchemaError);
});

function createType(json : any) : () => ITypeConfiguration {
    return (() : ITypeConfiguration => {
        return new TypeConfiguration(json);
    });
}