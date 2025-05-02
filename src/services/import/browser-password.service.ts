import { Injectable } from '@angular/core';
import {PasswordEntryInterface} from "../../interfaces/data/passwordEntry.interface";
import {readTextFile} from "@tauri-apps/plugin-fs";
import {PasswordStrengthService} from "../password/password-strength.service";
import { parse as parseCsv } from 'papaparse';
import {open} from "@tauri-apps/plugin-dialog";

@Injectable({
    providedIn: 'root'
})
export class BrowserPasswordService {
    private passwordStrengthService = new PasswordStrengthService();
    private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    private createEmptyEntry(): PasswordEntryInterface {
        return {
            id: null,
            name: null,
            description: null,
            favicon: null,
            location: {
                url: null,
                domain: null,
            },
            credentials: {
                username: null,
                email: null,
                password: null,
                encryption_iv: null,
                phoneNumber: null,
                passwordStrength: 0,
                pin: null,
                twoFactorCode: null,
                recoveryCodes: [],
            },
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastUsed: null,
                usageCount: 0,
                tags: [],
                category: null,
                categoryLabel: null,
            },
            security: {
                isFavorite: false,
                requires2FA: false,
                sensitive: false,
            },
        };
    }

    private extractDomain(url: string | null): string | null {
        if (!url) return null;
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname;
        } catch {
            return null;
        }
    }

    private isEmail(username: string | null): boolean {
        return username ? this.emailRegex.test(username) : false;
    }

    private convertTimestamp(ms: string | null): string | null {
        if (!ms) return null;
        try {
            const date = new Date(parseInt(ms, 10));
            return date.toISOString();
        } catch {
            return null;
        }
    }

    async parseCsvFile(): Promise<PasswordEntryInterface[]> {
        try {
            const filePath = await open({
                filters: [{name: 'CSV', extensions: ['csv']}],
            });

            if (!filePath || typeof filePath !== 'string') {
                throw new Error('No file selected');
            }

            const csvContent = await readTextFile(filePath);
            const parsed = parseCsv(csvContent, { header: true, skipEmptyLines: true });

            if (parsed.errors.length > 0) {
                throw new Error(`CSV parsing errors: ${parsed.errors.map(e => e.message).join(', ')}`);
            }

            const entries: PasswordEntryInterface[] = [];
            const headers = parsed.meta.fields || [];

            // Определяем тип браузера по заголовкам
            const isChrome = headers.includes('name') && headers.includes('note');
            const isFirefox = headers.includes('httpRealm') && headers.includes('guid');
            const isYandex = headers.includes('comment') && headers.includes('tags');

            for (const row of parsed.data as any[]) {
                const entry = this.createEmptyEntry();

                if (isChrome) {
                    entry.name = row.name || row.username || row.url;
                    entry.location.url = row.url || null;
                    entry.location.domain = this.extractDomain(row.url);
                    entry.credentials.password = row.password || null;
                    entry.description = row.note || null;

                    if (row.username) {
                        if (this.isEmail(row.username)) {
                            entry.credentials.email = row.username;
                        } else {
                            entry.credentials.username = row.username;
                        }
                    }
                } else if (isFirefox) {
                    entry.name = row.username || row.url;
                    entry.location.url = row.url || null;
                    entry.location.domain = this.extractDomain(row.url);
                    entry.credentials.password = row.password || null;
                    entry.id = row.guid || null;
                    entry.metadata.createdAt = this.convertTimestamp(row.timeCreated);
                    entry.metadata.updatedAt = this.convertTimestamp(row.timePasswordChanged);
                    entry.metadata.lastUsed = this.convertTimestamp(row.timeLastUsed);

                    if (row.username) {
                        if (this.isEmail(row.username)) {
                            entry.credentials.email = row.username;
                        } else {
                            entry.credentials.username = row.username;
                        }
                    }
                } else if (isYandex) {
                    entry.name = row.username || row.url;
                    entry.location.url = row.url || null;
                    entry.location.domain = this.extractDomain(row.url);
                    entry.credentials.password = row.password || null;
                    entry.description = row.comment || null;
                    entry.metadata.tags = row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [];

                    if (row.username) {
                        if (this.isEmail(row.username)) {
                            entry.credentials.email = row.username;
                        } else {
                            entry.credentials.username = row.username;
                        }
                    }
                } else {
                    throw new Error('Unsupported CSV format');
                }

                // Рассчитываем passwordStrength (примерная реализация)
                entry.credentials.passwordStrength = this.passwordStrengthService.getPasswordScore(entry.credentials.password ? entry.credentials.password : '');


                entries.push(entry);
            }

            return entries;
        } catch (error) {
            throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private calculatePasswordStrength(password: string | null): number {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        return Math.min(strength, 100);
    }
}