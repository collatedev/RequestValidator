import IValidationResult from "./IValidationResult";

export default interface IValidator {
    validate(): IValidationResult;
}