import IFieldConfiguration from "./IFieldConfiguration";

export default class FieldConfiguration implements IFieldConfiguration {
    public readonly required: boolean;    
    public readonly type: string;
    public readonly values?: string[] | undefined;
    public readonly range?: number[] | undefined;
    public readonly isURL?: boolean | undefined;
    public readonly startsWith?: string | undefined;
    public readonly length?: number | undefined;

    constructor() {
        this.required = true;
        this.type = "string";
    }
}