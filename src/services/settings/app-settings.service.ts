import { AppSettings } from "../../interfaces/data/appSettings.interface";

export class SettingsService {
    private static readonly SETTINGS_KEY = 'app_settings';
    private static settings: AppSettings = {
        general: {
            highContrastMode: false,
            hideFlowerStrengthWidget: false
        },
        security: {
            lockTimeout: 3,
            hidePasswords: true,
            twoFactorEnabled: false
        }
    };

    // Загрузка настроек из localStorage
    public static loadSettings(): void {
        const storedSettings = localStorage.getItem(this.SETTINGS_KEY);
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                this.settings = {
                    general: { ...this.settings.general, ...parsedSettings.general },
                    security: { ...this.settings.security, ...parsedSettings.security }
                };
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

    // Получение всех настроек
    public static getAllSettings(): AppSettings {
        return {
            general: { ...this.settings.general },
            security: { ...this.settings.security }
        };
    }

    // Геттеры и сеттеры для general

    public static getHighContrastMode(): boolean {
        return this.settings.general.highContrastMode;
    }
    public static setHighContrastMode(enabled: boolean): void {
        this.settings.general.highContrastMode = enabled;
        this.saveSettings();
    }

    public static getHideFlowerStrengthWidget(): boolean {
        return this.settings.general.hideFlowerStrengthWidget;
    }
    public static setHideFlowerStrengthWidget(enabled: boolean): void {
        this.settings.general.hideFlowerStrengthWidget = enabled;
        this.saveSettings();
    }

    // Геттеры и сеттеры для security

    public static getLockTimeout(): number {
        return this.settings.security.lockTimeout;
    }
    public static setLockTimeout(minutes: number): void {
        this.settings.security.lockTimeout = Math.max(1, Math.min(60, minutes));
        this.saveSettings();
    }

    public static getHidePasswords(): boolean {
        return this.settings.security.hidePasswords;
    }
    public static setHidePasswords(hide: boolean): void {
        this.settings.security.hidePasswords = hide;
        this.saveSettings();
    }

    public static getTwoFactorEnabled(): boolean {
        return this.settings.security.twoFactorEnabled;
    }
    public static setTwoFactorEnabled(enabled: boolean): void {
        this.settings.security.twoFactorEnabled = enabled;
        this.saveSettings();
    }
}