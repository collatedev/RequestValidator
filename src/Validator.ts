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
import IPathComponent from "./PathBuilder/IPathComponent";
import PropertyPathComponent from "./PathBuilder/PropertyPathComponent";
import IndexPathComponent from "./PathBuilder/IndexPathComponent";

export default class Validator implements IValidator {
	private readonly schema : IValidationSchema;

	private errors : IValidationError[];
	private isValid : boolean;
	private path : IPathComponent[];

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
		this.path.push(new PropertyPathComponent(typeName));
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
		let path : string = "";
		for (const component of this.path) {
			path += component.toString();
		}
		if (path.startsWith(".")) {
			path = path.substring(1, path.length);
		}
		return path;
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
				this.path.push(new PropertyPathComponent(fieldName));
				const fieldConfiguration : IFieldConfiguration = type.getConfiguration(fieldName);
				const value : any = mapping.value(fieldName);
				const fieldType : string = fieldConfiguration.type;
				const message : string = `Property '${fieldName}' should be type '${fieldType}'`;

				if (this.isArray(fieldType)) {
					if (!Array.isArray(value)) {
						this.addError(message);
					} else {
						this.checkTypesOfArrayElements(this.parseArrayType(fieldType), value, fieldName, fieldConfiguration);
					}
				} else if (this.isEnum(fieldType)) {
					if (!this.isTypeOf('string', value)) {
						this.addError(message);
					} else {
						const enumValues : string[] = fieldConfiguration.values as string[];
						if (!enumValues.includes(value)) {
							this.addError(`Enum '${fieldName}' must have one of these values '${enumValues.join(", ")}'`);
						}
					}
				} else if (this.isUserDefinedType(fieldType)) {
					if (!this.isTypeOf('object', value)) {
						this.addError(message);
					} else {
						this.handleType(fieldConfiguration.type, new RequestMapping(value));
					}
				} else if (this.isPrimative(fieldType) && !this.isTypeOf(fieldType, value)) {
					this.addError(message);
				}

				this.path.pop();
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
		// otherwise this field is not an array and should give an empty array
		if (types.length !== 0) {
			types.pop(); 

			type = type.substring(0, type.indexOf("]"));
			types.push(type);
		}
		return types;
	}

	private checkTypesOfArrayElements(
		types : string[], values : any[], fieldName : string, fieldConfiguration : IFieldConfiguration
	) : void {
		for (let i : number = 0; i < values.length; i++) {
			this.path.push(new IndexPathComponent(i));
			const type : string = types[0];
			const message : string = `Property '${fieldName}${this.getIndex()}' should be type '${type}'`;
			const removedType : string = types.shift() as string;

			if (this.isArray(type)) {
				if (!Array.isArray(values[i])) {
					this.addError(message);
				} else {
					this.checkTypesOfArrayElements(types, values[i], fieldName, fieldConfiguration);
				}
			} else if (this.isEnum(type)) {
				if (!this.isTypeOf('string', values[i])) {
					this.addError(message);
				} else {
					const enumValues : string[] = fieldConfiguration.values as string[];
					if (!enumValues.includes(values[i])) {
						this.addError(`Enum '${fieldName}' must have one of these values '${enumValues.join(", ")}'`);
					}
				}
			} else if (this.isUserDefinedType(type)) {
				if (!this.isTypeOf('object', values[i])) {
					this.addError(message);
				} else {
					this.handleType(type, new RequestMapping(values[i]));
				}
			} else if (this.isPrimative(type) && !this.isTypeOf(type, values[i])) {
				this.addError(message);
			}
			
			types.unshift(removedType);
			this.path.pop();
		}
	}

	private getIndex() : string {
		let indexes : string = "";
		let i : number = this.path.length - 1;
		while (this.path[i] instanceof IndexPathComponent) {
			indexes += this.path[i--].toString();
		}
		return indexes;
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