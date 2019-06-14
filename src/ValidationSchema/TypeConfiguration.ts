import ITypeConfiguration from "./ITypeConfiguration";
import IFieldConfiguration from "./IFieldConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";
import FieldConfiguration from "./FieldConfiguration";

export default class TypeConfiguration implements ITypeConfiguration {
    private readonly fields : Map<string, IFieldConfiguration>;

    constructor(type : any) {
        if (type === null) {
            throw new IllegalSchemaError("The json configuration of a type must not be null");
        }
        this.fields = new Map<string, IFieldConfiguration>();

        for (const field of Object.keys(type)) {
            this.fields.set(field, new FieldConfiguration());
        }
    }

    public getFields(): string[] {
        const keys : string[] = [];
        for (const key of this.fields.keys()) {
            keys.push(key);
        }
        return keys;
    }    
    
    public getConfiguration(field: string): IFieldConfiguration {
        if (!this.fields.has(field)) {
            throw new IllegalSchemaError(`Type configuration does not have the field '${field}'`);
        }
        return this.fields.get(field) as IFieldConfiguration;
    }
}