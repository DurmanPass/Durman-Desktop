import {GenerateOptions} from "../../interfaces/data/passwordGenerateOptions.interface";

export class PasswordGenerator {
    private readonly upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private readonly lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
    private readonly numbers = '0123456789';
    private readonly specialSymbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    constructor() {}

    generatePassword(length: number, options: GenerateOptions): string {
        // Собираем все доступные символы на основе опций
        let availableChars = '';
        if (options.useUpperLetters) availableChars += this.upperLetters;
        if (options.useLowerLetters) availableChars += this.lowerLetters;
        if (options.useNumbers) availableChars += this.numbers;
        if (options.useSpecialSymbols) availableChars += this.specialSymbols;

        if (!availableChars) {
            throw new Error('At least one character type must be selected');
        }

        // Создаем начальный пароль
        let password = '';

        // Гарантируем минимальное количество чисел
        if (options.useNumbers && options.minNumbers > 0) {
            for (let i = 0; i < options.minNumbers; i++) {
                password += this.numbers.charAt(Math.floor(Math.random() * this.numbers.length));
            }
        }

        // Гарантируем минимальное количество спецсимволов
        if (options.useSpecialSymbols && options.minSymbols > 0) {
            for (let i = 0; i < options.minSymbols; i++) {
                password += this.specialSymbols.charAt(Math.floor(Math.random() * this.specialSymbols.length));
            }
        }

        // Заполняем оставшуюся длину случайными символами
        const remainingLength = length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
        }

        // Перемешиваем пароль
        return this.shuffleString(password);
    }

    private shuffleString(str: string): string {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
}