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
	private indexes : number[];
	private isValid : boolean;
	private path : string[];

	constructor(schema : IValidationSchema) {
		this.schema = schema;
		this.errors = [];
		this.isValid = true;
		this.path = [];
		this.indexes = [];
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
		this.validateNestedTypes(mapping, typeConfiguration);
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
		this.addErrorWithLocation(message, this.getPath());
	}

	private getPath() : string {
		return this.path.join(".") + this.getIndexSuffix();
	}

	private getIndexSuffix() : string {
		let indexSuffix : string = "";
		for (const index of this.indexes) {
			indexSuffix += `[${index}]`;
		}
		return indexSuffix;
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

				if (this.isArray(fieldType)) {
					if (!Array.isArray(value)) {
						this.addError(message);
					} else {
						this.path.push(fieldName);
						this.checkTypesOfArrayElements(this.parseArrayType(fieldType), value, fieldName);
						this.path.pop();
					}
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
		return fieldType.startsWith("array");
	}

	private parseArrayType(type : string) : string[] {
		const types : string[] = [];
		while(type.includes("array[")) {
			type = type.replace("array[", "");
			types.push("array");
		}

		// remove extra array tag as we know that this field is an array
		types.pop(); 

		type = type.substring(0, type.indexOf("]"));
		types.push(type);
		return types;
	}

	private checkTypesOfArrayElements(types : string[], values : any[], fieldName : string) : void {
		for (let i : number = 0; i < values.length; i++) {
			this.indexes.push(i);
			const type : string = types[0];
			const suffix : string = this.getIndexSuffix();
			const baseSuffix : string = suffix.substring(0, suffix.lastIndexOf("["));

			if (this.isArray(type)) {
				if (!Array.isArray(values[i])) {
					this.addError(`Property '${fieldName}${suffix}' should be type '${type}'`);
				} else {
					const removedType : string = types.shift() as string;
					this.checkTypesOfArrayElements(types, values[i], fieldName);
					types.unshift(removedType);
				}
			} else {
				const message : string = `Element at index '${i}' of property '${fieldName}${baseSuffix}' should be type '${type}'`;
				if (this.isEnum(type) && !this.isTypeOf('string', values[i])) {
					this.addError(message);
				} else if (this.isUserDefinedType(type) && !this.isTypeOf('object', values[i])) {
					this.addError(message);
				} else if (this.isPrimative(type) && !this.isTypeOf(type, values[i])) {
					this.addError(message);
				}
			}
			this.indexes.pop();
		}
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

	private validateNestedTypes(mapping : IRequestMapping, type : ITypeConfiguration, ) : void {
		for (const fieldName of type.getFields()) {
			if (type.hasField(fieldName) && mapping.has(fieldName)) {
				const fieldConfiguration : IFieldConfiguration = type.getConfiguration(fieldName);
				const value : any = mapping.value(fieldName);
				
				if (this.isUserDefinedType(fieldConfiguration.type) && this.isTypeOf('object', value)) {
					this.path.push(fieldName);
					this.handleType(fieldConfiguration.type, new RequestMapping(value));
					this.path.pop();
				}
			}
		}
	}
}