export default interface IFieldValidationConfiguration {
    required: boolean;
    type: string;
    values?: string[];
    range?: number[];
    isURL?: boolean;
    startsWith?: string;
    length?: number;
}