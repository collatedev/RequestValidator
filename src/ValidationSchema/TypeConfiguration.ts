import ITypeConfiguration from "./ITypeConfiguration";
import IFieldConfiguration from "./IFieldConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";
import FieldConfiguration from "./FieldConfiguration";

export default class TypeConfiguration implements ITypeConfiguration {
    private readonly fields : Map<string, IFieldConfiguration>;

    constructor(type : any) {
        if (!this.isJSON(type)) {
            throw new IllegalSchemaError(`The json configuration of a type must be non null json. Recieved: ${type}`);
        }

        this.fields = new Map<string, IFieldConfiguration>();
        
        for (const field of Object.keys(type)) {
            this.fields.set(field, new FieldConfiguration());
        }
    }

    private isJSON(json : any) : boolean {
        return typeof json === 'object' && json !== null;
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