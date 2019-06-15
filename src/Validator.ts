import IValidator from "./IValidator";
import IValidationResult from "./ValidationResult/IValidationResult";
import IValidationSchema from "./ValidationSchema/IValidationSchema";
import IRequest from "./Request/IRequest";
import ValidationResult from "./ValidationResult/ValidationResult";
import IRequestMapping from "./Request/IRequestMapping";
import ITypeConfiguration from "./ValidationSchema/ITypeConfiguration";
import IValidationError from "./ValidationResult/IValidationError";
import IFieldConfiguration from "./ValidationSchema/IFieldConfiguration";

export default class Validator implements IValidator {
    private readonly schema : IValidationSchema;

    private errors : IValidationError[];
    private isValid : boolean;
    private path : string[];

    constructor(schema : IValidationSchema) {
        this.schema = schema;
        this.errors = [];
        this.isValid = true;
        this.path = [];
    }

    public validate(request : IRequest) : IValidationResult {
        this.isValid = true;
        this.errors = [];
        this.path = [];

        if (this.schema.hasType("body")) {
            this.handleType("body", request.getBody());
        }
        if (this.schema.hasType("cookies")) {
            this.handleType("cookies", request.getCookies());
        }
        return new ValidationResult(this.isValid, this.errors);
    }

    private handleType(type : string, mapping : IRequestMapping) : void {
        this.path.push(type);
        this.checkForMissingProperties(mapping, this.schema.getTypeConfiguration(type));
        this.path.pop();
    }

    private checkForMissingProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        const fields : string[] = type.getFields();
        for (const field of fields) {
            const fieldConfiguration : IFieldConfiguration = type.getConfiguration(field);
            if (!mapping.has(field) && fieldConfiguration.required) {
                this.isValid = false;
                this.errors.push({
                    message: `Missing property ${field}`,
                    location: this.path.join(".")
                });
            }
        }   
    }
}