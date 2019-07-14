import IValidationResult from "../ValidationResult/IValidationResult";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";

export default interface ISanitizer {
    sanitize(fieldName : string, value : any, configuration : IFieldConfiguration) : IValidationResult;
}