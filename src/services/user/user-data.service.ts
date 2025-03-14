import {UserData} from "../../interfaces/data/userData.interface";

export class UserDataService {
    private static userData: UserData = {
        username: '',
        email: 'guest@example.com',
        masterPasswordHash: '',
        registrationDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
        profilePicture: undefined
    };

    public static loadUserData(): void {
        //TODO Получить данные пользователя после входа
    }

    public static saveUserData(): void {
        //TODO Сохранение данных пользователя
    }

    // Получение всех данных пользователя
    public static getAllUserData(): UserData {
        return { ...this.userData };
    }

    public static getUsername(): string {
        return this.userData.username;
    }
    public static setUsername(username: string): void {
        this.userData.username = username.trim();
        this.saveUserData(); // Пока заглушка
    }

    public static getEmail(): string {
        return this.userData.email;
    }
    public static setEmail(email: string): void {
        this.userData.email = email.trim();
        this.saveUserData(); // Пока заглушка
    }

    public static getMasterPasswordHash(): string {
        return this.userData.masterPasswordHash;
    }
    public static setMasterPasswordHash(hash: string): void {
        this.userData.masterPasswordHash = hash;
        this.saveUserData(); // Пока заглушка
    }

    public static getRegistrationDate(): string {
        return this.userData.registrationDate;
    }
    public static setRegistrationDate(date: string): void {
        this.userData.registrationDate = new Date(date).toISOString();
        this.saveUserData(); // Пока заглушка
    }

    public static getLastLoginDate(): string {
        return this.userData.lastLoginDate;
    }
    public static setLastLoginDate(date: string): void {
        this.userData.lastLoginDate = new Date(date).toISOString();
        this.saveUserData(); // Пока заглушка
    }

    public static getProfilePicture(): string | undefined {
        return this.userData.profilePicture;
    }
    public static setProfilePicture(url: string | undefined): void {
        this.userData.profilePicture = url;
        this.saveUserData(); // Пока заглушка
    }

    public static setUserData(data: Partial<UserData>): void {
        this.userData = {
            ...this.userData,
            ...data,
            username: data.username?.trim() ?? this.userData.username,
            email: data.email?.trim() ?? this.userData.email,
            registrationDate: data.registrationDate ? new Date(data.registrationDate).toISOString() : this.userData.registrationDate,
            lastLoginDate: data.lastLoginDate ? new Date(data.lastLoginDate).toISOString() : this.userData.lastLoginDate
        };
        this.saveUserData();
    }
}