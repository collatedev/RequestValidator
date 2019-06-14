import ITypeConfiguration from "./ITypeConfiguration";
import IFieldConfiguration from "./IFieldConfiguration";

export default class TypeConfiguration implements ITypeConfiguration {
    constructor(type : any) {
        // find fields of the type here
    }

    public getFields(): string[] {
        return [];
    }    
    
    public getConfiguration(field: string): IFieldConfiguration {
        throw new Error("Method not implemented.");
    }
}