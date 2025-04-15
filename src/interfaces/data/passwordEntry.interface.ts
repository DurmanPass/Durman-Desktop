export interface PasswordEntryInterface {
    id: string | null;
    name: string | null;
    description: string | null;
    favicon: string | null;
    credentials: {
        username: string | null;
        email: string | null;
        password: string | null;
        encryption_iv?: string | null | undefined;
        phoneNumber: string | null;
        passwordStrength: number | null;
        pin: string | null;
        twoFactorCode: string | null;
        recoveryCodes: string[] | null;
    };
    location: {
        url: string | null
        domain: string | null
    };
    metadata: {
        createdAt: string | null;
        updatedAt: string | null;
        lastUsed: string | null;
        usageCount: number | null;
        tags: string[] | null;
        category: string | null;
    };
    security: {
        isFavorite: boolean | null;
        requires2FA: boolean | null;
        sensitive: boolean | null;
    };
}

// export interface PasswordBackendEntry {
//     id?: string;
//     user_id?: string;
//     title: string;
//     url: string;
//     domain: string;
//     username: string | null;
//     email: string;
//     phone: string;
//     encrypted_password: string;
//     encryption_iv: string;
//     pin_code: string;
//     pin_hints: string[];
//     category_id: string | null;
//     usage_count?: number;
//     created_at?: string;
//     updated_at?: string;
//     last_used?: string | null;
//     password_strength: number;
// }

export interface PasswordBackendEntry {
    id?: string | null;
    user_id?: string | null;
    title: string | null;
    url: string | null;
    domain: string | null;
    username: string | null;
    email: string | null;
    phone: string | null;
    encrypted_password: string | null;
    encryption_iv: string | null | undefined;
    pin_code: string | null;
    pin_hints: string[] | null;
    category_id: string | null;
    usage_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    last_used?: string | null;
    password_strength: number | null;
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