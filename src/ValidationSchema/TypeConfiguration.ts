import ITypeConfiguration from "./ITypeConfiguration";
import IFieldConfiguration from "./IFieldConfiguration";

export default class TypeConfiguration implements ITypeConfiguration {
    public getFields(): string[] {
        return [];
    }    
    
    public getConfiguration(field: string): IFieldConfiguration {
        throw new Error("Method not implemented.");
    }
}