import IFieldConfiguration from "./IFieldConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";

const RangeLength : number = 2;

export default class FieldConfiguration implements IFieldConfiguration {
    private readonly validKeys : string[] = [
        "required", "type", "values", "range", "isURL", "startsWith", "length"
    ];

    public readonly required: boolean;    
    public readonly type: string;
    public readonly values?: string[] | undefined;
    public readonly range?: number[] | undefined;
    public readonly isURL?: boolean | undefined;
    public readonly startsWith?: string | undefined;
    public readonly length?: number | undefined;

    constructor(field : any) {
        this.validateField(field);
        this.checkForUnexpectedKeys(field);
        this.checkForRequiredKeys(field);
        if (field.hasOwnProperty("range")) {
            if (!Array.isArray(field.range)) {
                throw new IllegalSchemaError('The key "range" must be an array');
            }
            if (field.range.length !== RangeLength) {
                throw new IllegalSchemaError('The key "range" must be an array of size 2');
            }
            if (typeof field.range[0] !== 'number' || typeof field.range[1] !== 'number') {
                throw new IllegalSchemaError('The values in the "range" array must be numbers');
            }
            this.range = field.range;
        }

        this.required = field.required;
        this.type = field.type;
    }

    private validateField(field : any) : void {
        if (field == null) {
            throw new IllegalSchemaError('The json configuration of a field must be non null');
        }
        if (typeof field !== 'object') {
            throw new IllegalSchemaError('The value passed to the constructor must be a json value');
        }
        if (Object.keys(field).length === 0) {
            throw new IllegalSchemaError('The json configuration must have keys "type" and "required"');
        }
    }

    private checkForRequiredKeys(field : any) : void {
        if (!field.hasOwnProperty("type")) {
            throw new IllegalSchemaError('The json configuration must have the "type" key');
        }
        if (!field.hasOwnProperty("required")) {
            throw new IllegalSchemaError('The json configuration must have the "required" key');
        }
        if (typeof field.type !== 'string') {
            throw new IllegalSchemaError('The key "type" must be a string');
        }
        if (typeof field.required !== 'boolean') {
            throw new IllegalSchemaError('The key "required" must be a boolean');
        }
    }

    private checkForUnexpectedKeys(field : any) : void {
        for (const key in field) {
            if (!this.validKeys.includes(key)) {
                throw new IllegalSchemaError(`Unexpected key "${key}" in the json`);
            }
        }
    }
}