import { Injectable } from '@angular/core';
import {PasswordEntryInterface} from "../../interfaces/data/passwordEntry.interface";

@Injectable({
    providedIn: 'root'
})
export class JsonParserService {
    parseJsonToPasswordEntries(jsonContent: string): PasswordEntryInterface[] {
        try {
            const parsed = JSON.parse(jsonContent);
            if (!Array.isArray(parsed)) {
                throw new Error('JSON content must be an array');
            }

            return parsed.map((item: any, index: number) => {
                // Валидация структуры
                if (!this.isValidPasswordEntry(item)) {
                    throw new Error(`Invalid PasswordEntry structure at index ${index}`);
                }

                return {
                    id: item.id || null,
                    name: item.name || null,
                    description: item.description || null,
                    favicon: item.favicon || null,
                    credentials: {
                        username: item.credentials?.username || null,
                        email: item.credentials?.email || null,
                        password: item.credentials?.password || null,
                        encryption_iv: item.credentials?.encryption_iv || null,
                        phoneNumber: item.credentials?.phoneNumber || null,
                        passwordStrength: item.credentials?.passwordStrength || null,
                        pin: item.credentials?.pin || null,
                        twoFactorCode: item.credentials?.twoFactorCode || null,
                        recoveryCodes: item.credentials?.recoveryCodes || null
                    },
                    location: {
                        url: item.location?.url || null,
                        domain: item.location?.domain || null
                    },
                    metadata: {
                        createdAt: item.metadata?.createdAt || null,
                        updatedAt: item.metadata?.updatedAt || null,
                        lastUsed: item.metadata?.lastUsed || null,
                        usageCount: item.metadata?.usageCount || null,
                        tags: item.metadata?.tags || null,
                        category: item.metadata?.category || null,
                        categoryLabel: item.metadata?.categoryLabel || null
                    },
                    security: {
                        isFavorite: item.security?.isFavorite || null,
                        requires2FA: item.security?.requires2FA || null,
                        sensitive: item.security?.sensitive || null
                    }
                } as PasswordEntryInterface;
            });
        } catch (err) {
            console.error('Error parsing JSON:', err);
            throw new Error('Failed to parse JSON content');
        }
    }

    private isValidPasswordEntry(item: any): boolean {
        return (
            item &&
            typeof item === 'object' &&
            item.credentials &&
            typeof item.credentials === 'object' &&
            item.location &&
            typeof item.location === 'object' &&
            item.metadata &&
            typeof item.metadata === 'object' &&
            item.security &&
            typeof item.security === 'object'
        );
    }
}