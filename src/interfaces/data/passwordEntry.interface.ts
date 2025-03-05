export interface PasswordEntryInterface {
    id: string;
    name: string;
    description: string;
    favicon: string;
    credentials: {
        username: string;
        email: string;
        password: string;
        passwordStrength: number;
        pin: string;
        twoFactorCode: string;
        recoveryCodes: string[];
    };
    location: {
        url: string;
        domain: string;
    };
    metadata: {
        createdAt: string;
        updatedAt: string;
        lastUsed: string;
        usageCount: number;
        tags: string[];
        category: string;
    };
    security: {
        isFavorite: boolean;
        requires2FA: boolean;
        sensitive: boolean;
    };
}