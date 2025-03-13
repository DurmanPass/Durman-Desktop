import {AppSettings} from "../../interfaces/data/appSettings.interface";

export class SettingsService {
    private static readonly SETTINGS_KEY = 'app_settings';
    private static settings: AppSettings = {
        lockTimeout: 3,
        hidePasswords: true,
        twoFactorEnabled: false,
        highContrastMode: false,
        hideFlowerStrengthWidget: false,
    };

    // Загрузка настроек из localStorage
    public static loadSettings(): void {
        const storedSettings = localStorage.getItem(this.SETTINGS_KEY);
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                this.settings = { ...this.settings, ...parsedSettings };
            } catch (error) {
                console.error('Ошибка при загрузке настроек:', error);
                this.saveSettings();
            }
        }
    }

    // Сохранение настроек в localStorage
    public static saveSettings(): void {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    }

    public static getAllSettings(): AppSettings {
        return { ...this.settings };
    }

    public static getLockTimeout(): number {
        return this.settings.lockTimeout;
    }

    public static setLockTimeout(minutes: number): void {
        this.settings.lockTimeout = Math.max(1, Math.min(60, minutes)); // Ограничение от 1 до 60 минут
        this.saveSettings();
    }

    public static getHidePasswords(): boolean {
        return this.settings.hidePasswords;
    }

    public static setHidePasswords(hide: boolean): void {
        this.settings.hidePasswords = hide;
        this.saveSettings();
    }

    public static getTwoFactorEnabled(): boolean {
        return this.settings.twoFactorEnabled;
    }
    public static setTwoFactorEnabled(enabled: boolean): void {
        this.settings.twoFactorEnabled = enabled;
        this.saveSettings();
    }

    public static getHighContrastMode(): boolean {
        return this.settings.highContrastMode;
    }
    public static setHighContrastMode(enabled: boolean): void {
        this.settings.highContrastMode = enabled;
        this.saveSettings();
    }

    public static getHideFlowerStrengthWidget(): boolean {
        return this.settings.hideFlowerStrengthWidget;
    }
    public static setHideFlowerStrengthWidget(enabled: boolean): void {
        this.settings.hideFlowerStrengthWidget = enabled;
        this.saveSettings();
    }
}