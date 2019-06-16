import IValidationSchema from "./IValidationSchema";
import ITypeConfiguration from "./ITypeConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";
import TypeConfiguration from "./TypeConfiguration";
import IFieldConfiguration from "./IFieldConfiguration";

const ValidPrimativeTypes : string[] = [
    "array", "string", "number", "boolean", "enum"
];

export default class ValidationSchema implements IValidationSchema {
    private types : Map<string, ITypeConfiguration>;

    constructor(json: any) {
        if (json === null) {
            throw new IllegalSchemaError("All schemas must not be null");
        }
        if (typeof json !== 'object') {
            throw new IllegalSchemaError(`All schemas must be valid json. Received: ${json}`);
        }
        if (!json.hasOwnProperty("types")) {
            throw new IllegalSchemaError("All schemas must begin with the 'types' property");
        }
        if (json.types === null) {
            throw new IllegalSchemaError("Types key can not be null, must be an empty object instead");
        }
        if (typeof json.types !== 'object') {
            throw new IllegalSchemaError("Types must be an object");
        }
        
        this.types = new Map<string, ITypeConfiguration>();

        for (const type of Object.keys(json.types)) {
            const typeConfiguration : any = json.types[type];
            this.types.set(type, new TypeConfiguration(typeConfiguration));
        }

        for (const type of this.getTypes()) {
            const typeConfiguration : ITypeConfiguration = this.getTypeConfiguration(type);
            for (const field of typeConfiguration.getFields()) {
                const fieldConfiguration : IFieldConfiguration = typeConfiguration.getConfiguration(field);
                if (!this.hasType(fieldConfiguration.type) && !ValidPrimativeTypes.includes(fieldConfiguration.type)) {
                    throw new IllegalSchemaError(`Undefined type: ${fieldConfiguration.type}`);
                }
            }
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