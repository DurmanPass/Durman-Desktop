export interface UserData {
    username: string;          // Имя пользователя
    email: string;             // Электронная почта
    masterPasswordHash: string;// Хэш мастер-пароля
    registrationDate: string;  // Дата регистрации (ISO строка)
    lastLoginDate: string;     // Дата последнего входа (ISO строка)
    profilePicture?: string;   // URL или путь к аватарке (опционально)
    fingerPrint: string;       // Отпечаток аккаунта
}