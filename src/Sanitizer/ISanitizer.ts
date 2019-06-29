import IValidationResult from "../ValidationResult/IValidationResult";
import IType from "../TypeChecker/IType";

export default interface ISanitizer {
    sanitize(fieldName : string, value : any, type : IType) : IValidationResult;
}