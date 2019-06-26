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

test('It should fail to create a field configuration because values can only be used when the type is an enum', () => {
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

test('It should create a field configuration with a value parameter', () => {
    const values : string[] = ["A", "B"];
    const json : any = {
        type: "enum",
        required: false,
        values
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);
 
    if (!configuration.values) {
        throw new Error("Values missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("enum");
    expect(configuration.values).toHaveLength(values.length);
    expect(configuration.values[0]).toEqual("A");
    expect(configuration.values[1]).toEqual("B");
});

test('It should fail to create a field configuration becuase isURL has wrong type', () => {
    expect(createField({
        type: "string",
        required: true,
        isURL: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration becuase isURL only works on strings', () => {
    expect(createField({
        type: "enum",
        required: true,
        isURL: true
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with isURL key', () => {
    const json : any = {
        type: "string",
        required: false,
        isURL: true
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.isURL) {
        throw new Error("Is URL missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("string");
    expect(configuration.isURL).toBeTruthy();
});

test('It should fail to create a field configuration becuase startsWith has wrong type', () => {
    expect(createField({
        type: "string",
        required: true,
        startsWith: 1
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration becuase startsWith only works on strings', () => {
    expect(createField({
        type: "enum",
        required: true,
        startsWith: "http://"
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with isURL key', () => {
    const json : any = {
        type: "string",
        required: false,
        startsWith: "asdf"
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.startsWith) {
        throw new Error("Starts With missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("string");
    expect(configuration.startsWith).toEqual("asdf");
});

test('It should fail to create a field configuration becuase length has wrong type', () => {
    expect(createField({
        type: "string",
        required: true,
        length: true
    })).toThrow(IllegalSchemaError);
});

test('It should fail to create a field configuration becuase length only works on strings and arrays', () => {
    expect(createField({
        type: "enum",
        required: true,
        length: 1
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration with length key for string type', () => {
    const json : any = {
        type: "string",
        required: false,
        length: 1
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.length) {
        throw new Error("Length missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("string");
    expect(configuration.length).toEqual(1);
});

test('It should create a field configuration with length key for array type', () => {
    const json : any = {
        type: "array[string]",
        required: false,
        length: 1
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.length) {
        throw new Error("Length missing from configuration");
    }

    expect(configuration.required).toBeFalsy();
    expect(configuration.type).toEqual("array[string]");
    expect(configuration.length).toEqual(1);
});

test('It should fail to create a field configuration becuase the type is enum and its missing the "values" key', () => {
    expect(createField({
        type: "enum",
        required: true,
    })).toThrow(IllegalSchemaError);
});

test('It should create a field configuration as the array is of type enum', () => {
    const json : any = {
        type: "array[enum]",
        required: true,
        values: ["A"]
    };

    const configuration : IFieldConfiguration = new FieldConfiguration(json);

    if (!configuration.values) {
        throw new Error("Length missing from configuration");
    }

    expect(configuration.required).toBeTruthy();
    expect(configuration.type).toEqual("array[enum]");
    expect(configuration.values).toEqual(["A"]);
});

function createField(json : any) : () => IFieldConfiguration {
    return (() : IFieldConfiguration => {
        return new FieldConfiguration(json);
    });
}