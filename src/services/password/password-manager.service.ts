import { Injectable } from '@angular/core';
import { CreatePasswordResponse, PasswordBackendEntry } from '../../interfaces/data/passwordEntry.interface';
import { PasswordEntryInterface } from '../../interfaces/data/passwordEntry.interface';
import {PasswordService} from "../routes/password/password.service";
import {StoreService} from "../vault/store.service";
import {StoreKeys} from "../../shared/const/vault/store.keys";
import {SORT_PASSWORD_ENTRY} from "../../shared/enums/modes/sort-password-entry.enum";

@Injectable({
    providedIn: 'root'
})
export class PasswordManagerService {
    private static entries: PasswordEntryInterface[] = [];

    constructor(private serverPasswordService: PasswordService) {}

    // Преобразование PasswordBackendEntry в PasswordEntryInterface
    private static mapBackendToEntry(backendEntry: PasswordBackendEntry): PasswordEntryInterface {

        return {
            id: backendEntry.id || this.generateUniqueId(),
            name: backendEntry.title,
            description: '',
            favicon: '',
            credentials: {
                username: backendEntry.username || '',
                email: backendEntry.email,
                password: backendEntry.encrypted_password, // Оставляем зашифрованным, расшифровка при необходимости
                phoneNumber: backendEntry.phone,
                passwordStrength: backendEntry.password_strength,
                pin: backendEntry.pin_code,
                twoFactorCode: '',
                recoveryCodes: backendEntry.pin_hints,
                encryption_iv: backendEntry.encryption_iv
            },
            location: {
                url: backendEntry.url,
                domain: backendEntry.domain
            },
            metadata: {
                createdAt: backendEntry.created_at || new Date().toISOString(),
                updatedAt: backendEntry.updated_at || new Date().toISOString(),
                lastUsed: backendEntry.last_used || '',
                usageCount: backendEntry.usage_count || 0,
                tags: [],
                category: backendEntry.category_id || '',
            },
            security: {
                isFavorite: false,
                requires2FA: false,
                sensitive: false
            }
        };
    }

    // Преобразование PasswordEntryInterface в PasswordBackendEntry
    private static async mapEntryToBackend(entry: PasswordEntryInterface): Promise<PasswordBackendEntry> {
        const userId = await StoreService.get(StoreKeys.USER_ID);

        return {
            title: entry.name === '' ? null : entry.name,
            url: entry.location.url === '' ? null : entry.location.url,
            domain: entry.location.domain === '' ? null : entry.location.domain,
            username: entry.credentials.username === '' ? null : entry.credentials.username,
            email: entry.credentials.email === '' ? null : entry.credentials.email,
            phone: entry.credentials.phoneNumber === '' ? null : entry.credentials.phoneNumber,
            encrypted_password: entry.credentials.password === '' ? null : entry.credentials.password,
            encryption_iv: entry.credentials.encryption_iv === '' ? null : entry.credentials.encryption_iv,
            pin_code: entry.credentials.pin === '' ? null : entry.credentials.pin,
            pin_hints: entry.credentials.recoveryCodes? entry.credentials.recoveryCodes : [],
            category_id: entry.metadata.category === '' ? null : entry.metadata.category,
            password_strength: entry.credentials.passwordStrength ?? null,
            id: entry.id === '' ? null : entry.id,
            user_id: userId,
            usage_count: entry.metadata.usageCount ?? null,
            created_at: entry.metadata.createdAt === '' ? null : entry.metadata.createdAt,
            updated_at: entry.metadata.updatedAt === '' ? null : entry.metadata.updatedAt,
            last_used: entry.metadata.lastUsed === '' ? null : entry.metadata.lastUsed
        };
    }

    // Серверные методы
    async syncPasswords(): Promise<void> {
        try {
            const backendEntries = await this.serverPasswordService.getAllPasswords();
            PasswordManagerService.entries = backendEntries.map(entry =>
                PasswordManagerService.mapBackendToEntry(entry)
            );
        } catch (e) {
            // ToastService.danger('Не удалось синхронизировать пароли с сервером!');
            console.error(e);
        }
    }

    async createPassword(password: PasswordEntryInterface): Promise<CreatePasswordResponse> {
        const userId = await StoreService.get(StoreKeys.USER_ID);
        if (!userId) {
            throw new Error('User ID not found in storage');
        }
        console.log(userId);
        try {
            const backendPassword = await PasswordManagerService.mapEntryToBackend(password);
            console.log(backendPassword);
            const response = await this.serverPasswordService.createPassword(backendPassword);
            const newEntry: PasswordEntryInterface = {
                ...password,
                id: response.id,
                metadata: {
                    ...password.metadata,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    usageCount: 0,
                    lastUsed: ''
                }
            };
            PasswordManagerService.entries.push(newEntry);
            return response;
        } catch (e) {
            throw e;
        }
    }

    async getPasswordById(passwordId: string): Promise<PasswordEntryInterface> {
        const localEntry = PasswordManagerService.getEntryById(passwordId);
        if (localEntry) {
            return localEntry;
        }
        try {
            const backendEntry = await this.serverPasswordService.getPasswordById(passwordId);
            const entry = PasswordManagerService.mapBackendToEntry(backendEntry);
            PasswordManagerService.entries.push(entry);
            return entry;
        } catch (e) {
            throw e;
        }
    }

    async updatePassword(passwordId: string, password: PasswordEntryInterface): Promise<void> {
        try {
            const backendPassword = PasswordManagerService.mapEntryToBackend(password);
            await this.serverPasswordService.updatePassword(passwordId, await backendPassword);
            const index = PasswordManagerService.entries.findIndex(e => e.id === passwordId);
            if (index !== -1) {
                PasswordManagerService.entries[index] = { ...password, id: passwordId };
            } else {
                PasswordManagerService.entries.push({ ...password, id: passwordId });
            }
        } catch (e) {
            throw e;
        }
    }

    async deletePassword(passwordId: string): Promise<void> {
        try {
            await this.serverPasswordService.deletePassword(passwordId);
            PasswordManagerService.entries = PasswordManagerService.entries.filter(e => e.id !== passwordId);
        } catch (e) {
            throw e;
        }
    }

    // Локальные методы
    public static getEntriesCount(): number {
        return this.entries.length;
    }

    public static addEntry(entry: PasswordEntryInterface): void {
        if (!entry.id) {
            entry.id = this.generateUniqueId();
        }
        this.entries.push(entry);
    }

    public static removeEntry(id: string): boolean {
        const initialLength = this.entries.length;
        this.entries = this.entries.filter(entry => entry.id !== id);
        return initialLength !== this.entries.length;
    }

    public static getAllEntries(): PasswordEntryInterface[] {
        return [...this.entries];
    }

    public static getEntryById(id: string): PasswordEntryInterface | undefined {
        return this.entries.find(entry => entry.id === id);
    }

    public static getEntriesByName(name: string): PasswordEntryInterface[] {
        return this.entries.filter(entry => entry.name ? entry.name.toLowerCase().includes(name.toLowerCase()) : '');
    }

    public static getEntriesByCategory(category: string): PasswordEntryInterface[] {
        return this.entries.filter(entry => entry.metadata.category === category);
    }

    public static getFavoriteEntries(): PasswordEntryInterface[] {
        return this.entries.filter(entry => entry.security.isFavorite);
    }

    public static setName(id: string, name: string): void {
        const entry = this.getEntryById(id);
        if (entry) entry.name = name;
    }

    public static setDescription(id: string, description: string): void {
        const entry = this.getEntryById(id);
        if (entry) entry.description = description;
    }

    public static setFavicon(id: string, favicon: string): void {
        const entry = this.getEntryById(id);
        if (entry) entry.favicon = favicon;
    }

    public static setCredentials(id: string, credentials: Partial<PasswordEntryInterface['credentials']>): void {
        const entry = this.getEntryById(id);
        if (entry) entry.credentials = { ...entry.credentials, ...credentials };
    }

    public static setLocation(id: string, location: Partial<PasswordEntryInterface['location']>): void {
        const entry = this.getEntryById(id);
        if (entry) entry.location = { ...entry.location, ...location };
    }

    public static setMetadata(id: string, metadata: Partial<PasswordEntryInterface['metadata']>): void {
        const entry = this.getEntryById(id);
        if (entry) entry.metadata = { ...entry.metadata, ...metadata };
    }

    public static setSecurity(id: string, security: Partial<PasswordEntryInterface['security']>): void {
        const entry = this.getEntryById(id);
        if (entry) entry.security = { ...entry.security, ...security };
    }

    private static generateUniqueId(): string {
        return 'entry_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    public static clearEntries(): void {
        this.entries = [];
    }

    // public static getEntriesSortedBy(
    //     criterion: 'name' | 'createdAt' | 'updatedAt' | 'usageCount',
    //     order: 'asc' | 'desc' = 'asc'
    // ): PasswordEntryInterface[] {
    //     const sortedEntries = [...this.entries];
    //     const sortFunctions: Record<string, (a: PasswordEntryInterface, b: PasswordEntryInterface) => number> = {
    //         name: (a, b) => a.name.localeCompare(b.name),
    //         createdAt: (a, b) => new Date(a.metadata.createdAt).getTime() - new Date(b.metadata.createdAt).getTime(),
    //         updatedAt: (a, b) => new Date(a.metadata.updatedAt).getTime() - new Date(b.metadata.updatedAt).getTime(),
    //         usageCount: (a, b) => a.metadata.usageCount - b.metadata.usageCount
    //     };
    //     sortedEntries.sort(sortFunctions[criterion]);
    //     if (order === 'desc') sortedEntries.reverse();
    //     return sortedEntries;
    // }
    public static getEntriesSortedBy(
        criterion: SORT_PASSWORD_ENTRY,
        order: "asc" | "desc" = 'asc'
    ): PasswordEntryInterface[] {
        const sortedEntries = [...this.entries];
        const sortFunctions: Record<string, (a: PasswordEntryInterface, b: PasswordEntryInterface) => number> = {
            name: (a, b) => {
                const aName = a.name ?? '';
                const bName = b.name ?? '';
                return aName.localeCompare(bName);
            },
            createdAt: (a, b) => {
                const aDate = a.metadata.createdAt ? new Date(a.metadata.createdAt).getTime() : 0;
                const bDate = b.metadata.createdAt ? new Date(b.metadata.createdAt).getTime() : 0;
                return aDate - bDate;
            },
            updatedAt: (a, b) => {
                const aDate = a.metadata.updatedAt ? new Date(a.metadata.updatedAt).getTime() : 0;
                const bDate = b.metadata.updatedAt ? new Date(b.metadata.updatedAt).getTime() : 0;
                return aDate - bDate;
            },
            usageCount: (a, b) => {
                const aCount = a.metadata.usageCount ?? 0;
                const bCount = b.metadata.usageCount ?? 0;
                return aCount - bCount;
            }
        };
        sortedEntries.sort(sortFunctions[criterion]);
        if (order === 'desc') sortedEntries.reverse();
        return sortedEntries;
    }
}