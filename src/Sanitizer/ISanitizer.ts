import IValidationError from "../ValidationResult/IValidationError";
import IRequestMapping from "../Request/IRequestMapping";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";

export default interface ISanitizer {
    sanitize(mapping : IRequestMapping, type : ITypeConfiguration) : void;
    getErrors() : IValidationError[];
}