import IValidationSchema from "./IValidationSchema";
import ITypeConfiguration from "./ITypeConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";

export default class ValidationSchema implements IValidationSchema {
    private types : Map<string, ITypeConfiguration>;

    constructor(json: any) {
        this.types = new Map<string, ITypeConfiguration>();

        if (!json.hasOwnProperty("types")) {
            throw new IllegalSchemaError("All schemas must begin with the 'types' property");
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