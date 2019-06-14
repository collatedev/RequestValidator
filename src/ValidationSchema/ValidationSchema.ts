import IValidationSchema from "./IValidationSchema";
import ITypeConfiguration from "./ITypeConfiguration";
import IllegalSchemaError from "./IllegalSchemaError";

export default class ValidationSchema implements IValidationSchema {
    private types : string[];

    constructor(json: any) {
        this.types = [];

        if (!json.hasOwnProperty("types")) {
            throw new IllegalSchemaError("All schemas must begin with the 'types' property");
        }
    }

    public getTypeConfiguration(type: string): ITypeConfiguration {
        throw new Error("Method not implemented.");
    }    
    
    public getTypes(): string[] {
        return this.types;
    }

    public hasType(type: string): boolean {
        throw new Error("Method not implemented.");
    }
}