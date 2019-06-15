import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IllegalSchemaError from "../../src/ValidationSchema/IllegalSchemaError";

const RangeLength : number = 2;

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

test('It should fail to create a field configuration due to inncorrect type of "type" key in json', () => {
    expect(createField({
        type: 1,
        required: true
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of "type" key in json', () => {
    expect(createField({
        type: "string",
        required: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to unknown fields being defined in the json', () => {
    expect(createField({
        type: "string",
        required: true,
        foo: "bar"
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration', () => {
    const json : any = {
        type: "boolean",
        required: false
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("boolean");
});

test('It should fail to create a field configuration due to inncorrect type of "range" key in json', () => {
    expect(createField({
        type: "string",
        required: true,
        range: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect length of range array', () => {
    expect(createField({
        type: "string",
        required: true,
        range: []
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of the first index', () => {
    expect(createField({
        type: "string",
        required: true,
        range: ["1", 1]
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of the second index', () => {
    expect(createField({
        type: "string",
        required: true,
        range: [1, "1"]
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with a range parameter', () => {
    const json : any = {
        type: "boolean",
        required: false,
        range: [0, 1]
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);
 
    if (!configuration.range) {
        throw new Error("Range missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("boolean");
    expect(configuration.range).toHaveLength(RangeLength);
    expect(configuration.range[0]).toEqual(0);
    expect(configuration.range[1]).toEqual(1);
});

test('It should fail to create a field configuration becuase values can only be used when the type is an enum', () => {
    expect(createField({
        type: "string",
        required: true,
        values: ["test"]
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to inncorrect type of "values" key in json', () => {
    expect(createField({
        type: "enum",
        required: true,
        values: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to "values" being empty', () => {
    expect(createField({
        type: "enum",
        required: true,
        values: []
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration due to "values" not consisting of string values', () => {
    expect(createField({
        type: "enum",
        required: true,
        values: ["a", 1, "b"]
    })).toThrow(IllegalSchemaError);
});

function createField(json : any) : () => IFieldConfiguration {
    return (() : IFieldConfiguration => {
        return new FieldConfiguration(json);
    });
}