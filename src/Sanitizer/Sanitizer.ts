import ISanitizer from "./ISanitizer";
import IRequestMapping from "../Request/IRequestMapping";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";
import IValidationResult from "../ValidationResult/IValidationResult";
import ValidationResult from "../ValidationResult/ValidationResult";
import IErrorHandler from "../ErrorHandler/IErrorHandler";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import ValidatorErrorHandler from "../ErrorHandler/ValidatorErrorHandler";

export default class Santizer implements ISanitizer {
    private result : IValidationResult;
    private errorHandler : IErrorHandler;

    constructor(pathBuilder : IPathBuilder) {
        this.errorHandler = new ValidatorErrorHandler(pathBuilder);
        this.result = new ValidationResult(this.errorHandler);
    }

    public sanitize(mapping : IRequestMapping, type : ITypeConfiguration) : IValidationResult {
        return this.result;
    }
}
