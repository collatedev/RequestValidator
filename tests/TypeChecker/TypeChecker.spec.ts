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