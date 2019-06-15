import IValidator from "./IValidator";
import IValidationResult from "./ValidationResult/IValidationResult";
import IValidationSchema from "./ValidationSchema/IValidationSchema";
import IRequest from "./Request/IRequest";
import ValidationResult from "./ValidationResult/ValidationResult";
import IRequestMapping from "./Request/IRequestMapping";
import ITypeConfiguration from "./ValidationSchema/ITypeConfiguration";
import IValidationError from "./ValidationResult/IValidationError";
import IFieldConfiguration from "./ValidationSchema/IFieldConfiguration";

export default class Validator implements IValidator {
    private readonly schema : IValidationSchema;

    constructor(schema : IValidationSchema) {
        this.schema = schema;
    }

    public validate(request : IRequest) : IValidationResult {
        let isValid : boolean = true;
        const errors : IValidationError[] = [];

        if (this.schema.hasType("body")) {
            const type : ITypeConfiguration = this.schema.getTypeConfiguration("body");
            const mapping : IRequestMapping = request.getBody();
            const fields : string[] = type.getFields();

            for (const field of fields) {
                const fieldConfiguration : IFieldConfiguration = type.getConfiguration(field);
                if (!mapping.has(field) && fieldConfiguration.required) {
                    isValid = false;
                    errors.push({
                        message: `Missing property ${field}`,
                        location: "body"
                    });
                }
            }
        }
        return new ValidationResult(isValid, errors);
    }
}