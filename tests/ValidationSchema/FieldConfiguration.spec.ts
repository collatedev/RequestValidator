import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";

test('It should fail to create a field configuration due to null json', () => {
    expect(createField(null)).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to illegal json', () => {
    expect(createField(1)).toThrow(IllegalSchemaError);
});

function createField(json : any) : () => IFieldConfiguration {
    return (() : IFieldConfiguration => {
        return new FieldConfiguration(json);
    });
}