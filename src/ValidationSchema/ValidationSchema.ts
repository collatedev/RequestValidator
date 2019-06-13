import IValidationSchema from "./IValidationSchema";
import ITypeConfiguration from "./ITypeConfiguration";

export default class ValidationSchema implements IValidationSchema {
    constructor(json: any) {
        throw new Error("Constructor not implemented.");
    }

    public getTypeConfiguration(type: string): ITypeConfiguration {
        throw new Error("Method not implemented.");
    }    
    
    public getTypes(): string[] {
        throw new Error("Method not implemented.");
    }

    public hasType(type: string): boolean {
        throw new Error("Method not implemented.");
    }
}