import Santizer from "../../src/Sanitizer/Sanitizer";
import PathBuilder from "../../src/PathBuilder/PathBuilder";
import IRequestMapping from "../../src/Request/IRequestMapping";
import RequestMapping from "../../src/Request/RequestMapping";
import ITypeConfiguration from "../../src/ValidationSchema/ITypeConfiguration";
import TypeConfiguration from "../../src/ValidationSchema/TypeConfiguration";
import IValidationResult from "../../src/ValidationResult/IValidationResult";
import ISanitizer from "../../src/Sanitizer/ISanitizer";

test("Sanitizes a string with valid length", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const mapping : IRequestMapping = new RequestMapping({
        foo: "A"
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            length: 1
        }
    });

    assertValidResult(sanitizer.sanitize(mapping, type));
});

test("Sanitizes a string with invalid length", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const mapping : IRequestMapping = new RequestMapping({
        foo: "A"
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            length: 0
        }
    });

    assertResultHasError(sanitizer.sanitize(mapping, type), "", "Length of 'foo' is 1 when it should be 0");
});

test("Sanitizes a string that does not start with foo", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const mapping : IRequestMapping = new RequestMapping({
        foo: "A"
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            startsWith: "foo"
        }
    });

    assertResultHasError(sanitizer.sanitize(mapping, type), "", "Value 'A' does not start with 'foo'");
});

test("Sanitizes a string that does start with foo", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const mapping : IRequestMapping = new RequestMapping({
        foo: "foo"
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            startsWith: "foo"
        }
    });

    assertValidResult(sanitizer.sanitize(mapping, type));
});

test("Sanitizes a string that is not a url", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const mapping : IRequestMapping = new RequestMapping({
        foo: "A"
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            isURL: true
        }
    });

    assertResultHasError(sanitizer.sanitize(mapping, type), "", "Value 'A' is not a valid URL");
});

test("Sanitizes a string that is a url", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const mapping : IRequestMapping = new RequestMapping({
        foo: "http://res.cloudinary.com/hrscywv4p/image/upload/c_fill,g_faces:" +
                "center,h_128,w_128/yflwk7vffgwyyenftkr7.png"
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "string",
            required: true,
            isURL: true
        }
    });

    assertValidResult(sanitizer.sanitize(mapping, type));
});

test("Sanitizes a number with outside of the range", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const value : number = 2;
    const mapping : IRequestMapping = new RequestMapping({
        foo: value
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "number",
            required: true,
            range: [0, 1]
        }
    });

    assertResultHasError(sanitizer.sanitize(mapping, type), "", "Value '2' is outside of the range [0, 1]");
});

test("Sanitizes a number within the range", () => {
    const sanitizer : ISanitizer = new Santizer(new PathBuilder());
    const mapping : IRequestMapping = new RequestMapping({
        foo: 1
    });
    const type : ITypeConfiguration = new TypeConfiguration({
        foo: {
            type: "number",
            required: true,
            range: [0, 1]
        }
    });

    assertValidResult(sanitizer.sanitize(mapping, type));
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