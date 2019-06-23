import IValidationError from "../ValidationResult/IValidationError";

export default interface ISanitizer {
    sanitize() : void;
    getErrors() : IValidationError[];
}