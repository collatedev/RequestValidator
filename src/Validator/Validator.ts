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
import IType from "../Types/IType";
import Type from "../Types/Type";
import ArrayType from "../Types/ArrayType";
import ErrorType from "../ErrorHandler/ErrorType";
import IsType from "../Types/IsType";
import ISanitizer from "../Sanitizer/ISanitizer";
import Santizer from "../Sanitizer/Sanitizer";

const RootType : string = "request";

export default class Validator implements IValidator {
	private readonly schema : IValidationSchema;

	private errorHandler : IErrorHandler;
	private pathBuilder : IPathBuilder;
	private sanitizer : ISanitizer;
	private result : IValidationResult;

	constructor(schema : IValidationSchema) {
		this.schema = schema;
		this.pathBuilder = new PathBuilder();
		this.sanitizer = new Santizer(this.pathBuilder, this.schema);
		this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
		this.result = new ValidationResult(this.errorHandler);
	}

	public validate(request : IRequest) : IValidationResult {
		this.pathBuilder = new PathBuilder();
		this.sanitizer = new Santizer(this.pathBuilder, this.schema);
		this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
		this.result = new ValidationResult(this.errorHandler);

		this.handleType(RootType, request.getRequest());

		return this.result;
	}

	private handleType(typeName : string, mapping : IRequestMapping) : void {
		if (this.schema.hasType(typeName)) {
			const typeConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(typeName);
			this.checkForMissingProperties(mapping, typeConfiguration);
			this.checkForExtraProperties(mapping, typeConfiguration);
			this.validateMapping(mapping, typeConfiguration);
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

	private validateMapping(mapping : IRequestMapping, typeConfiguration : ITypeConfiguration) : void {
		for (const fieldName of typeConfiguration.getFields()) {
			if (typeConfiguration.hasField(fieldName) && mapping.has(fieldName)) {
				const configuration : IFieldConfiguration = typeConfiguration.getConfiguration(fieldName);
				const value : any = mapping.value(fieldName);
				const typeDefinition : IType = new Type(configuration);

				this.pathBuilder.addPathComponent(new PropertyPathComponent(fieldName));
				this.typeCheck(fieldName, value, typeDefinition);
				this.result.join(this.sanitizer.sanitize(fieldName, value, configuration));
				this.pathBuilder.popComponent();
			}
		}
	}

	// Refactor type check to its own class because it is both type checking and recursing over the entire structure
	// type check should type check and the validator should recurse over the structure
	private typeCheck(fieldName : string, value : any, type : IType) : void {
		if (IsType.isPrimative(type.getType()) && !IsType.isTypeOf(type.getType(), value)) {
			this.errorHandler.handleError([fieldName, type.getType()], ErrorType.IncorrectType);
		} else if (IsType.isEnum(type.getType()) && !IsType.isTypeOf('string', value)) {
			this.errorHandler.handleError([fieldName, type.getType()], ErrorType.IncorrectType);
		} else if (IsType.isArray(type.getType())) {
			this.typeCheckArray(fieldName, value, type);
		} else if (this.schema.hasType(type.getType())) {
			this.typeCheckUserDefinedType(fieldName, value, type);
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
		if (!IsType.isTypeOf('object', value)) {
			this.errorHandler.handleError([fieldName, type.getType()], ErrorType.IncorrectType);
		} else {
			this.handleType(type.getType(), new RequestMapping(value));
		}
	}
}