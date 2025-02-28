export interface PasswordValidationResult {
    isValid: boolean;
    hasMinLength: boolean;
    hasMaxLength: boolean;
    // hasUpperCase: boolean;
    // hasSpecialChar: boolean;
}