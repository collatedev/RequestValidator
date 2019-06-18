import IErrorHandler from "../../src/Validator/IErrorHandler";
import ErrorHandler from "../../src/Validator/ErrorHandler";
import IValidationError from "../../src/ValidationResult/IValidationError";
import PathBuilder from "../../src/PathBuilder/PathBuilder";
import IPathBuilder from "../../src/PathBuilder/IPathBuilder";
import PropertyPathComponent from "../../src/PathBuilder/PropertyPathComponent";

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