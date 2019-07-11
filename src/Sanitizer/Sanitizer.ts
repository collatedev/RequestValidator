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
import INestedArray from "../NestedArray/INestedArray";
import NestedArray from "../NestedArray/NestedArray";
import FieldConfiguration from "../ValidationSchema/FieldConfiguration";
import Type from "../TypeChecker/Type";
import ParseArrayElementType from "../TypeChecker/ParseArrayElementType";

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
        if (type.getType().startsWith("array") && Array.isArray(value)) {
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

    private sanitizeArray(fieldName: string, value : any, type : IType) : void {
        const arrayLengths : number[] | undefined = type.configuration().arrayLengths;
        const nestedArrayStack : INestedArray[] = [new NestedArray(value, 0, fieldName)];
        
		while (!this.isEmpty(nestedArrayStack)) {
            const nestedArray : INestedArray = nestedArrayStack.pop() as INestedArray;
            const array : any[] = nestedArray.value();

            if (arrayLengths) {
                const expectedLength : number = arrayLengths[nestedArray.depth()];
                if (!this.isExpectedLength(array.length, expectedLength)) {
                    this.handleIllegalLengthError(nestedArray.path(), array.length, expectedLength);
                }
            }

            this.enqueNestedArrays(array, nestedArrayStack, nestedArray);
            this.sanitizeNestedArrayElements(fieldName, nestedArray, type);
		}
    }

    private handleIllegalLengthError(path : string, actualLength : number, expectedLength : number) : void {
        this.errorHandler.handleError(
            [path, actualLength, expectedLength],
            ErrorType.IllegalArrayLength
        );
    }

    private isEmpty(nestedArrayStack : INestedArray[]) : boolean {
        return nestedArrayStack.length === 0;
    }

    private isExpectedLength(actualLength : number, expectedLength : number) : boolean {
        return expectedLength === actualLength;
    }

    private enqueNestedArrays(array : any[], nestedArrayStack : INestedArray[], nestedArray : INestedArray) : void {
        for (let i : number = 0; i < array.length; i++) {
            const nestedValue : any = array[i];
            if (Array.isArray(nestedValue)) {
                nestedArrayStack.push(
                    new NestedArray(
                        nestedValue, 
                        nestedArray.depth() + 1, 
                        `${nestedArray.path()}[${i}]`
                    )
                );
            }
        }
    }

    private sanitizeNestedArrayElements(fieldName : string, nestedArray : INestedArray, type : IType) : void {
        const array : any[] = nestedArray.value();
        // add nestedArray to current path
        for (let i : number = 0; i < array.length; i++) {
            const element : any = array[i];
            if (!Array.isArray(element)) {
                this.sanitizeArrayElement(fieldName, element, i, type);
            }
        }
        // remove nestedArray to current path
    }

    private sanitizeArrayElement(fieldName : string, element : any, index : number, type : IType) : void {
        this.pathBuilder.addPathComponent(new IndexPathComponent(index));
        const elementType : IType = this.getElementType(type);
        this.sanitizeValue(fieldName, element, elementType);
        this.pathBuilder.popComponent();
    }

    private getElementType(arrayType : IType) : IType {
        const configuration : IFieldConfiguration = arrayType.configuration();
        // gets the element type of the array
        const elementType : string = ParseArrayElementType.parse(configuration.type).pop() as string;
        const fieldJSON : any = {
            type : elementType,
            required : true
        };
        if (configuration.isURL) {
            fieldJSON.isURL = configuration.isURL;
        }
        if (configuration.length) {
            fieldJSON.length = configuration.length;
        }
        if (configuration.range) {
            fieldJSON.range = configuration.range;
        }
        if (configuration.startsWith) {
            fieldJSON.startsWith = configuration.startsWith;
        }
        if (configuration.values) {
            fieldJSON.values = configuration.values;
        }
        return new Type(new FieldConfiguration(fieldJSON));
    }
}
