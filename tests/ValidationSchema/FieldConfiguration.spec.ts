import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";

test('It should fail to create a field configuration due to null json', () => {
    expect(createField(null)).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to illegal json', () => {
    expect(createField(1)).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to being empty json', () => {
    expect(createField({})).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to missing the type field in json', () => {
    expect(createField({
        required: true
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to missing the required field in json', () => {
    expect(createField({
        type: "string"
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration', () => {
    const json : any = {
        type: "boolean",
        required: true
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    expect(configuration.required).toBeTruthy();
    expect(configuration.type).toEqual("boolean");
})

function createField(json : any) : () => IFieldConfiguration {
    return (() : IFieldConfiguration => {
        return new FieldConfiguration(json);
    });
}