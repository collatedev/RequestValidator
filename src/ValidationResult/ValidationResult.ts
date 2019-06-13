import IValidationResult from "./IValidationResult";
import IValidationError from "./IValidationError";

export default class ValidationResult implements IValidationResult {
    private readonly _isValid : boolean;
    private readonly _errors : IValidationError[];

    constructor(isValid : boolean, errors: IValidationError[]) {
        this._isValid = isValid;
        this._errors = errors;
    }

    public isValid(): boolean {
        return this._isValid;
    }   
    
    public errors(): IValidationError[] {
        return this._errors;
    }
}