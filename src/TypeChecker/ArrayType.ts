import IType from "./IType";
import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";
import ParseArrayElementType from "./ParseArrayElementType";
import FieldConfiguration from "../ValidationSchema/FieldConfiguration";

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

    public static getElementType(configuration : IFieldConfiguration) : IFieldConfiguration {
        // gets the element type of the array
        const elementType : string = ParseArrayElementType.parse(configuration.type).pop() as string;
        const fieldJSON : any = {
            type : elementType,
            required : true
        };
        if (configuration.isURL) {
            fieldJSON.isURL = configuration.isURL;
        }
        if (configuration.length) {
            fieldJSON.length = configuration.length;
        }
        if (configuration.range) {
            fieldJSON.range = configuration.range;
        }
        if (configuration.startsWith) {
            fieldJSON.startsWith = configuration.startsWith;
        }
        if (configuration.values) {
            fieldJSON.values = configuration.values;
        }
        return new FieldConfiguration(fieldJSON);
    }
}