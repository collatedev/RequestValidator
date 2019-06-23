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
import IErrorHandler from "../ErrorHandler/IErrorHandler";
import ValidatorErrorHandler from "../ErrorHandler/ValidatorErrorHandler";
import IType from "../TypeChecker/IType";
import Type from "../TypeChecker/Type";
import ArrayType from "../TypeChecker/ArrayType";
import ErrorType from "../ErrorHandler/ErrorType";

const RootType : string = "request";

export default class Validator implements IValidator {
	private readonly schema : IValidationSchema;

	private errorHandler : IErrorHandler;
	private pathBuilder : IPathBuilder;

	constructor(schema : IValidationSchema) {
		this.schema = schema;
		this.pathBuilder = new PathBuilder();
		this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
	}

	public validate(request : IRequest) : IValidationResult {
		this.pathBuilder = new PathBuilder();
		this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);

		this.handleType(RootType, request.getRequest());

		return new ValidationResult(this.errorHandler);
	}

	private handleType(typeName : string, mapping : IRequestMapping) : void {
		if (this.schema.hasType(typeName)) {
			const typeConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(typeName);
			this.checkForMissingProperties(mapping, typeConfiguration);
			this.checkForExtraProperties(mapping, typeConfiguration);
			this.checkForIncorrectTypes(mapping, typeConfiguration);
		} else {
			this.errorHandler.handleError([typeName], ErrorType.UnknownType);
		}
	}

	private checkForMissingProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
		for (const field of type.getFields()) {
			const fieldConfiguration : IFieldConfiguration = type.getConfiguration(field);
			// Adds an error if and only if the mapping is missing a field and that the missing field is required
			if (!mapping.has(field) && fieldConfiguration.required) {
				this.errorHandler.handleError([field], ErrorType.MissingField);
			}
		}   
	}

	private checkForExtraProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
		for (const field of mapping.keys()) {
			if (!type.hasField(field)) {
				this.errorHandler.handleError([field], ErrorType.UnexpectedField);
			}
		}
	}

	private checkForIncorrectTypes(mapping : IRequestMapping, type : ITypeConfiguration) : void {
		for (const fieldName of type.getFields()) {
			if (type.hasField(fieldName) && mapping.has(fieldName)) {
				this.pathBuilder.addPathComponent(new PropertyPathComponent(fieldName));
				this.typeCheck(fieldName, mapping.value(fieldName), new Type(type.getConfiguration(fieldName)));
				this.pathBuilder.popComponent();
			}
		}
	}

	// Refactor type check to its own class?
	private typeCheck(fieldName : string, value : any, type : IType) : void {
		if (this.isArray(type.getType())) {
			this.typeCheckArray(fieldName, value, type);
		} else if (this.isEnum(type.getType()) && !this.isTypeOf('string', value)) {
			this.errorHandler.handleError([fieldName, type.getType()], ErrorType.IncorrectType);
		} else if (this.isUserDefinedType(type.getType())) {
			this.typeCheckUserDefinedType(fieldName, value, type);
		} else if (this.isPrimative(type.getType()) && !this.isTypeOf(type.getType(), value)) {
			this.errorHandler.handleError([fieldName, type.getType()], ErrorType.IncorrectType);
		}
	}

	private typeCheckArray(fieldName : string, value : any, type : IType) : void {
		if (!Array.isArray(value)) {
			this.errorHandler.handleError([fieldName, type.getType()], ErrorType.IncorrectType);
		} else {
			this.checkTypesOfArrayElements(fieldName, value, type);
		}
	}

	private checkTypesOfArrayElements(fieldName : string, values : any[], type : IType) : void {
		for (let i : number = 0; i < values.length; i++) {
			this.pathBuilder.addPathComponent(new IndexPathComponent(i));
			const arrayType : ArrayType = new ArrayType(type.configuration(), type.arrayStructure());
			const removedType : string = type.arrayStructure().shift() as string;
			this.typeCheck(fieldName, values[i], arrayType);
			type.arrayStructure().unshift(removedType);
			this.pathBuilder.popComponent();
		}
	}

	private typeCheckUserDefinedType(fieldName : string, value : any, type : IType) : void {
		if (!this.isTypeOf('object', value)) {
			this.errorHandler.handleError([fieldName, type.getType()], ErrorType.IncorrectType);
		} else {
			this.handleType(type.getType(), new RequestMapping(value));
		}
	}

	// Probably need to refactor the type check methods to a seperate static class so that
	// type checking and sanitizing can use it
	private isArray(fieldType : string) : boolean {
		return fieldType.startsWith("array");
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