import { Injectable } from '@angular/core';
import {PasswordValidationResult} from "../interfaces/data/PasswordValidationResult.inerface";

@Injectable({
    providedIn: 'root',
})
export class ValidateService {
    static validateEmail(email: string): boolean {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    static validatePassword(password: string): PasswordValidationResult {
        const minLength = 8;
        const maxLength = 128;
        const hasMinLength = password.length >= minLength;
        const hasMaxLength = password.length <= maxLength;

        return {
            isValid: hasMinLength && hasMaxLength,
            hasMinLength,
            hasMaxLength
        };

        // const hasUpperCase = /[A-Z]/.test(password);
        // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        // return {
        //     isValid: hasMinLength && hasMaxLength && hasUpperCase && hasSpecialChar,
        //     hasMinLength,
        //     hasMaxLength,
        //     hasUpperCase,
        //     hasSpecialChar
        // };
    }

    static validateEmailCode(code: string): boolean {
        return /^[0-9]{6}$/.test(code);
    }

    static validatePasswordHint(hint: string): boolean {
        return hint.length <= 16;
    }
}