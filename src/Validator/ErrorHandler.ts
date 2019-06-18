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
        throw new Error("Method not implemented.");
    }

    public addTypeError(fieldName: string, fieldType: string): void {
        throw new Error("Method not implemented.");
    }

    public addEnumValueError(fieldName: string, enumValues: string[]): void {
        throw new Error("Method not implemented.");
    }

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public getErrors(): IValidationError[] {
        return this.errors;
    }


}