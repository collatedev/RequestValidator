"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationResult {
    constructor(isValid, errors) {
        this._isValid = isValid;
        this._errors = errors;
    }
    isValid() {
        return this._isValid;
    }
    errors() {
        return this._errors;
    }
}
exports.default = ValidationResult;
//# sourceMappingURL=ValidationResult.js.map