import ITypeConfiguration from "./ITypeConfiguration";
import IFieldConfiguration from "./IFieldConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";

export default class TypeConfiguration implements ITypeConfiguration {
    constructor(type : any) {
        if (type === null) {
            throw new IllegalSchemaError("The json configuration of a type must not be null");
        }
        // find fields of the type here
    }

    public getFields(): string[] {
        return [];
    }    
    
    public getConfiguration(field: string): IFieldConfiguration {
        throw new Error("Method not implemented.");
    }
}