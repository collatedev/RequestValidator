import ISanitizer from "./ISanitizer";
import IValidationResult from "../ValidationResult/IValidationResult";
import ValidationResult from "../ValidationResult/ValidationResult";
import IErrorHandler from "../ErrorHandler/IErrorHandler";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import SanitizerErrorHandler from "../ErrorHandler/SanitizerErrorHandler";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import ErrorType from "../ErrorHandler/ErrorType";
import IndexPathComponent from "../PathBuilder/IndexPathComponent";
import IType from "../TypeChecker/IType";
import ArrayType from "../TypeChecker/ArrayType";

const urlRegexPattern : string = 
'^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]' +
'\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\' +
'd|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00' +
'a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localho' +
'st)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

const urlRegex : RegExp = new RegExp(urlRegexPattern, 'i');

export default class Santizer implements ISanitizer {
    private result : IValidationResult;
    private errorHandler : IErrorHandler;
    private pathBuilder : IPathBuilder;

    constructor(pathBuilder : IPathBuilder) {
        this.pathBuilder = pathBuilder;
        this.errorHandler = new SanitizerErrorHandler(this.pathBuilder);
        this.result = new ValidationResult(this.errorHandler);
    }

    public sanitize(fieldName : string, value : any, type : IType) : IValidationResult {
        this.errorHandler = new SanitizerErrorHandler(this.pathBuilder);
        this.result = new ValidationResult(this.errorHandler);

        this.sanitizeValue(fieldName, value, type);

        return this.result;
    }

    private sanitizeValue(fieldName : string, value : any, type : IType) : void {
        if (type.getType() === "string") {
            this.sanitizeString(fieldName, value, type);
        }
        if (type.getType() === "number") {
            this.sanitizeNumber(value, type);
        }
        if (type.getType() === "enum") {
            this.sanitizeEnum(value, type);
        }
        if (type.getType().startsWith("array")) {
            this.sanitizeArray(fieldName, value, type);
        }
    }

    private sanitizeString(field: string, value : any, type : IType) : void {
        if (this.isIllegalLength(value, type)) {
            this.errorHandler.handleError(
                [field, value.length, type.configuration().length], 
                ErrorType.IllegalLengthError
            );
        }
        if (this.doesNotStartWith(value, type)) {
            this.errorHandler.handleError([value, type.configuration().startsWith], ErrorType.DoesNotStartWithError);
        }
        if (this.isIllegalURL(value, type)) {
            this.errorHandler.handleError([value], ErrorType.IllegalURLError);
        }
    }

    private isIllegalLength(value : any, type : IType) : boolean {
        const configuration : IFieldConfiguration = type.configuration();
        return configuration.length !== undefined && value.length !== configuration.length;
    }

    private doesNotStartWith(value : any, type : IType) : boolean {
        const configuration : IFieldConfiguration = type.configuration();
        return configuration.startsWith !== undefined && !value.startsWith(configuration.startsWith);
    }

    private isIllegalURL(value : any, type : IType) : boolean {
        return type.configuration().isURL !== undefined && !urlRegex.test(value);
    }

    private sanitizeNumber(value : any, type : IType) : void {
        if (this.isOutOfRange(value, type)) {
            // this joins the array as a string of the form "x, y". We know range is not undefined due to
            // the isOutOfRangeMethod
            const rangeString : string = (type.configuration().range as number[]).join(", ");
            this.errorHandler.handleError(
                [value, rangeString], 
                ErrorType.OutOfRangeError
            );
        }
    }

    private isOutOfRange(value : any, type : IType) : boolean {
        const configuration : IFieldConfiguration = type.configuration();
        return configuration.range !== undefined && 
            (configuration.range[0] > value || configuration.range[1] < value);
    }

    private sanitizeEnum(value : any, type : IType) : void {
        if (this.isIllegalEnumValue(value, type)) {
            // this joins the array as a string of the form "EnumA, EnumB". We know values is not undefined due to
            // the isIllegalEnumValue method
            const enumString : string = (type.configuration().values as string[]).join(", ");
            this.errorHandler.handleError(
                [value, enumString], 
                ErrorType.IllegalEnumValue
            );
        }
    }

    private isIllegalEnumValue(value : any, type : IType) : boolean {
        const configuration : IFieldConfiguration = type.configuration();
        return configuration.values !== undefined && !configuration.values.includes(value);
    }

    private sanitizeArray(field : string, value : any, type : IType) : void {
        if (this.hasIllegalArrayLengths(value, type)) {
            // send error
        } else {
            for (let i : number = 0; i < value.length; i++) {
                this.pathBuilder.addPathComponent(new IndexPathComponent(i));

                const arrayType : ArrayType = new ArrayType(type.configuration(), type.arrayStructure());
                const removedType : string = type.arrayStructure().shift() as string;
                this.sanitizeValue(field, value[i], arrayType);
                type.arrayStructure().unshift(removedType);

                this.pathBuilder.popComponent();
            }
        }
    }

    private hasIllegalArrayLengths(value : any, type : IType) : boolean {
        const configuration : IFieldConfiguration = type.configuration();
        if (configuration.arrayLengths === undefined) {
            return false;
        }
        return true;
    }
}
