"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationResult_1 = __importDefault(require("./ValidationResult/ValidationResult"));
class Validator {
    constructor(schema) {
        this.schema = schema;
    }
    validate(request) {
        if (this.schema.hasType("body")) {
            // handle body
        }
        return new ValidationResult_1.default(true, []);
    }
}
exports.default = Validator;
//# sourceMappingURL=Validator.js.map