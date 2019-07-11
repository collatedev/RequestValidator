import Santizer from "../../src/Sanitizer/Sanitizer";
import PathBuilder from "../../src/PathBuilder/PathBuilder";
import IValidationResult from "../../src/ValidationResult/IValidationResult";
import ISanitizer from "../../src/Sanitizer/ISanitizer";
import FieldConfiguration from "../../src/ValidationSchema/FieldConfiguration";
import IFieldConfiguration from "../../src/ValidationSchema/IFieldConfiguration";
import Type from "../../src/TypeChecker/Type";

test("Sanitizes a string with valid length", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "string",
        required: true,
        length: 1
    });

    assertValidResult(sanitizer.sanitize("foo", "A", new Type(configuration)));
});

test("Sanitizes a string with invalid length", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "string",
        required: true,
        length: 0
    });

    assertResultHasError(
        sanitizer.sanitize("foo", "A", new Type(configuration)), "", "Length of 'foo' is 1 when it should be 0"
    );
});

test("Sanitizes a string that does not start with foo", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "string",
        required: true,
        startsWith: "foo"
    });

    assertResultHasError(
        sanitizer.sanitize("foo", "A", new Type(configuration)), "", "Value 'A' does not start with 'foo'"
    );
});

test("Sanitizes a string that does start with foo", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "string",
        required: true,
        startsWith: "foo"
    });

    assertValidResult(sanitizer.sanitize("foo", "foo", new Type(configuration)));
});

test("Sanitizes a string that is not a url", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "string",
        required: true,
        isURL: true
    });

    assertResultHasError(sanitizer.sanitize("foo", "A", new Type(configuration)), "", "Value 'A' is not a valid URL");
});

test("Sanitizes a string that is a url", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "string",
        required: true,
        isURL: true
    });

    assertValidResult(
        sanitizer.sanitize(
            "foo", 
            "http://res.cloudinary.com/hrscywv4p/image/upload/c_fill," +
            "g_faces:center,h_128,w_128/yflwk7vffgwyyenftkr7.png", 
            new Type(configuration)
        )
    );
});

test("Sanitizes a number with outside of the range", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const value : number = 2;
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "number",
        required: true,
        range: [0, 1]
    });

    assertResultHasError(
        sanitizer.sanitize("foo", value, new Type(configuration)), 
        "", 
        "Value '2' is outside of the range [0, 1]"
    );
});

test("Sanitizes a number within the range", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "number",
        required: true,
        range: [0, 1]
    });

    assertValidResult(sanitizer.sanitize("foo", 1, new Type(configuration)));
});

test("Sanitizes an enum with with an unknown enum value", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "enum",
        required: true,
        values: ["foo", "bar"]
    });

    assertResultHasError(
        sanitizer.sanitize("foo", "A", new Type(configuration)),
        "", 
        "Illegal enum value 'A', acceptable values are 'foo, bar'"
    );
});

test("Sanitizes an enum with with an known enum value", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "enum",
        required: true,
        values: ["A", "B"]
    });

    assertValidResult(sanitizer.sanitize("foo", "A", new Type(configuration)));
});

test("Sanitizes an array with an incorrect length", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "array[string]",
        required: true,
        arrayLengths: [0]
    });

    assertResultHasError(
        sanitizer.sanitize("foo", ["foo"], new Type(configuration)), 
        "", 
        "Array length of 'foo' is 1 when it should be 0"
    );
});

test("Sanitizes a nested array with an incorrect length", () => {
    const nestedLength : number = 6;
    const baseLength : number = 2;
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "array[array[array[string]]]",
        required: true,
        arrayLengths: [baseLength, nestedLength, 1]
    });

    assertResultHasError(
        sanitizer.sanitize("foo", [
            [["0"],["1"],["2"],["3"],["4"], ["5"]],
            [["0"],["1"],["2"],["3"],["4"], []],
        ], new Type(configuration)), 
        "", 
        "Array length of 'foo[1][5]' is 0 when it should be 1"
    );
});

test("Sanitizes an array with a correct length", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "array[string]",
        required: true,
        arrayLengths: [0]
    });

    assertValidResult(sanitizer.sanitize("foo", [], new Type(configuration)));
});

test("Sanitizes an array with a string that is not a url", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const configuration : IFieldConfiguration = new FieldConfiguration({
        type: "array[string]",
        required: true,
        isURL: true
    });

    assertResultHasError(
        sanitizer.sanitize("foo", ["http://foo.com", "bar"], new Type(configuration)),
        "[1]",
        "Value 'bar' is not a valid URL"
    );
});

function assertValidResult(result : IValidationResult) : void {
    expect(result.isValid()).toBeTruthy();
    expect(result.errors()).toHaveLength(0);
}

function assertResultHasError(result : IValidationResult, location: string, message : string) : void {
    expect(result.isValid()).toBeFalsy();
    expect(result.errors()).toHaveLength(1);
    expect(result.errors()[0].location).toEqual(location);
    expect(result.errors()[0].message).toEqual(message);
}