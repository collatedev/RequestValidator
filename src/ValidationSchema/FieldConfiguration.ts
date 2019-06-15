import IFieldConfiguration from "./IFieldConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";

const RangeLength : number = 2;
const ValidKeys : string[] = [
    "required", "type", "values", "range", "isURL", "startsWith", "length"
];

export default class FieldConfiguration implements IFieldConfiguration {
    public readonly required: boolean;    
    public readonly type: string;
    public readonly range?: number[] | undefined;
    public readonly values?: string[] | undefined;
    public readonly isURL?: boolean | undefined;
    public readonly startsWith?: string | undefined;
    public readonly length?: number | undefined;

    constructor(field : any) {
        this.validateField(field);
        this.checkForUnexpectedKeys(field);
        this.checkForRequiredKeys(field);

        this.required = field.required;
        this.type = field.type;
        this.range = this.getRange(field);
        this.values = this.getValues(field);
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
            if (!ValidKeys.includes(key)) {
                throw new IllegalSchemaError(`Unexpected key "${key}" in the json`);
            }
        }
    }

    private getRange(field : any) : number[] | undefined {
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
            return field.range as number[];
        }
        return undefined;
    }

    private getValues(field : any) : string[] | undefined {
        if (field.hasOwnProperty("values")) {
            if (this.type !== "enum") {
                throw new IllegalSchemaError('The key "values" can only be used when the type is \'enum\'');
            }
            if (!Array.isArray(field.values)) {
                throw new IllegalSchemaError('The key "values" must be an array');
            }
            if (field.values.length === 0) {
                throw new IllegalSchemaError('The key "values" must have at least one enum value');
            }
            for (const value of field.values) {
                if (typeof value !== 'string') {
                    throw new IllegalSchemaError('All values of the key "values" must be a string');
                }
            }
            return field.values as string[];
        }
        return undefined;
    }
}