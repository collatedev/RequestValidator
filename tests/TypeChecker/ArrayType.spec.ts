import IType from "../../src/Types/IType";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";
import ArrayType from "../../src/Types/ArrayType";

test("Creates a type for an array object", () => {
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "array[string]",
        required: true
    });

    const type : IType = new ArrayType(configuration, ["string"]);

    expect(type.arrayStructure()).toEqual(["string"]);
    expect(type.configuration()).toEqual(configuration);
    expect(type.getType()).toEqual("string");
});

test("Creates an array with string element configuration", () => {
    const configuration : IFieldConfiguration = ArrayType.getElementType(new FieldConfiguration({
        type: "array[string]",
        required: true,
        isURL: false,
        length: 1,
        startsWith: "foo"
    }));

    expect(configuration.type).toEqual("string");
    expect(configuration.required).toEqual(true);
    expect(configuration.isURL).toEqual(false);
    expect(configuration.length).toEqual(1);
    expect(configuration.startsWith).toEqual("foo");
});

test("Creates an array with number element configuration", () => {
    const configuration : IFieldConfiguration = ArrayType.getElementType(new FieldConfiguration({
        type: "array[number]",
        required: true,
        range: [0,1]
    }));

    expect(configuration.type).toEqual("number");
    expect(configuration.required).toEqual(true);
    expect(configuration.range).toEqual([0, 1]);
});

test("Creates an array with enum element configuration", () => {
    const configuration : IFieldConfiguration = ArrayType.getElementType(new FieldConfiguration({
        type: "array[enum]",
        required: true,
        values: ["A", "B"]
    }));

    expect(configuration.type).toEqual("enum");
    expect(configuration.required).toEqual(true);
    expect(configuration.values).toEqual(["A", "B"]);
});