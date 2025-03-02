import {ThemeColors} from "../../shared/const/colors/general/themeColors";

export interface PasswordInfo {
    id: string;        // Уникальный идентификатор (например, 'all', 'compromised')
    score: number;     // Числовое значение (например, 256, 16)
    color: keyof typeof ThemeColors;     // Цвет в виде строки (например, 'DarkGreen', 'DarkRed')
}