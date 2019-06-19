import IType from "./IType";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";

export default class ArrayType implements IType {
    private _configuration : IFieldConfiguration;
    private _arrayStructure : string[];
    private _nestedType : string;

    constructor(configuration : IFieldConfiguration, arrayStructure : string[]) {
        this._configuration = configuration;
        this._arrayStructure = arrayStructure;
        this._nestedType = arrayStructure[0];
    }

    public arrayStructure() : string[] {
        return this._arrayStructure;
    }

    public getType() : string {
        return this._nestedType;
    }

    public configuration() : IFieldConfiguration {
        return this._configuration;
    }
}