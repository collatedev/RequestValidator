import IValidator from "./IValidator";
import IValidationResult from "./ValidationResult/IValidationResult";
import IValidationSchema from "./ValidationSchema/IValidationSchema";
import IRequest from "./Request/IRequest";
import ValidationResult from "./ValidationResult/ValidationResult";
import IRequestMapping from "./Request/IRequestMapping";
import ITypeConfiguration from "./ValidationSchema/ITypeConfiguration";
import IValidationError from "./ValidationResult/IValidationError";
import IFieldConfiguration from "./ValidationSchema/IFieldConfiguration";
import RequestMapping from "./Request/RequestMapping";

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
        this.path.push(typeName);
        if (this.schema.hasType(typeName)) {
            if (mapping === null) {
                this.addErrorWithLocation(`Request is missing ${typeName}`, "[Request]");
            } else {
                this.handleType(typeName, mapping);
            }
        }
        this.path.pop();
    }

    private addErrorWithLocation(message : string, location : string) : void {
        this.isValid = false;
        this.errors.push({
            message,
            location
        });
    }

    private handleType(typeName : string, mapping : IRequestMapping) : void {
        const typeConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(typeName);
        this.checkForMissingProperties(mapping, typeConfiguration);
        this.checkForExtraProperties(mapping, typeConfiguration);
        this.checkForIncorrectTypes(mapping, typeConfiguration);
        // recurse on nested types
        for (const fieldName of typeConfiguration.getFields()) {
            if (typeConfiguration.hasField(fieldName) && mapping.has(fieldName)) {
                const fieldConfiguration : IFieldConfiguration = typeConfiguration.getConfiguration(fieldName);
                const value : any = mapping.value(fieldName);
                
                if (this.isUserDefinedType(fieldConfiguration.type) && this.isTypeOf('object', value)) {
                    this.path.push(fieldName);
                    this.handleType(fieldConfiguration.type, new RequestMapping(value));
                    this.path.pop();
                }
            }
        }
        // sanitize inputs
    }

    private checkForMissingProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        for (const field of type.getFields()) {
            const fieldConfiguration : IFieldConfiguration = type.getConfiguration(field);
            // Adds an error if and only if the mapping is missing a field and that the missing field is required
            if (!mapping.has(field) && fieldConfiguration.required) {
                this.addError(`Missing property ${field}`);
            }
        }   
    }

    private addError(message : string) : void {
        this.addErrorWithLocation(message, this.path.join("."));
    }

    private checkForExtraProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        for (const key of mapping.keys()) {
            if (!type.hasField(key)) {
                this.addError(`Unexpected property '${key}'`);
            }
        }
    }

    private checkForIncorrectTypes(mapping : IRequestMapping, type : ITypeConfiguration) : void {
        for (const fieldName of type.getFields()) {
            if (type.hasField(fieldName) && mapping.has(fieldName)) {
                const fieldConfiguration : IFieldConfiguration = type.getConfiguration(fieldName);
                const value : any = mapping.value(fieldName);
                const fieldType : string = fieldConfiguration.type;
                const message : string = `Property '${fieldName}' should be type '${fieldType}'`;

                if (this.isArray(fieldType) && !Array.isArray(value)) {
                    this.addError(message);
                } else if (this.isEnum(fieldType) && !this.isTypeOf('string', value)) {
                    this.addError(message);
                } else if (this.isUserDefinedType(fieldType) && !this.isTypeOf('object', value)) {
                    this.addError(message);
                } else if (this.isPrimative(fieldType) && !this.isTypeOf(fieldType, value)) {
                    this.addError(message);
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
        return typeof value === type;
    }

    private isUserDefinedType(fieldType : string) : boolean {
        return this.schema.hasType(fieldType);
    }

    private isPrimative(fieldType : string) : boolean {
        return fieldType === 'string' || fieldType === 'boolean' || fieldType === 'number';
    }
}