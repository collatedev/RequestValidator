import ITypeChecker from "./ITypeChecker";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import IValidationResult from "../ValidationResult/IValidationResult";
import IValidationSchema from "../ValidationSchema/IValidationSchema";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import PathBuilder from "../PathBuilder/PathBuilder";
import IsType from "./IsType";
import ValidationResult from "../ValidationResult/ValidationResult";
import ValidatorErrorHandler from "../ErrorHandler/ValidatorErrorHandler";
import ErrorType from "../ErrorHandler/ErrorType";

export default class TypeChecker implements ITypeChecker {
    private readonly schema : IValidationSchema;
    private readonly pathBuilder : IPathBuilder;

    private validationResult : IValidationResult;
    private errorHandler : ValidatorErrorHandler;

    constructor(pathBuilder : IPathBuilder, schema : IValidationSchema) {
        this.schema = schema;
        this.pathBuilder = new PathBuilder();
        this.errorHandler = new ValidatorErrorHandler(pathBuilder);
        this.validationResult = new ValidationResult(this.errorHandler);
    }

    public typeCheck(fieldName : string, value : any, configuration : IFieldConfiguration) : IValidationResult {
        this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
        this.validationResult = new ValidationResult(this.errorHandler);

        if (IsType.isPrimative(configuration.type) && !IsType.isTypeOf(configuration.type, value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        } else if (IsType.isEnum(configuration.type) && !IsType.isTypeOf("string", value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        }  else if (IsType.isArray(configuration.type)) {
            // handle arrays
        } else if (this.schema.hasType(configuration.type) && !IsType.isNestedObject(value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        } 

        return this.validationResult;
    }
}