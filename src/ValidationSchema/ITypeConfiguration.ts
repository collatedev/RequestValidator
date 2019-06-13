import IFieldConfiguration from "./IFieldConfiguration";

export default interface ITypeConfiguration {
    getFields() : string[];
    getConfiguration(field : string) : IFieldConfiguration;
}