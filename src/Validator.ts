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

        this.handleRootTypes("body", request.getBody());
        this.handleRootTypes("cookies", request.getCookies());
        this.handleRootTypes("headers", request.getHeaders());
        this.handleRootTypes("params", request.getParams());
        this.handleRootTypes("query", request.getQuery());
        return new ValidationResult(this.isValid, this.errors);
    }

    private handleRootTypes(typeName : string, mapping : IRequestMapping | null) : void {
        if (this.schema.hasType(typeName)) {
            if (mapping === null) {
                this.addError(`Request is missing ${typeName}`, "[Request]");
            } else {
                this.handleType(typeName, mapping);
            }
        }
    }

    private addError(message : string, location : string) : void {
        this.isValid = false;
        this.errors.push({
            message,
            location
        });
    }

    private handleType(typeName : string, mapping : IRequestMapping) : void {
        this.path.push(typeName);
        const typeConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(typeName);
        this.checkForMissingProperties(mapping, typeConfiguration);
        this.checkForExtraProperties(mapping, typeConfiguration);
        this.checkForIncorrectTypes(mapping, typeConfiguration);
        // recurse on nested types
        // sanitize inputs
        this.path.pop();
    }

    private pathToString() : string {
        return this.path.join(".");
    }

    private checkForMissingProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        for (const field of type.getFields()) {
            const fieldConfiguration : IFieldConfiguration = type.getConfiguration(field);
            // Adds an error if and only if the mapping is missing a field and that the missing field is required
            if (!mapping.has(field) && fieldConfiguration.required) {
                this.addError(`Missing property ${field}`, this.pathToString());
            }
        }   
    }

    private checkForExtraProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        for (const key of mapping.keys()) {
            if (!type.hasField(key)) {
                this.addError(`Unexpected property '${key}'`, this.pathToString());
            }
        }
    }

    private checkForIncorrectTypes(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        for (const fieldName of type.getFields()) {
            if (type.hasField(fieldName)) {
                const fieldConfiguration : IFieldConfiguration = type.getConfiguration(fieldName);
                if (mapping.has(fieldName)) {
                    const value : any = mapping.value(fieldName);
                    const fieldType : string = fieldConfiguration.type.toLowerCase();
                    const message : string = `Property '${fieldName}' should be type '${fieldType}'`;

                    if (this.isArray(fieldType) && !Array.isArray(value)) {
                        this.addError(message, this.pathToString());
                    } else if (this.isEnum(fieldType) && !this.isTypeOf('string', value)) {
                        this.addError(message, this.pathToString());
                    } else if (this.isPrimative(fieldConfiguration) && !this.isTypeOf(fieldType, value)) {
                        this.addError(message, this.pathToString());
                    }
                }
            }
        }
    }

    private isArray(fieldType : string) : boolean {
        return fieldType === "array";
    }

    private isEnum(fieldType : string) : boolean {
        return fieldType === "enum";
    }

    private isTypeOf(type : string, value : any) : boolean {
        return typeof value === type.toLowerCase();
    }

    private isPrimative(fieldConfiguration : IFieldConfiguration) : boolean {
        const typeName : string = fieldConfiguration.type.toLowerCase();
        return typeName === 'string' || typeName === 'boolean' || typeName === 'number';
    }
}