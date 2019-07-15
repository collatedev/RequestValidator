import ITypeChecker from "./ITypeChecker";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import IValidationResult from "../ValidationResult/IValidationResult";
import IValidationSchema from "../ValidationSchema/IValidationSchema";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import PathBuilder from "../PathBuilder/PathBuilder";
import IsType from "./IsType";
import ValidationResult from "../ValidationResult/ValidationResult";
import ValidatorErrorHandler from "../ErrorHandler/ValidatorErrorHandler";
import ErrorType from "../ErrorHandler/ErrorType";
import ArrayType from "./ArrayType";
import IndexPathComponent from "../PathBuilder/IndexPathComponent";
import PropertyPathComponent from "../PathBuilder/PropertyPathComponent";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";
import INestedArray from "../NestedArray/INestedArray";
import IPathComponent from "../PathBuilder/IPathComponent";
import NestedArray from "../NestedArray/NestedArray";

export default class TypeChecker implements ITypeChecker {
    private readonly schema : IValidationSchema;
    private readonly pathBuilder : IPathBuilder;

    private validationResult : IValidationResult;
    private errorHandler : ValidatorErrorHandler;

    constructor(pathBuilder : IPathBuilder, schema : IValidationSchema) {
        this.schema = schema;
        this.pathBuilder = new PathBuilder();
        this.errorHandler = new ValidatorErrorHandler(pathBuilder);
        this.validationResult = new ValidationResult(this.errorHandler);
    }

    public typeCheck(fieldName : string, value : any, configuration : IFieldConfiguration) : IValidationResult {
        this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
        this.validationResult = new ValidationResult(this.errorHandler);

        this.typeCheckValue(fieldName, value, configuration);

        return this.validationResult;
    }

    public typeCheckValue(fieldName : string, value : any, configuration : IFieldConfiguration) : void {
        if (IsType.isPrimative(configuration.type) && !IsType.isTypeOf(configuration.type, value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        } else if (IsType.isEnum(configuration.type) && !IsType.isTypeOf("string", value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        }  else if (IsType.isArray(configuration.type)) {
            this.typeCheckArray(fieldName, value, configuration);
        } else if (this.schema.hasType(configuration.type) && !IsType.isNestedObject(value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        } 
    }

    private typeCheckArray(fieldName : string, value : any, configuration : IFieldConfiguration) : void {
        if (!Array.isArray(value)) {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        } else {
            const nestedArrayStack : INestedArray[] = [new NestedArray(value, 0, this.pathBuilder)];
            while (nestedArrayStack.length > 0) {
                const nestedArray : INestedArray = nestedArrayStack.pop() as INestedArray;
                const array : any[] = nestedArray.value();
                const arrayPath : IPathComponent[] = nestedArray.path().getCurrentIndexComponents();
                this.pathBuilder.addPathComponents(arrayPath);
    
                this.enqueNestedArrays(array, nestedArrayStack, nestedArray);
                this.typeCheckArrayElement(fieldName, nestedArray, configuration);

                this.pathBuilder.popComponents(arrayPath.length);
            }
        }
    }

    private enqueNestedArrays(array : any[], nestedArrayStack : INestedArray[], nestedArray : INestedArray) : void {
        for (let i : number = 0; i < array.length; i++) {
            const nestedValue : any = array[i];
            if (Array.isArray(nestedValue)) {
                this.pathBuilder.addPathComponent(new IndexPathComponent(i));
                nestedArrayStack.push(
                    new NestedArray(
                        nestedValue, 
                        nestedArray.depth() + 1, 
                        this.pathBuilder
                    )
                );
                this.pathBuilder.popComponent();
            }
        }
    }

    private typeCheckArrayElement(
        fieldName : string, nestedArray : INestedArray, arrayConfiguration : IFieldConfiguration
    ) : void {
        const elementConfiguration : IFieldConfiguration = ArrayType.getElementType(arrayConfiguration);
        const array : any[] = nestedArray.value();
        for (let i : number = 0; i < array.length; i++) {
            const element : any = array[i];
            
            if (!Array.isArray(element)) {
                this.pathBuilder.addPathComponent(new IndexPathComponent(i));

                if (this.schema.hasType(elementConfiguration.type)) {
                    this.typeCheckNestedObjectElement(fieldName, element, elementConfiguration);                    
                } else {
                    this.typeCheckValue(fieldName, element, elementConfiguration);
                }

                this.pathBuilder.popComponent();
            }
        }
    }

    private typeCheckNestedObjectElement(fieldName : string, value : any, configuration : IFieldConfiguration) : void {
        const typeConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(configuration.type);
        if (IsType.isNestedObject(value)) {
            for (const nestedField of Object.keys(value)) {
                const fieldConfiguration : IFieldConfiguration = typeConfiguration.getConfiguration(nestedField);
                this.pathBuilder.addPathComponent(new PropertyPathComponent(nestedField));
                this.typeCheckValue(nestedField, value[nestedField], fieldConfiguration);
                this.pathBuilder.popComponent();
            }
        } else {
            this.errorHandler.handleError([fieldName, configuration.type], ErrorType.IncorrectType);
        }
    }
}