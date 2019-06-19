import IValidationResult from "./IValidationResult";
import IValidationError from "./IValidationError";
import IErrorHandler from "../Validator/IErrorHandler";

export default class ValidationResult implements IValidationResult {
    private readonly _isValid : boolean;
    private readonly _errors : IValidationError[];

    constructor(errorHandler : IErrorHandler) {
        this._isValid = !errorHandler.hasErrors();
        this._errors = errorHandler.getErrors();
    }

    public isValid(): boolean {
        return this._isValid;
    }   
    
    public errors(): IValidationError[] {
        return this._errors;
    }
}