import IValidationSchema from "./IValidationSchema";
import ITypeConfiguration from "./ITypeConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";

export default class ValidationSchema implements IValidationSchema {
    constructor(json: any) {
        if (!json.hasOwnProperty("types")) {
            throw new IllegalSchemaError("All schemas must begin with the 'types' property");
        }
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