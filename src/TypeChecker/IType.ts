import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";

export default interface IType {
    name() : string;
    configuration() : IFieldConfiguration;
    arrayStructure() : string[];
    getNestedType() : string;
}