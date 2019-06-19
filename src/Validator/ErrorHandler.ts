import IErrorHandler from "./IErrorHandler";
import IValidationError from "../ValidationResult/IValidationError";
import IPathBuilder from "../PathBuilder/IPathBuilder";

export default class ErrorHandler implements IErrorHandler {
    private errors : IValidationError[];
    private pathBuilder : IPathBuilder;

    constructor(pathBuilder : IPathBuilder) {
        this.errors = [];
        this.pathBuilder = pathBuilder;
    }

    public addRootError(typeName: string): void {
        this.errors.push({
            location: "[Request]",
            message: `Request is missing '${typeName}'`
        });
    }    
    
    public addMisingPropertyError(field: string): void {
        this.errors.push({
            location: this.pathBuilder.getPath(),
            message: `Missing property '${field}'`
        });
    }

    public addUnexpectedPropertyError(field: string): void {
        this.errors.push({
            location: this.pathBuilder.getPath(),
            message: `Unexpected property '${field}'`
        });
    }

    public addTypeError(fieldName: string, fieldType: string): void {
        this.errors.push({
            location: this.pathBuilder.getPath(),
            message: `Property '${fieldName}${this.pathBuilder.getCurrentIndex()}' should be type '${fieldType}'`
        });
    }

    public addEnumValueError(fieldName: string, enumValues: string[]): void {
        this.errors.push({
            location: this.pathBuilder.getPath(),
            message: `Enum '${fieldName}' must have one of these values [${enumValues.join(", ")}]`
        });
    }

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public getErrors(): IValidationError[] {
        return this.errors;
    }
}