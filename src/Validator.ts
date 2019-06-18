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
import PropertyPathComponent from "./PathBuilder/PropertyPathComponent";
import IndexPathComponent from "./PathBuilder/IndexPathComponent";
import IPathBuilder from "./PathBuilder/IPathBuilder";
import PathBuilder from "./PathBuilder/PathBuilder";

export default class Validator implements IValidator {
	private readonly schema : IValidationSchema;

	private errors : IValidationError[];
	private isValid : boolean;
	private pathBuilder : IPathBuilder;

	constructor(schema : IValidationSchema) {
		this.schema = schema;
		this.errors = [];
		this.isValid = true;
		this.pathBuilder = new PathBuilder();
	}

	public validate(request : IRequest) : IValidationResult {
		this.isValid = true;
		this.errors = [];
		this.pathBuilder = new PathBuilder();

		this.handleRootTypes("body", request.getBody());
		this.handleRootTypes("cookies", request.getCookies());
		this.handleRootTypes("headers", request.getHeaders());
		this.handleRootTypes("params", request.getParams());
		this.handleRootTypes("query", request.getQuery());
		return new ValidationResult(this.isValid, this.errors);
	}

	private handleRootTypes(typeName : string, mapping : IRequestMapping | null) : void {
		this.pathBuilder.addPathComponent(new PropertyPathComponent(typeName));
		if (this.schema.hasType(typeName)) {
			if (mapping === null) {
				this.addErrorWithLocation(`Request is missing ${typeName}`, "[Request]");
			} else {
				this.handleType(typeName, mapping);
			}
		}
		this.pathBuilder.popComponent();
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
		this.addErrorWithLocation(message, this.pathBuilder.getPath());
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
				this.pathBuilder.addPathComponent(new PropertyPathComponent(fieldName));
				const fieldConfiguration : IFieldConfiguration = type.getConfiguration(fieldName);
				const value : any = mapping.value(fieldName);
				const fieldType : string = fieldConfiguration.type;

				this.typeCheck(
					fieldType, value, fieldName, fieldConfiguration, 
					this.parseArrayType(fieldType), fieldType
				);

				this.pathBuilder.popComponent();
			}
		}
	}

	private typeCheck(
		fieldType : string, value : any, fieldName : string, 
		fieldConfiguration : IFieldConfiguration, types : string[],
		nestedType : string
	) : void {
		const message : string = `Property '${fieldName}${this.pathBuilder.getCurrentIndex()}' should be type '${fieldType}'`;
		if (this.isArray(fieldType)) {
			if (!Array.isArray(value)) {
				this.addError(message);
			} else {
				this.checkTypesOfArrayElements(types, value, fieldName, fieldConfiguration);
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
				this.handleType(nestedType, new RequestMapping(value));
			}
		} else if (this.isPrimative(fieldType) && !this.isTypeOf(fieldType, value)) {
			this.addError(message);
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
			this.pathBuilder.addPathComponent(new IndexPathComponent(i));
			const type : string = types[0];
			const removedType : string = types.shift() as string;

			this.typeCheck(type, values[i], fieldName, fieldConfiguration, types, type);
			
			types.unshift(removedType);
			this.pathBuilder.popComponent();
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
}