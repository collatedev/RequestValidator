import IValidationSchema from "./IValidationSchema";
import ITypeConfiguration from "./ITypeConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";
import TypeConfiguration from "./TypeConfiguration";

export default class ValidationSchema implements IValidationSchema {
    private types : Map<string, ITypeConfiguration>;

    constructor(json: any) {
        if (json == null) {
            throw new IllegalSchemaError("All schemas must not be null");
        }
        if (!json.hasOwnProperty("types")) {
            throw new IllegalSchemaError("All schemas must begin with the 'types' property");
        }
        
        this.types = new Map<string, ITypeConfiguration>();

        for (const type of Object.keys(json.types)) {
            const typeConfiguration : any = json.types[type];
            this.types.set(type, new TypeConfiguration(typeConfiguration));
        }
    }

    public getTypeConfiguration(type: string): ITypeConfiguration {
        if (!this.hasType(type)) {
            throw new IllegalSchemaError(`type '${type} is not defined in the schema'`);
        }
        return this.types.get(type) as ITypeConfiguration;
    }    
    
    public getTypes(): string[] {
        const keys : string[] = [];
        for (const key of this.types.keys()) {
            keys.push(key);
        }
        return keys;
    }

    public hasType(type: string): boolean {
        return this.types.has(type);
    }
}