import IFieldConfiguration from "../ValidationSchema/IFieldConfiguration";

export default interface IType {
    configuration() : IFieldConfiguration;
    arrayStructure() : string[];
    getType() : string;
}