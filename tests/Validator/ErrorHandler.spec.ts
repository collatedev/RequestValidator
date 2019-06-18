import IErrorHandler from "../../src/Validator/IErrorHandler";
import ErrorHandler from "../../src/Validator/ErrorHandler";
import IValidationError from "../../src/ValidationResult/IValidationError";
import PathBuilder from "../../src/PathBuilder/PathBuilder";
import IPathBuilder from "../../src/PathBuilder/IPathBuilder";
import PropertyPathComponent from "../../src/PathBuilder/PropertyPathComponent";
import IndexPathComponent from "../../src/PathBuilder/IndexPathComponent";

test("Checks that there are no errors on the handler", () => {
    const errorHandler : IErrorHandler = new ErrorHandler(new PathBuilder());

    expect(errorHandler.getErrors()).toHaveLength(0);
    expect(errorHandler.hasErrors()).toBeFalsy();
});

test("Adds a root error to the error handler", () => {
    const errorHandler : IErrorHandler = new ErrorHandler(new PathBuilder());

    errorHandler.addRootError("foo");

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("[Request]");
    expect(errors[0].message).toEqual("Request is missing 'foo'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a missing property error to the error handler", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    const errorHandler : IErrorHandler = new ErrorHandler(pathBuilder);

    errorHandler.addMisingPropertyError("bar");

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo");
    expect(errors[0].message).toEqual("Missing property 'bar'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a unexpected property error to the error handler", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    const errorHandler : IErrorHandler = new ErrorHandler(pathBuilder);

    errorHandler.addUnexpectedPropertyError("bar");

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo");
    expect(errors[0].message).toEqual("Unexpected property 'bar'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a type error to the error handler", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));
    const errorHandler : IErrorHandler = new ErrorHandler(pathBuilder);

    errorHandler.addTypeError("bar", "string");

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo.bar");
    expect(errors[0].message).toEqual("Property 'bar' should be type 'string'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a type error to the error handler at an index", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));
    pathBuilder.addPathComponent(new IndexPathComponent(1));
    const errorHandler : IErrorHandler = new ErrorHandler(pathBuilder);

    errorHandler.addTypeError("bar", "string");

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo.bar[1]");
    expect(errors[0].message).toEqual("Property 'bar[1]' should be type 'string'");
    expect(errorHandler.hasErrors()).toBeTruthy();
});

test("Adds a enum value to the error handler at an index", () => {
    const pathBuilder : IPathBuilder = new PathBuilder();
    pathBuilder.addPathComponent(new PropertyPathComponent("foo"));
    pathBuilder.addPathComponent(new PropertyPathComponent("bar"));
    const errorHandler : IErrorHandler = new ErrorHandler(pathBuilder);

    errorHandler.addEnumValueError("bar", ["A"]);

    const errors : IValidationError[] = errorHandler.getErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0].location).toEqual("foo.bar");
    expect(errors[0].message).toEqual("Enum 'bar' must have one of these values [A]");
    expect(errorHandler.hasErrors()).toBeTruthy();
});