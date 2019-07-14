import IType from "./IType";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import ParseArrayElementType from "./ParseArrayElementType";

export default class Type implements IType {
    private _configuration : IFieldConfiguration;
    private _arrayStructure : string[];

    constructor(configuration : IFieldConfiguration) {
        this._configuration = configuration;
        this._arrayStructure = ParseArrayElementType.parse(this._configuration.type);
    }

    public arrayStructure() : string[] {
        return this._arrayStructure;
    }

    public getType() : string {
        return this._configuration.type;
    }

    public configuration() : IFieldConfiguration {
        return this._configuration;
    }
}