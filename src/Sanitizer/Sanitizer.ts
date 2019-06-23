import ISanitizer from "./ISanitizer";
import IValidationError from "../ValidationResult/IValidationError";
import IValidationSchema from "../ValidationSchema/IValidationSchema";
import IRequestMapping from "../Request/IRequestMapping";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";

export default class Santizer implements ISanitizer {
    private readonly schema : IValidationSchema;

    constructor(schema : IValidationSchema) {
        this.schema = schema;
    }

    public sanitize(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        throw new Error("Method not implemented");
    }

    public getErrors() : IValidationError[] {
        throw new Error("Method not implemented");
    }
}