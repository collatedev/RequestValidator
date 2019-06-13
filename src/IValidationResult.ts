export default interface IValidationResult {
    isValid: boolean;
    message: string;
    location: string; // e.g body or body.foo.bar
}