import ISanitizer from "./ISanitizer";
import IRequestMapping from "../Request/IRequestMapping";
import ITypeConfiguration from "../ValidationSchema/ITypeConfiguration";
import IValidationResult from "../ValidationResult/IValidationResult";
import ValidationResult from "../ValidationResult/ValidationResult";
import IErrorHandler from "../ErrorHandler/IErrorHandler";
import IPathBuilder from "../PathBuilder/IPathBuilder";
import SanitizerErrorHandler from "../ErrorHandler/SanitizerErrorHandler";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import ErrorType from "../ErrorHandler/ErrorType";

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

    public sanitize(mapping : IRequestMapping, type : ITypeConfiguration) : IValidationResult {
        this.errorHandler = new SanitizerErrorHandler(this.pathBuilder);
        this.result = new ValidationResult(this.errorHandler);

        for (const field of mapping.keys()) {
            if (type.hasField(field)) {
                const fieldConfiguration : IFieldConfiguration = type.getConfiguration(field);
                const value : any = mapping.value(field);

                if (fieldConfiguration.type === "string") {
                    this.sanitizeString(field, value, fieldConfiguration);
                }
                if (fieldConfiguration.type === "number") {
                    this.sanitizeNumber(field, value, fieldConfiguration);
                }
            }
        }

        return this.result;
    }

    private sanitizeString(field: string, value : any, configuration : IFieldConfiguration) : void {
        if (this.isIllegalLength(value, configuration)) {
            this.sanitizeIllegalLength(field, value, configuration);
        }
        if (this.doesNotStartWith(value, configuration)) {
            this.errorHandler.handleError([value, configuration.startsWith], ErrorType.DoesNotStartWithError);
        }
        if (this.isIllegalURL(value, configuration)) {
            this.errorHandler.handleError([value], ErrorType.IllegalURLError);
        }
    }

    private isIllegalLength(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.length !== undefined && value.length !== configuration.length;
    }

    private sanitizeIllegalLength(field : string , value : any, configuration : IFieldConfiguration) : void {
        this.errorHandler.handleError(
            [field, value.length, configuration.length], 
            ErrorType.IllegalLengthError
        );
    }

    private doesNotStartWith(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.startsWith !== undefined && !value.startsWith(configuration.startsWith);
    }

    private isIllegalURL(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.isURL !== undefined && !urlRegex.test(value);
    }

    private sanitizeNumber(field : string, value : any, configuration : IFieldConfiguration) : void {
        if (this.isOutOfRange(value, configuration)) {
            // this joins the array as a string of the form "x, y". We know range is not undefined due to
            // the isOutOfRangeMethod
            const rangeString : string = (configuration.range as number[]).join(", ");
            this.errorHandler.handleError(
                [value, rangeString], 
                ErrorType.OutOfRangeError
            );
        }
    }

    private isOutOfRange(value : any, configuration : IFieldConfiguration) : boolean {
        return configuration.range !== undefined && (configuration.range[0] > value || configuration.range[1] < value);
    }
}
