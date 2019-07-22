import IValidationResult from "../ValidationResult/IValidationResult";
import IRequest from "../Request/IRequest";

export default interface IValidator {
    validate(request : IRequest, rawSchema : any) : IValidationResult;
}