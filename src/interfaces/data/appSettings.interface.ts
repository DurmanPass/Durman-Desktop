export interface AppSettings {
    general: {
        highContrastMode: boolean;
        hideFlowerStrengthWidget: boolean;
    };
    security: {
        lockTimeout: number;
        hidePasswords: boolean;
        twoFactorEnabled: boolean;
    };
}