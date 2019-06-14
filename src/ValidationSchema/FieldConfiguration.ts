import IFieldConfiguration from "./IFieldConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";

export default class FieldConfiguration implements IFieldConfiguration {
    public readonly required: boolean;    
    public readonly type: string;
    public readonly values?: string[] | undefined;
    public readonly range?: number[] | undefined;
    public readonly isURL?: boolean | undefined;
    public readonly startsWith?: string | undefined;
    public readonly length?: number | undefined;

    constructor(field : any) {
        if (field == null) {
            throw new IllegalSchemaError('The json configuration of a field must be non null');
        }
        if (typeof field !== 'object') {
            throw new IllegalSchemaError('The value passed to the constructor must be a json value');
        }
        if (Object.keys(field).length === 0) {
            throw new IllegalSchemaError('The json configuration must have keys "type" and "required"');
        }
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
        this.required = field.required;
        this.type = field.type;
    }
}