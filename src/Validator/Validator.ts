import IValidator from "./IValidator";
import IValidationResult from "../ValidationResult/IValidationResult";
import IValidationSchema from "../ValidationSchema/IValidationSchema";
import IRequest from "../Request/IRequest";
import ValidationResult from "../ValidationResult/ValidationResult";
import IRequestMapping from "../Request/IRequestMapping";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import RequestMapping from "../Request/RequestMapping";
import PropertyPathComponent from "../PathBuilder/PropertyPathComponent";
import IndexPathComponent from "../PathBuilder/IndexPathComponent";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import PathBuilder from "../PathBuilder/PathBuilder";
import IErrorHandler from "./IErrorHandler";
import ErrorHandler from "./ErrorHandler";
import IType from "../TypeChecker/IType";
import Type from "../TypeChecker/Type";
import ArrayType from "../TypeChecker/ArrayType";

export default class Validator implements IValidator {
	private readonly schema : IValidationSchema;

	private errorHandler : IErrorHandler;
	private pathBuilder : IPathBuilder;

	constructor(schema : IValidationSchema) {
		this.schema = schema;
		this.pathBuilder = new PathBuilder();
		this.errorHandler = new ErrorHandler(this.pathBuilder);
	}

	public validate(request : IRequest) : IValidationResult {
		this.pathBuilder = new PathBuilder();
		this.errorHandler = new ErrorHandler(this.pathBuilder);

		this.handleRootTypes("body", request.getBody());
		this.handleRootTypes("cookies", request.getCookies());
		this.handleRootTypes("headers", request.getHeaders());
		this.handleRootTypes("params", request.getParams());
		this.handleRootTypes("query", request.getQuery());
		return new ValidationResult(!this.errorHandler.hasErrors(), this.errorHandler.getErrors());
	}

	private handleRootTypes(typeName : string, mapping : IRequestMapping | null) : void {
		this.pathBuilder.addPathComponent(new PropertyPathComponent(typeName));
		if (this.schema.hasType(typeName)) {
			if (mapping === null) {
				this.errorHandler.addRootError(typeName);
			} else {
				this.handleType(typeName, mapping);
			}
		}
		this.pathBuilder.popComponent();
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
				this.errorHandler.addMisingPropertyError(field);
			}
		}   
	}

	private checkForExtraProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
		for (const field of mapping.keys()) {
			if (!type.hasField(field)) {
				this.errorHandler.addUnexpectedPropertyError(field);
			}
		}
	}

	private checkForIncorrectTypes(mapping : IRequestMapping, type : ITypeConfiguration) : void {
		for (const fieldName of type.getFields()) {
			if (type.hasField(fieldName) && mapping.has(fieldName)) {
				this.pathBuilder.addPathComponent(new PropertyPathComponent(fieldName));
				const fieldConfiguration : IFieldConfiguration = type.getConfiguration(fieldName);
				const value : any = mapping.value(fieldName);

				this.typeCheck(fieldName, value, new Type(fieldConfiguration));

				this.pathBuilder.popComponent();
			}
		}
	}

	private typeCheck(fieldName : string, value : any, type : IType) : void {
		if (this.isArray(type.getType())) {
			if (!Array.isArray(value)) {
				this.errorHandler.addTypeError(fieldName, type.getType());
			} else {
				this.checkTypesOfArrayElements(type.arrayStructure(), value, fieldName, type.configuration());
			}
		} else if (this.isEnum(type.getType())) {
			if (!this.isTypeOf('string', value)) {
				this.errorHandler.addTypeError(fieldName, type.getType());
			} else {
				const enumValues : string[] = type.configuration().values as string[];
				if (!enumValues.includes(value)) {
					this.errorHandler.addEnumValueError(fieldName, enumValues);
				}
			}
		} else if (this.isUserDefinedType(type.getType())) {
			if (!this.isTypeOf('object', value)) {
				this.errorHandler.addTypeError(fieldName, type.getType());
			} else {
				this.handleType(type.getType(), new RequestMapping(value));
			}
		} else if (this.isPrimative(type.getType()) && !this.isTypeOf(type.getType(), value)) {
			this.errorHandler.addTypeError(fieldName, type.getType());
		}
	}

	private isArray(fieldType : string) : boolean {
		return fieldType.startsWith("array");
	}

	private checkTypesOfArrayElements(
		types : string[], values : any[], fieldName : string, fieldConfiguration : IFieldConfiguration
	) : void {
		for (let i : number = 0; i < values.length; i++) {
			this.pathBuilder.addPathComponent(new IndexPathComponent(i));
			const type : ArrayType = new ArrayType(fieldConfiguration, types);
			const removedType : string = types.shift() as string;

			this.typeCheck(fieldName, values[i], type);
			
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