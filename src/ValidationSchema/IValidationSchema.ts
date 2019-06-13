import IFieldValidationConfiguration from "./IFieldValidationConfiguration";

type IValidationTypeConfiguration = { [key: string] : IFieldValidationConfiguration };

export default interface IValidationSchema {
    schema: { [key: string]: IValidationTypeConfiguration };
}