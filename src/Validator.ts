import IValidator from "./IValidator";
import IValidationResult from "./ValidationResult/IValidationResult";
import IValidationSchema from "./ValidationSchema/IValidationSchema";
import IRequest from "./Request/IRequest";
import ValidationResult from "./ValidationResult/ValidationResult";

export default class Validator implements IValidator {
    private readonly schema : IValidationSchema;

    constructor(schema : IValidationSchema) {
        this.schema = schema;
    }

    public validate(request : IRequest) : IValidationResult {
        if (this.schema.hasType("body")) {
            // handle body
        }
        return new ValidationResult(true, []);
    }
}