import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import IValidationResult from "../ValidationResult/IValidationResult";

export default interface ITypeChecker {
    typeCheck(fieldName : string, value : any, configuration : IFieldConfiguration) : IValidationResult;
}