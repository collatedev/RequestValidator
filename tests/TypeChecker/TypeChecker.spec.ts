import ITypeChecker from "../../src/Types/ITypeChecker";
import TypeChecker from "../../src/Types/TypeChecker";
import IValidationSchema from "../../src/ValidationSchema/IValidationSchema";
import ValidationSchema from "../../src/ValidationSchema/ValidationSchema";
import PathBuilder from "../../src/PathBuilder/PathBuilder";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IValidationResult from "../../src/ValidationResult/IValidationResult";

const EmptySchema : IValidationSchema = new ValidationSchema({
    types: {}
});

test("That the value is a string", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", "string", new FieldConfiguration({
        type: "string",
        required: true
    }));

    expectValidResult(validationResult);
});

test("That the type is not a string", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", true, new FieldConfiguration({
        type: "string",
        required: true
    }));

    expectInvalidResult(
        validationResult,
        "",
        "Property 'foo' should be type 'string'"
    );
});

test("That the value is a boolean", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", true, new FieldConfiguration({
        type: "boolean",
        required: true
    }));

    expectValidResult(validationResult);
});

test("That the type is not a boolean", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", "string", new FieldConfiguration({
        type: "boolean",
        required: true
    }));

    expectInvalidResult(
        validationResult,
        "",
        "Property 'foo' should be type 'boolean'"
    );
});

test("That the value is a number", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", 1, new FieldConfiguration({
        type: "number",
        required: true
    }));

    expectValidResult(validationResult);
});

test("That the type is not a number", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", "string", new FieldConfiguration({
        type: "number",
        required: true
    }));

    expectInvalidResult(
        validationResult,
        "",
        "Property 'foo' should be type 'number'"
    );
});

test("That the value is a enum", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", "string", new FieldConfiguration({
        type: "enum",
        required: true,
        values: ["A"]
    }));

    expectValidResult(validationResult);
});


test("That the type is not an enum", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", 1, new FieldConfiguration({
        type: "enum",
        required: true,
        values: ["A"]
    }));

    expectInvalidResult(
        validationResult,
        "",
        "Property 'foo' should be type 'enum'"
    );
});

test("That the value is a nested object", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            foo: {
            }
        }
    }));

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", {}, new FieldConfiguration({
        type: "foo",
        required: true
    }));

    expectValidResult(validationResult);
});


test("That the type is not a nested object", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            foo: {
            }
        }
    }));

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [], new FieldConfiguration({
        type: "foo",
        required: true,
    }));

    expectInvalidResult(
        validationResult,
        "",
        "Property 'foo' should be type 'foo'"
    );
});

test("That the type is an array", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [], new FieldConfiguration({
        type: "array[string]",
        required: true,
    }));

    expectValidResult(validationResult);
});


test("That the type is not an array", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", "string", new FieldConfiguration({
        type: "array[string]",
        required: true,
    }));

    expectInvalidResult(validationResult, "", "Property 'foo' should be type 'array[string]'");
});

test("That the element types of the array are strings", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", ["string"], new FieldConfiguration({
        type: "array[string]",
        required: true,
    }));

    expectValidResult(validationResult);
});

test("That the element types of the array are not strings", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [1], new FieldConfiguration({
        type: "array[string]",
        required: true,
    }));

    expectInvalidResult(validationResult, "[0]", "Property 'foo[0]' should be type 'string'");
});

test("That the element types of the array are booleans", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [true], new FieldConfiguration({
        type: "array[boolean]",
        required: true,
    }));

    expectValidResult(validationResult);
});

test("That the element types of the array are not booleans", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [1], new FieldConfiguration({
        type: "array[boolean]",
        required: true,
    }));

    expectInvalidResult(validationResult, "[0]", "Property 'foo[0]' should be type 'boolean'");
});

test("That the element types of the array are numbers", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [1], new FieldConfiguration({
        type: "array[number]",
        required: true,
    }));

    expectValidResult(validationResult);
});

test("That the element types of the array are not numbers", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [true], new FieldConfiguration({
        type: "array[number]",
        required: true,
    }));

    expectInvalidResult(validationResult, "[0]", "Property 'foo[0]' should be type 'number'");
});

test("That the element types of the array are enums", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", ["A"], new FieldConfiguration({
        type: "array[enum]",
        required: true,
        values: ["A"]
    }));

    expectValidResult(validationResult);
});

test("That the element types of the array are not enums", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [1], new FieldConfiguration({
        type: "array[enum]",
        required: true,
        values: ["A"]
    }));

    expectInvalidResult(validationResult, "[0]", "Property 'foo[0]' should be type 'enum'");
});

test("That the element types of the array are nested objects", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            foo: {
            }
        }
    }));

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [{}], new FieldConfiguration({
        type: "array[foo]",
        required: true,
    }));

    expectValidResult(validationResult);
});

test("That the element types of the array are not nested objects", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            foo: {
            }
        }
    }));

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [1], new FieldConfiguration({
        type: "array[foo]",
        required: true,
    }));

    expectInvalidResult(validationResult, "[0]", "Property 'foo[0]' should be type 'foo'");
});

test("That the nested object fields of an array have correct types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            foo: {
                bar: {
                    type: "string",
                    required: true
                }
            }
        }
    }));

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [{
        bar: "baz"
    }], new FieldConfiguration({
        type: "array[foo]",
        required: true,
    }));

    expectValidResult(validationResult);
});

test("That the nested object fields of an array do not have correct types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), new ValidationSchema({
        types: {
            foo: {
                bar: {
                    type: "string",
                    required: true
                }
            }
        }
    }));

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [{
        bar: true
    }], new FieldConfiguration({
        type: "array[foo]",
        required: true,
    }));

    expectInvalidResult(validationResult, "[0].bar", "Property 'bar' should be type 'string'");
});

test("That the nested arrays do not have correct element types", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [
        ["1", "1"],
        ["1", 0]
    ], new FieldConfiguration({
        type: "array[array[string]]",
        required: true,
    }));

    expectInvalidResult(validationResult, "[1][1]", "Property 'foo[1][1]' should be type 'string'");
});

test("That the value is any type", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [
        ["1", "1"],
        ["1", 0]
    ], new FieldConfiguration({
        type: "any",
        required: true,
    }));

    expectValidResult(validationResult);
});

test("That the value is an array of any typed elements", () => {
    const typeChecker : ITypeChecker = new TypeChecker(new PathBuilder(), EmptySchema);

    const validationResult : IValidationResult = typeChecker.typeCheck("foo", [
        ["1", "1"],
        ["1", 0]
    ], new FieldConfiguration({
        type: "array[any]",
        required: true,
    }));

    expectValidResult(validationResult);
});

function expectValidResult(validationResult : IValidationResult) : void {
    expect(validationResult.isValid()).toBeTruthy();
    expect(validationResult.errors().length).toEqual(0);
}

function expectInvalidResult(validationResult : IValidationResult, location : string, message : string) : void {
    expect(validationResult.isValid()).toBeFalsy();
    expect(validationResult.errors().length).toEqual(1);
    expect(validationResult.errors()[0].location).toEqual(location);
    expect(validationResult.errors()[0].message).toEqual(message);
}