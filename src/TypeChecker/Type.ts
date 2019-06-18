import IType from "./IType";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import ParseArrayElementType from "../Validator/ParseArrayElementType";

export default class Type implements IType {
    private _configuration : IFieldConfiguration;
    private _name : string;
    private _arrayStructure : string[];

    constructor(name : string, configuration : IFieldConfiguration) {
        this._configuration = configuration;
        this._name = name;
        this._arrayStructure = ParseArrayElementType.parse(this._configuration.type);
    }

    public arrayStructure() : string[] {
        return this._arrayStructure;
    }

    public getNestedType() : string {
        return this._configuration.type;
    }

    public configuration() : IFieldConfiguration {
        return this._configuration;
    }

    public name() : string {
        return this._name;
    }
}