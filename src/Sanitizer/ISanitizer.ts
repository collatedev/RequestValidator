import IRequestMapping from "../Request/IRequestMapping";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";
import IValidationResult from "../ValidationResult/IValidationResult";

export default interface ISanitizer {
    sanitize(mapping : IRequestMapping, type : ITypeConfiguration) : IValidationResult;
}