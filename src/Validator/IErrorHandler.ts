import IValidationError from "../ValidationResult/IValidationError";

export default interface IErrorHandler {
    addRootError(typeName : string) : void;
    addMisingPropertyError(field : string) : void;
    addUnexpectedPropertyError(field : string) : void;
    addTypeError(fieldName : string, fieldType : string) : void;
    addEnumValueError(fieldName : string, enumValues : string[]) : void;
    hasErrors() : boolean;
    getErrors() : IValidationError[];
}