import IType from "../../src/Types/IType";
import Type from "../../src/Types/Type";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";

test("Creates a type for a non array object", () => {
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "string",
        required: true
    });

    const type : IType = new Type(configuration);

    expect(type.arrayStructure()).toEqual([]);
    expect(type.configuration()).toEqual(configuration);
    expect(type.getType()).toEqual("string");
});