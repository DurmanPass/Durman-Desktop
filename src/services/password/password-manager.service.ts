import {PasswordEntryInterface} from "../../interfaces/data/passwordEntry.interface";
export class PasswordManagerService {
    private static entries: PasswordEntryInterface[] = [];

    // Получение количества записей
    public static getEntriesCount(): number {
        return this.entries.length;
    }

    // Добавление новой записи
    public static addEntry(entry: PasswordEntryInterface): void {
        if (!entry.id) {
            entry.id = this.generateUniqueId();
        }
        this.entries.push(entry);
    }

    // Удаление записи по ID
    public static removeEntry(id: string): boolean {
        const initialLength = this.entries.length;
        this.entries = this.entries.filter(entry => entry.id !== id);
        return initialLength !== this.entries.length; // Возвращает true, если запись была удалена
    }

    // Получение всех записей
    public static getAllEntries(): PasswordEntryInterface[] {
        return [...this.entries]; // Возвращаем копию массива для защиты данных
    }

    // Геттеры
    public static getEntryById(id: string): PasswordEntryInterface | undefined {
        return this.entries.find(entry => entry.id === id);
    }

    public static getEntriesByName(name: string): PasswordEntryInterface[] {
        return this.entries.filter(entry => entry.name.toLowerCase().includes(name.toLowerCase()));
    }

    public static getEntriesByCategory(category: string): PasswordEntryInterface[] {
        return this.entries.filter(entry => entry.metadata.category === category);
    }

    public static getFavoriteEntries(): PasswordEntryInterface[] {
        return this.entries.filter(entry => entry.security.isFavorite);
    }

    // Сеттеры
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

    // Вспомогательная функция для генерации уникального ID
    private static generateUniqueId(): string {
        return 'entry_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // Очистка всех записей (опционально)
    public static clearEntries(): void {
        this.entries = [];
    }

    // Сортировка
    public static getEntriesSortedBy(
        criterion: 'name' | 'createdAt' | 'updatedAt' | 'usageCount',
        order: 'asc' | 'desc' = 'asc'
    ): PasswordEntryInterface[] {
        const sortedEntries = [...this.entries]; // Копируем массив

        const sortFunctions: Record<string, (a: PasswordEntryInterface, b: PasswordEntryInterface) => number> = {
            name: (a, b) => a.name.localeCompare(b.name),
            createdAt: (a, b) => new Date(a.metadata.createdAt).getTime() - new Date(b.metadata.createdAt).getTime(),
            updatedAt: (a, b) => new Date(a.metadata.updatedAt).getTime() - new Date(b.metadata.updatedAt).getTime(),
            usageCount: (a, b) => a.metadata.usageCount - b.metadata.usageCount
        };

        sortedEntries.sort(sortFunctions[criterion]);
        if (order === 'desc') sortedEntries.reverse();

        return sortedEntries;
    }
}
// Пример использования
const newEntry: PasswordEntryInterface = {
    id: '',
    name: 'GitHub',
    description: 'My GitHub account',
    favicon: 'https://github.com/favicon.ico',
    credentials: {
        username: 'user123',
        email: 'user@example.com',
        password: 'securePass123!',
        phoneNumber: '+79999999999',
        passwordStrength: 4,
        pin: '2345',
        twoFactorCode: '',
        recoveryCodes: ['abc123', 'xyz789']
    },
    location: {
        url: 'https://github.com/login',
        domain: 'github.com'
    },
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: '',
        usageCount: 0,
        tags: ['work', 'dev'],
        category: 'Development'
    },
    security: {
        isFavorite: true,
        requires2FA: true,
        sensitive: false
    }
};
const newEntry2: PasswordEntryInterface = {
    id: '',
    name: 'Instagram',
    description: 'My Instagram account',
    favicon: 'https://github.com/favicon.ico',
    credentials: {
        username: 'user123',
        email: 'user@example.com',
        password: 'sec',
        passwordStrength: 1,
        phoneNumber: '',
        pin: '',
        twoFactorCode: '',
        recoveryCodes: ['abc123', 'xyz789']
    },
    location: {
        url: 'https://instagram.com',
        domain: 'instagram.com'
    },
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: '',
        usageCount: 0,
        tags: ['work', 'dev'],
        category: 'Personal'
    },
    security: {
        isFavorite: true,
        requires2FA: true,
        sensitive: false
    }
};
const newEntry3: PasswordEntryInterface = {
    id: '3',
    name: 'Facebook',
    description: 'My GitHub account',
    favicon: '',
    credentials: {
        username: 'user123',
        email: 'user@example.com',
        password: 'sec',
        passwordStrength: 1,
        phoneNumber: '',
        pin: '',
        twoFactorCode: '',
        recoveryCodes: ['abc123', 'xyz789']
    },
    location: {
        url: 'https://facebook.com',
        domain: 'facebook.com'
    },
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: '',
        usageCount: 0,
        tags: ['work', 'dev'],
        category: 'Personal'
    },
    security: {
        isFavorite: true,
        requires2FA: true,
        sensitive: false
    }
};
const newEntry4: PasswordEntryInterface = {
    id: '4',
    name: 'YouTube',
    description: 'My GitHub account',
    favicon: '',
    credentials: {
        username: 'user123',
        email: 'user@example.com',
        password: 'sec',
        passwordStrength: 1,
        phoneNumber: '',
        pin: '',
        twoFactorCode: '',
        recoveryCodes: ['abc123', 'xyz789']
    },
    location: {
        url: 'https://youtube.com',
        domain: 'youtube.com'
    },
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUsed: '',
        usageCount: 0,
        tags: ['work', 'dev'],
        category: 'Personal'
    },
    security: {
        isFavorite: true,
        requires2FA: true,
        sensitive: false
    }
};
const newEntry5: PasswordEntryInterface = {
    id: '5',
    name: 'Gmail',
    description: 'Primary email account',
    favicon: '',
    credentials: {
        username: 'john.doe',
        email: 'john.doe@gmail.com',
        password: 'P@ssw0rd123',
        passwordStrength: 3,
        phoneNumber: '+1-555-123-4567',
        pin: '',
        twoFactorCode: '123456',
        recoveryCodes: ['rec987', 'rec654']
    },
    location: {
        url: 'https://mail.google.com',
        domain: 'google.com'
    },
    metadata: {
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-03-10').toISOString(),
        lastUsed: new Date('2025-03-20').toISOString(),
        usageCount: 42,
        tags: ['email', 'personal'],
        category: 'Communication'
    },
    security: {
        isFavorite: false,
        requires2FA: true,
        sensitive: true
    }
};
const newEntry6: PasswordEntryInterface = {
    id: '8',
    name: 'Netflix',
    description: 'Streaming account',
    favicon: '',
    credentials: {
        username: '',
        email: 'movie.fan@example.com',
        password: '12345', // Переиспользуемый слабый пароль
        passwordStrength: 1,
        phoneNumber: '',
        pin: '',
        twoFactorCode: '',
        recoveryCodes: []
    },
    location: {
        url: 'https://netflix.com',
        domain: 'netflix.com'
    },
    metadata: {
        createdAt: new Date('2023-09-10').toISOString(),
        updatedAt: new Date('2024-12-01').toISOString(),
        lastUsed: new Date('2025-03-21').toISOString(),
        usageCount: 25,
        tags: ['entertainment'],
        category: 'Media'
    },
    security: {
        isFavorite: false,
        requires2FA: false,
        sensitive: false
    }
};

const newEntry7: PasswordEntryInterface = {
    id: '9',
    name: 'Work VPN',
    description: 'Remote access to company network',
    favicon: '',
    credentials: {
        username: 'employee007',
        email: 'employee007@company.com',
        password: '12345', // Переиспользуемый слабый пароль
        passwordStrength: 1,
        phoneNumber: '',
        pin: '7890',
        twoFactorCode: '987654',
        recoveryCodes: ['vpn123']
    },
    location: {
        url: 'https://vpn.company.com',
        domain: 'company.com'
    },
    metadata: {
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2025-01-20').toISOString(),
        lastUsed: '',
        usageCount: 3,
        tags: ['work', 'vpn'],
        category: 'Work'
    },
    security: {
        isFavorite: false,
        requires2FA: true,
        sensitive: true
    }
};

const newEntry8: PasswordEntryInterface = {
    id: '9',
    name: 'UnsafeSite',
    description: 'Remote access to company network',
    favicon: '',
    credentials: {
        username: 'employee007',
        email: 'employee007@company.com',
        password: '12345', // Переиспользуемый слабый пароль
        passwordStrength: 1,
        phoneNumber: '',
        pin: '7890',
        twoFactorCode: '987654',
        recoveryCodes: ['vpn123']
    },
    location: {
        url: 'http://site.fake/login',
        domain: 'site.fake'
    },
    metadata: {
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2025-01-20').toISOString(),
        lastUsed: '',
        usageCount: 3,
        tags: ['work', 'vpn'],
        category: 'Work'
    },
    security: {
        isFavorite: false,
        requires2FA: true,
        sensitive: true
    }
};

PasswordManagerService.addEntry(newEntry);
PasswordManagerService.addEntry(newEntry2);
PasswordManagerService.addEntry(newEntry3);
PasswordManagerService.addEntry(newEntry4);
PasswordManagerService.addEntry(newEntry5);
PasswordManagerService.addEntry(newEntry6);
PasswordManagerService.addEntry(newEntry7);
PasswordManagerService.addEntry(newEntry8);