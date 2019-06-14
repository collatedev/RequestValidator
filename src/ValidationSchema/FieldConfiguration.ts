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
        this.required = true;
        this.type = "string";
    }
}