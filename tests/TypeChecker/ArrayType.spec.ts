import IType from "../../src/TypeChecker/IType";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";
import ArrayType from "../../src/TypeChecker/ArrayType";

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