import { Injectable } from '@angular/core';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import {PasswordManagerService} from "./password-manager.service";
import {PasswordEntryInterface} from "../../interfaces/data/passwordEntry.interface";
import {DecryptValue} from "../../utils/crypto.utils";

@Injectable({
    providedIn: 'root',
})
export class PasswordStrengthService {
    constructor() {
        this.configureZxcvbn();
    }

    private configureZxcvbn(): void {
        const options = {
            translations: zxcvbnEnPackage.translations,
            graphs: zxcvbnCommonPackage.adjacencyGraphs,
            dictionary: {
                ...zxcvbnCommonPackage.dictionary,
                ...zxcvbnEnPackage.dictionary,
            },
        };

        zxcvbnOptions.setOptions(options);
    }

    evaluatePassword(password: string) {
        return zxcvbn(password);
    }

    getPasswordScore(password: string): number {
        return this.evaluatePassword(password).score;
    }

    getPasswordFeedback(password: string) {
        return this.evaluatePassword(password).feedback;
    }

    /**
     * Вычисляет общую защиту всех паролей в процентах
     * @returns Процент защиты (0-100)
     */
    getOverallPasswordStrengthPercentage(): number {
        const entries = PasswordManagerService.getAllEntries();

        if (entries.length === 0) {
            return 0; // Если паролей нет, возвращаем 0%
        }

        // Создаём Set для уникальных ID, чтобы избежать дубликатов
        const uniqueEntriesMap = new Map<string, PasswordEntryInterface>();
        entries.forEach(entry => {
            if (entry.id && !uniqueEntriesMap.has(entry.id)) {
                uniqueEntriesMap.set(entry.id, entry);
            }
        });

        const uniqueEntries = Array.from(uniqueEntriesMap.values());
        if (uniqueEntries.length === 0) {
            return 0;
        }

        // Суммируем значения passwordStrength
        const totalStrength = uniqueEntries.reduce((sum, entry) => {
            const strength = entry.credentials.passwordStrength ?? this.getPasswordScore(entry.credentials.password || '');
            return sum + strength;
        }, 0);

        // Вычисляем среднее значение (максимальная сила = 4 в zxcvbn)
        const maxStrengthPerPassword = 4;
        const averageStrength = totalStrength / uniqueEntries.length;

        // Преобразуем в проценты (от 0 до 100)
        const percentage = (averageStrength / maxStrengthPerPassword) * 100;

        return Math.round(percentage); // Округляем до целого числа
    }

    /**
     * Подсчитывает количество слабых паролей (сила от 0 до 2 включительно)
     * @returns Количество слабых паролей
     */
    getWeakPasswordsCount(): number {
        const entries = PasswordManagerService.getAllEntries();

        if (entries.length === 0) {
            return 0;
        }

        // Фильтруем уникальные записи по id
        const uniqueEntriesMap = new Map<string, PasswordEntryInterface>();
        entries.forEach(entry => {
            if (entry.id && !uniqueEntriesMap.has(entry.id)) {
                uniqueEntriesMap.set(entry.id, entry);
            }
        });

        const uniqueEntries = Array.from(uniqueEntriesMap.values());
        if (uniqueEntries.length === 0) {
            return 0;
        }

        // Подсчитываем слабые пароли (сила <= 2)
        const weakPasswordsCount = uniqueEntries.filter(entry => {
            const strength = entry.credentials.passwordStrength ?? this.getPasswordScore(entry.credentials.password || '');
            return strength <= 2;
        }).length;

        return weakPasswordsCount;
    }

    /**
     * Подсчитывает общее количество паролей с уникальными ID
     * @returns Количество уникальных паролей
     */
    getUniquePasswordsCount(): number {
        const entries = PasswordManagerService.getAllEntries();

        if (entries.length === 0) {
            return 0;
        }

        // Фильтруем по уникальным ID
        const uniqueEntriesMap = new Map<string, PasswordEntryInterface>();
        entries.forEach(entry => {
            if (entry.id && !uniqueEntriesMap.has(entry.id)) {
                uniqueEntriesMap.set(entry.id, entry);
            }
        });

        return uniqueEntriesMap.size; // Возвращаем количество уникальных записей
    }

    /**
     * Подсчитывает количество переиспользуемых паролей (паролей, которые встречаются более одного раза)
     * @returns Количество переиспользуемых паролей
     */
    getReusedPasswordsCount(): number {
        const entries = PasswordManagerService.getAllEntries();
        if (entries.length === 0) return 0;

        // Фильтруем по уникальным ID
        const uniqueEntriesMap = new Map<string, PasswordEntryInterface>();
        entries.forEach(entry => {
            if (entry.id && !uniqueEntriesMap.has(entry.id)) {
                uniqueEntriesMap.set(entry.id, entry);
            }
        });

        const uniqueEntries = Array.from(uniqueEntriesMap.values());
        if (uniqueEntries.length === 0) return 0;

        // Подсчитываем частоту появления каждого пароля
        const passwordFrequency = new Map<string, number>();
        uniqueEntries.forEach(entry => {
            const password = entry.credentials.password || '';
            passwordFrequency.set(password, (passwordFrequency.get(password) || 0) + 1);
        });

        // Подсчитываем пароли, которые встречаются более одного раза
        let reusedCount = 0;
        passwordFrequency.forEach((count, password) => {
            if (count > 1 && password !== '') { // Исключаем пустые пароли
                reusedCount += count; // Добавляем все записи с переиспользуемым паролем
            }
        });

        return reusedCount;
    }

    /**
     * Возвращает записи с переиспользуемыми паролями
     * @returns Массив записей, где пароли используются более одного раза
     */
    async getReusedPasswords(): Promise<PasswordEntryInterface[]> {
        const entries = await Promise.all(
            PasswordManagerService.getAllEntries().map(async (entry) => {
                entry.credentials.password = await DecryptValue(
                    entry.credentials.password,
                    entry.credentials.encryption_iv
                );
                return entry;
            })
        );

        if (entries.length === 0) return [];

        // Фильтруем по уникальным ID
        const uniqueEntriesMap = new Map<string, PasswordEntryInterface>();
        entries.forEach(entry => {
            if (entry.id && !uniqueEntriesMap.has(entry.id)) {
                uniqueEntriesMap.set(entry.id, entry);
            }
        });

        const uniqueEntries = Array.from(uniqueEntriesMap.values());
        if (uniqueEntries.length === 0) return [];

        // Подсчитываем частоту появления каждого пароля
        const passwordFrequency = new Map<string, { count: number, entries: PasswordEntryInterface[] }>();
        uniqueEntries.forEach(entry => {
            const password = entry.credentials.password || '';
            const current = passwordFrequency.get(password) || { count: 0, entries: [] };
            current.count += 1;
            current.entries.push(entry);
            passwordFrequency.set(password, current);
        });

        // Собираем записи с переиспользуемыми паролями
        const reusedEntries: PasswordEntryInterface[] = [];
        passwordFrequency.forEach((data, password) => {
            if (data.count > 1 && password !== '') {
                reusedEntries.push(...data.entries);
            }
        });

        return reusedEntries;
    }
}
