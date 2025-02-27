import {PasswordValidationResult} from "./PasswordValidationResult.inerface";

export interface LoginValidationResult {
    isEmailValid: boolean;
    isEmailCodeValid: boolean;
    isPasswordValid: boolean;
    passwordChecks: PasswordValidationResult;
    isPasswordHintValid: boolean;
    isPasswordsMatch: boolean;
}