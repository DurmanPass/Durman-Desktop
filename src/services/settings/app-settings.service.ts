// import { Injectable } from '@angular/core';
// import {AppSettings, ServerSettings} from "../../interfaces/data/appSettings.interface";
// import {SettingsService} from "../routes/settings/settings.service";
//
// @Injectable({
//     providedIn: 'root'
// })
// export class SettingsLocalService {
//     private static readonly SETTINGS_KEY = 'app_settings';
//     private settings: AppSettings = {
//         general: {
//             highContrastMode: false,
//             hideFlowerStrengthWidget: true
//         },
//         security: {
//             lockTimeout: 3,
//             hidePasswords: true,
//             twoFactorEnabled: false,
//             buffer: {
//                 clearBuffer: true,
//                 clearBufferTimeout: 20000
//             }
//         }
//     };
//
//     constructor(
//         private settingsService: SettingsService,
//     ) {
//         this.loadSettings();
//     }
//
//     /**
//      * Загружает настройки из localStorage
//      */
//     public loadSettings(): void {
//         const storedSettings = localStorage.getItem(SettingsLocalService.SETTINGS_KEY);
//         if (storedSettings) {
//             try {
//                 const parsedSettings = JSON.parse(storedSettings);
//                 this.settings = {
//                     general: { ...this.settings.general, ...parsedSettings.general },
//                     security: { ...this.settings.security, ...parsedSettings.security }
//                 };
//             } catch (error) {
//                 console.error('Ошибка при загрузке настроек:', error);
//                 this.saveSettings();
//             }
//         }
//     }
//
//     /**
//      * Сохраняет настройки в localStorage
//      */
//     private async saveSettings() {
//         localStorage.setItem(SettingsLocalService.SETTINGS_KEY, JSON.stringify(this.settings));
//         await this.settingsService.updateSettings(this.toServerSettings(this.settings));
//     }
//
//     /**
//      * Преобразует локальные настройки в серверный формат
//      */
//     private toServerSettings(settings: AppSettings): ServerSettings {
//         return {
//             hide_password_strength_widget: settings.general.hideFlowerStrengthWidget,
//             hide_passwords: settings.security.hidePasswords,
//             clear_buffer: settings.security.buffer.clearBuffer,
//             lock_timeout_min: settings.security.lockTimeout
//         };
//     }
//
//     /**
//      * Преобразует серверные настройки в локальный формат
//      */
//     private toLocalSettings(serverSettings: ServerSettings): AppSettings {
//         return {
//             general: {
//                 ...this.settings.general,
//                 hideFlowerStrengthWidget: serverSettings.hide_password_strength_widget
//             },
//             security: {
//                 ...this.settings.security,
//                 hidePasswords: serverSettings.hide_passwords,
//                 lockTimeout: serverSettings.lock_timeout_min,
//                 buffer: {
//                     ...this.settings.security.buffer,
//                     clearBuffer: serverSettings.clear_buffer
//                 }
//             }
//         };
//     }
//
//     /**
//      * Синхронизирует настройки с сервером
//      */
//     async syncSettings(): Promise<void> {
//         try {
//             const serverSettings = await this.settingsService.getSettings();
//             this.settings = this.toLocalSettings(serverSettings);
//             this.saveSettings();
//         } catch (e) {
//             console.error('Не удалось синхронизировать настройки с сервером:', e);
//             // this.toastService.danger('Не удалось синхронизировать настройки с сервером!');
//         }
//     }
//
//     /**
//      * Получает настройки
//      * @param forceSync Принудительная синхронизация с сервером
//      * @returns Локальные или серверные настройки
//      */
//     async getSettings(forceSync: boolean = false): Promise<AppSettings> {
//         if (forceSync || !this.settings) {
//             await this.syncSettings();
//         }
//         return { ...this.settings };
//     }
//
//     /**
//      * Обновляет все настройки
//      * @param settings Новые настройки
//      */
//     async updateSettings(settings: AppSettings): Promise<void> {
//         try {
//             const serverSettings = this.toServerSettings(settings);
//             await this.settingsService.updateSettings(serverSettings);
//             this.settings = { ...settings };
//             this.saveSettings();
//         } catch (e) {
//             throw e instanceof Error ? e : new Error('Не удалось обновить настройки');
//         }
//     }
//
//     /**
//      * Частично обновляет настройки
//      * @param partialSettings
//      */
//     async patchSettings(partialSettings: Partial<ServerSettings>): Promise<void> {
//         try {
//             await this.settingsService.patchSettings(partialSettings);
//             const currentServerSettings = this.toServerSettings(this.settings);
//             const updatedServerSettings = { ...currentServerSettings, ...partialSettings };
//             this.settings = this.toLocalSettings(updatedServerSettings);
//             this.saveSettings();
//         } catch (e) {
//             throw e instanceof Error ? e : new Error('Не удалось обновить настройки');
//         }
//     }
//
//     /**
//      * Получение всех настроек
//      */
//     getAllSettings(): AppSettings {
//         return { ...this.settings };
//     }
//
//     // Геттеры и сеттеры для general
//
//     getHighContrastMode(): boolean {
//         return this.settings.general.highContrastMode;
//     }
//
//     setHighContrastMode(enabled: boolean): void {
//         this.settings.general.highContrastMode = enabled;
//         this.saveSettings();
//     }
//
//     getHideFlowerStrengthWidget(): boolean {
//         return this.settings.general.hideFlowerStrengthWidget;
//     }
//
//     async setHideFlowerStrengthWidget(enabled: boolean) {
//         this.settings.general.hideFlowerStrengthWidget = enabled;
//         await this.saveSettings();
//     }
//
//     // Геттеры и сеттеры для security
//
//     getLockTimeout(): number {
//         return this.settings.security.lockTimeout;
//     }
//
//     async setLockTimeout(minutes: number) {
//         this.settings.security.lockTimeout = Math.max(1, Math.min(60, minutes));
//         await this.saveSettings();
//     }
//
//     getHidePasswords(): boolean {
//         return this.settings.security.hidePasswords;
//     }
//
//     async setHidePasswords(hide: boolean) {
//         this.settings.security.hidePasswords = hide;
//         await this.saveSettings();
//     }
//
//     getTwoFactorEnabled(): boolean {
//         return this.settings.security.twoFactorEnabled;
//     }
//
//     async setTwoFactorEnabled(enabled: boolean) {
//         this.settings.security.twoFactorEnabled = enabled;
//         await this.saveSettings();
//     }
//
//     getClearBuffer(): boolean {
//         return this.settings.security.buffer.clearBuffer;
//     }
//
//     async setClearBuffer(enabled: boolean) {
//         this.settings.security.buffer.clearBuffer = enabled;
//         await this.saveSettings();
//     }
//
//     getClearBufferTimeout(): number {
//         return this.settings.security.buffer.clearBufferTimeout;
//     }
//
//     async setClearBufferTimeout(timeout: number) {
//         this.settings.security.buffer.clearBufferTimeout = Math.max(1000, Math.min(60000, timeout));
//         await this.saveSettings();
//     }
// }

// import { Injectable } from '@angular/core';
// import {AppSettings, ServerSettings} from "../../interfaces/data/appSettings.interface";
// import {SettingsService} from "../routes/settings/settings.service";
//
// @Injectable({
//     providedIn: 'root'
// })
// export class SettingsLocalService {
//     private static readonly SETTINGS_KEY = 'app_settings';
//     private settings: AppSettings = {
//         general: {
//             highContrastMode: false,
//             hideFlowerStrengthWidget: true
//         },
//         security: {
//             lockTimeout: 3,
//             hidePasswords: true,
//             twoFactorEnabled: false,
//             buffer: {
//                 clearBuffer: true,
//                 clearBufferTimeout: 20000
//             }
//         }
//     };
//
//     constructor(
//         private settingsService: SettingsService,
//     ) {
//         this.loadSettings();
//     }
//
//     /**
//      * Загружает настройки из localStorage
//      */
//     public loadSettings(): void {
//         const storedSettings = localStorage.getItem(SettingsLocalService.SETTINGS_KEY);
//         if (storedSettings) {
//             try {
//                 const parsedSettings = JSON.parse(storedSettings);
//                 this.settings = {
//                     general: { ...this.settings.general, ...parsedSettings.general },
//                     security: { ...this.settings.security, ...parsedSettings.security }
//                 };
//             } catch (error) {
//                 console.error('Ошибка при загрузке настроек:', error);
//                 this.saveSettings();
//             }
//         }
//     }
//
//     /**
//      * Сохраняет настройки в localStorage
//      */
//     private async saveSettings() {
//         localStorage.setItem(SettingsLocalService.SETTINGS_KEY, JSON.stringify(this.settings));
//         await this.settingsService.updateSettings(this.toServerSettings(this.settings));
//     }
//
//     /**
//      * Преобразует локальные настройки в серверный формат
//      */
//     private toServerSettings(settings: AppSettings): ServerSettings {
//         return {
//             hide_password_strength_widget: settings.general.hideFlowerStrengthWidget,
//             hide_passwords: settings.security.hidePasswords,
//             clear_buffer: settings.security.buffer.clearBuffer,
//             lock_timeout_min: settings.security.lockTimeout
//         };
//     }
//
//     /**
//      * Преобразует серверные настройки в локальный формат
//      */
//     private toLocalSettings(serverSettings: ServerSettings): AppSettings {
//         return {
//             general: {
//                 ...this.settings.general,
//                 hideFlowerStrengthWidget: serverSettings.hide_password_strength_widget
//             },
//             security: {
//                 ...this.settings.security,
//                 hidePasswords: serverSettings.hide_passwords,
//                 lockTimeout: serverSettings.lock_timeout_min,
//                 buffer: {
//                     ...this.settings.security.buffer,
//                     clearBuffer: serverSettings.clear_buffer
//                 }
//             }
//         };
//     }
//
//     /**
//      * Синхронизирует настройки с сервером
//      */
//     async syncSettings(): Promise<void> {
//         try {
//             const serverSettings = await this.settingsService.getSettings();
//             this.settings = this.toLocalSettings(serverSettings);
//             this.saveSettings();
//         } catch (e) {
//             console.error('Не удалось синхронизировать настройки с сервером:', e);
//             // this.toastService.danger('Не удалось синхронизировать настройки с сервером!');
//         }
//     }
//
//     /**
//      * Получает настройки
//      * @param forceSync Принудительная синхронизация с сервером
//      * @returns Локальные или серверные настройки
//      */
//     async getSettings(forceSync: boolean = false): Promise<AppSettings> {
//         if (forceSync || !this.settings) {
//             await this.syncSettings();
//         }
//         return { ...this.settings };
//     }
//
//     /**
//      * Обновляет все настройки
//      * @param settings Новые настройки
//      */
//     async updateSettings(settings: AppSettings): Promise<void> {
//         try {
//             const serverSettings = this.toServerSettings(settings);
//             await this.settingsService.updateSettings(serverSettings);
//             this.settings = { ...settings };
//             this.saveSettings();
//         } catch (e) {
//             throw e instanceof Error ? e : new Error('Не удалось обновить настройки');
//         }
//     }
//
//     /**
//      * Частично обновляет настройки
//      * @param partialSettings
//      */
//     async patchSettings(partialSettings: Partial<ServerSettings>): Promise<void> {
//         try {
//             await this.settingsService.patchSettings(partialSettings);
//             const currentServerSettings = this.toServerSettings(this.settings);
//             const updatedServerSettings = { ...currentServerSettings, ...partialSettings };
//             this.settings = this.toLocalSettings(updatedServerSettings);
//             this.saveSettings();
//         } catch (e) {
//             throw e instanceof Error ? e : new Error('Не удалось обновить настройки');
//         }
//     }
//
//     /**
//      * Получение всех настроек
//      */
//     getAllSettings(): AppSettings {
//         return { ...this.settings };
//     }
//
//     // Геттеры и сеттеры для general
//
//     getHighContrastMode(): boolean {
//         return this.settings.general.highContrastMode;
//     }
//
//     setHighContrastMode(enabled: boolean): void {
//         this.settings.general.highContrastMode = enabled;
//         this.saveSettings();
//     }
//
//     getHideFlowerStrengthWidget(): boolean {
//         return this.settings.general.hideFlowerStrengthWidget;
//     }
//
//     async setHideFlowerStrengthWidget(enabled: boolean) {
//         this.settings.general.hideFlowerStrengthWidget = enabled;
//         await this.saveSettings();
//     }
//
//     // Геттеры и сеттеры для security
//
//     getLockTimeout(): number {
//         return this.settings.security.lockTimeout;
//     }
//
//     async setLockTimeout(minutes: number) {
//         this.settings.security.lockTimeout = Math.max(1, Math.min(60, minutes));
//         await this.saveSettings();
//     }
//
//     getHidePasswords(): boolean {
//         return this.settings.security.hidePasswords;
//     }
//
//     async setHidePasswords(hide: boolean) {
//         this.settings.security.hidePasswords = hide;
//         await this.saveSettings();
//     }
//
//     getTwoFactorEnabled(): boolean {
//         return this.settings.security.twoFactorEnabled;
//     }
//
//     async setTwoFactorEnabled(enabled: boolean) {
//         this.settings.security.twoFactorEnabled = enabled;
//         await this.saveSettings();
//     }
//
//     getClearBuffer(): boolean {
//         return this.settings.security.buffer.clearBuffer;
//     }
//
//     async setClearBuffer(enabled: boolean) {
//         this.settings.security.buffer.clearBuffer = enabled;
//         await this.saveSettings();
//     }
//
//     getClearBufferTimeout(): number {
//         return this.settings.security.buffer.clearBufferTimeout;
//     }
//
//     async setClearBufferTimeout(timeout: number) {
//         this.settings.security.buffer.clearBufferTimeout = Math.max(1000, Math.min(60000, timeout));
//         await this.saveSettings();
//     }
// }

import { Injectable } from '@angular/core';
import {AppSettings, ServerSettings} from "../../interfaces/data/appSettings.interface";
import {SettingsService} from "../routes/settings/settings.service";

@Injectable({
    providedIn: 'root'
})
export class SettingsLocalService {
    private static readonly SETTINGS_KEY = 'app_settings';
    private settings: AppSettings = {
        general: {
            highContrastMode: false,
            hideFlowerStrengthWidget: true
        },
        security: {
            lockTimeout: 3,
            hidePasswords: true,
            twoFactorEnabled: false,
            buffer: {
                clearBuffer: true,
                clearBufferTimeout: 20000
            }
        }
    };

    constructor(
        private settingsService: SettingsService,
    ) {
        this.loadSettings();
    }

    /**
     * Загружает настройки из localStorage
     */
    public loadSettings(): void {
        const storedSettings = localStorage.getItem(SettingsLocalService.SETTINGS_KEY);
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                this.settings = {
                    general: { ...this.settings.general, ...parsedSettings.general },
                    security: { ...this.settings.security, ...parsedSettings.security }
                };
                console.log(this.settings);
            } catch (error) {
                console.error('Ошибка при загрузке настроек:', error);
                this.saveSettings();
            }
        }
    }

    /**
     * Сохраняет настройки в localStorage
     */
    private async saveSettings() {
        localStorage.setItem(SettingsLocalService.SETTINGS_KEY, JSON.stringify(this.settings));
        await this.settingsService.updateSettings(this.toServerSettings(this.settings));
    }

    /**
     * Преобразует локальные настройки в серверный формат
     */
    private toServerSettings(settings: AppSettings): ServerSettings {
        return {
            hide_password_strength_widget: settings.general.hideFlowerStrengthWidget,
            hide_passwords: settings.security.hidePasswords,
            clear_buffer: settings.security.buffer.clearBuffer,
            lock_timeout_min: settings.security.lockTimeout
        };
    }

    /**
     * Преобразует серверные настройки в локальный формат
     */
    private toLocalSettings(serverSettings: ServerSettings): AppSettings {
        return {
            general: {
                ...this.settings.general,
                hideFlowerStrengthWidget: serverSettings.hide_password_strength_widget
            },
            security: {
                ...this.settings.security,
                hidePasswords: serverSettings.hide_passwords,
                lockTimeout: serverSettings.lock_timeout_min,
                buffer: {
                    ...this.settings.security.buffer,
                    clearBuffer: serverSettings.clear_buffer
                },
                twoFactorEnabled: false
            }
        };
    }

    /**
     * Синхронизирует настройки с сервером
     */
    async syncSettings(): Promise<void> {
        try {
            const serverSettings = await this.settingsService.getSettings();
            console.log(serverSettings);
            this.settings = this.toLocalSettings(serverSettings);
            await this.saveSettings();
        } catch (e) {
            console.error('Не удалось синхронизировать настройки с сервером:', e);
            // this.toastService.danger('Не удалось синхронизировать настройки с сервером!');
        }
    }

    /**
     * Получает настройки
     * @param forceSync Принудительная синхронизация с сервером
     * @returns Локальные или серверные настройки
     */
    async getSettings(forceSync: boolean = false): Promise<AppSettings> {
        if (forceSync || !this.settings) {
            await this.syncSettings();
        }
        return { ...this.settings };
    }

    /**
     * Обновляет все настройки
     * @param settings Новые настройки
     */
    async updateSettings(settings: AppSettings): Promise<void> {
        try {
            const serverSettings = this.toServerSettings(settings);
            await this.settingsService.updateSettings(serverSettings);
            this.settings = { ...settings };
            this.saveSettings();
        } catch (e) {
            throw e instanceof Error ? e : new Error('Не удалось обновить настройки');
        }
    }

    /**
     * Частично обновляет настройки
     * @param partialSettings
     */
    async patchSettings(partialSettings: Partial<ServerSettings>): Promise<void> {
        try {
            await this.settingsService.patchSettings(partialSettings);
            const currentServerSettings = this.toServerSettings(this.settings);
            const updatedServerSettings = { ...currentServerSettings, ...partialSettings };
            this.settings = this.toLocalSettings(updatedServerSettings);
            this.saveSettings();
        } catch (e) {
            throw e instanceof Error ? e : new Error('Не удалось обновить настройки');
        }
    }

    /**
     * Получение всех настроек
     */
    getAllSettings(): AppSettings {
        return { ...this.settings };
    }

    // Геттеры и сеттеры для general

    getHighContrastMode(): boolean {
        return this.settings.general.highContrastMode;
    }

    setHighContrastMode(enabled: boolean): void {
        this.settings.general.highContrastMode = enabled;
        this.saveSettings();
    }

    getHideFlowerStrengthWidget(): boolean {
        return this.settings.general.hideFlowerStrengthWidget;
    }

    async setHideFlowerStrengthWidget(enabled: boolean) {
        this.settings.general.hideFlowerStrengthWidget = enabled;
        await this.saveSettings();
    }

    // Геттеры и сеттеры для security

    getLockTimeout(): number {
        return this.settings.security.lockTimeout;
    }

    async setLockTimeout(minutes: number) {
        this.settings.security.lockTimeout = Math.max(1, Math.min(60, minutes));
        await this.saveSettings();
    }

    getHidePasswords(): boolean {
        return this.settings.security.hidePasswords;
    }

    async setHidePasswords(hide: boolean) {
        this.settings.security.hidePasswords = hide;
        await this.saveSettings();
    }

    getTwoFactorEnabled(): boolean {
        return this.settings.security.twoFactorEnabled;
    }

    async setTwoFactorEnabled(enabled: boolean) {
        this.settings.security.twoFactorEnabled = enabled;
        await this.saveSettings();
    }

    getClearBuffer(): boolean {
        return this.settings.security.buffer.clearBuffer;
    }

    async setClearBuffer(enabled: boolean) {
        this.settings.security.buffer.clearBuffer = enabled;
        await this.saveSettings();
    }

    getClearBufferTimeout(): number {
        return this.settings.security.buffer.clearBufferTimeout;
    }

    async setClearBufferTimeout(timeout: number) {
        this.settings.security.buffer.clearBufferTimeout = Math.max(1000, Math.min(60000, timeout));
        await this.saveSettings();
    }
}