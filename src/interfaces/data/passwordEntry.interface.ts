export interface PasswordEntryInterface {
    id: string;
    name: string;
    description: string;
    favicon: string;
    credentials: {
        username: string;
        email: string;
        password: string;
        phoneNumber: string;
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

export interface PasswordBackendEntry {
    id?: string;
    user_id?: string;
    title: string;
    url: string;
    domain: string;
    username: string | null;
    email: string;
    phone: string;
    encrypted_password: string;
    encryption_iv: string;
    pin_code: string;
    pin_hints: string[];
    category_id: string | null;
    usage_count?: number;
    created_at?: string;
    updated_at?: string;
    last_used?: string | null;
    password_strength: number;
}

export interface CreatePasswordResponse {
    id: string;
    message: string;
}

export interface UpdatePasswordResponse {
    message: string;
}

export interface DeletePasswordResponse {
    message: string;
}

export interface ErrorResponse {
    error: string;
}