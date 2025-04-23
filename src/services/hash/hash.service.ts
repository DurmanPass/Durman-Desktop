import { Injectable } from '@angular/core';
import { readFile } from '@tauri-apps/plugin-fs';

@Injectable({
    providedIn: 'root'
})
export class HashService {
    // Вычисление SHA-256 хэша для строки
    async getStringHash(input: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Вычисление SHA-256 хэша для массива строк
    async getStringsHash(inputs: string[]): Promise<string> {
        const combined = inputs.join('');
        return this.getStringHash(combined);
    }

    // Вычисление SHA-256 хэша для файла
    async getFileHash(filePath: string): Promise<string> {
        try {
            const fileContent = await readFile(filePath);
            const hashBuffer = await crypto.subtle.digest('SHA-256', fileContent);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } catch (err) {
            console.error('Error reading file for hash:', err);
            throw new Error('Failed to compute file hash');
        }
    }
}