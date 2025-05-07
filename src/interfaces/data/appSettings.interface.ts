export interface AppSettings {
    general: {
        highContrastMode: boolean;
        hideFlowerStrengthWidget: boolean;
    };
    security: {
        lockTimeout: number;
        hidePasswords: boolean;
        twoFactorEnabled: boolean;
        buffer: {
            clearBuffer: boolean;
            clearBufferTimeout: number;
        }
    };
}

export interface ServerSettings {
    hide_password_strength_widget: boolean;
    hide_passwords: boolean;
    clear_buffer: boolean;
    lock_timeout_min: number;
}