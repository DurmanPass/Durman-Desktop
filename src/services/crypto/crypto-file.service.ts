import { Injectable } from '@angular/core';
import {save} from "@tauri-apps/plugin-dialog";

@Injectable({
    providedIn: 'root'
})
export class CryptoFileService {
    private readonly ALGORITHM = 'AES-GCM';
    private readonly KEY_DERIVATION_ALGORITHM = 'PBKDF2';
    private readonly ITERATIONS = 100000;
    private readonly KEY_LENGTH = 32; // 256 бит
    private readonly SALT = new TextEncoder().encode('durmanpass-salt');

    /**
     * Шифрует файл с использованием мастер-пароля.
     * @param fileBlob Файл в формате Blob
     * @param masterPassword Мастер-пароль
     * @returns Зашифрованный Blob
     */
    async encryptFile(fileBlob: Blob, masterPassword: string): Promise<Blob> {
        try {
            // Читаем файл как ArrayBuffer
            const fileBuffer = await fileBlob.arrayBuffer();

            // Генерируем ключ из мастер-пароля
            const key = await this.deriveKey(masterPassword);

            // Генерируем случайный IV (инициализационный вектор)
            const iv = crypto.getRandomValues(new Uint8Array(12));

            // Шифруем данные
            const encryptedBuffer = await crypto.subtle.encrypt(
                { name: this.ALGORITHM, iv },
                key,
                fileBuffer
            );

            // Объединяем IV и зашифрованные данные
            const combinedBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
            combinedBuffer.set(iv, 0);
            combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.length);

            return new Blob([combinedBuffer], { type: 'application/octet-stream' });
        } catch (error) {
            throw new Error(`Ошибка шифрования: ${error}`);
        }
    }

    /**
     * Расшифровывает файл с использованием мастер-пароля.
     * @param encryptedBlob Зашифрованный Blob
     * @param masterPassword Мастер-пароль
     * @returns Расшифрованный Blob
     */
    async decryptFile(encryptedBlob: Blob, masterPassword: string): Promise<Blob> {
        try {
            // Читаем зашифрованный файл
            const encryptedBuffer = await encryptedBlob.arrayBuffer();
            const encryptedArray = new Uint8Array(encryptedBuffer);

            // Извлекаем IV (первые 12 байт) и зашифрованные данные
            const iv = encryptedArray.slice(0, 12);
            const data = encryptedArray.slice(12);

            // Генерируем ключ из мастер-пароля
            const key = await this.deriveKey(masterPassword);

            // Расшифровываем данные
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: this.ALGORITHM, iv },
                key,
                data
            );

            return new Blob([decryptedBuffer], { type: 'application/json' });
        } catch (error) {
            throw new Error(`Ошибка расшифрования: ${error}`);
        }
    }

    /**
     * Генерирует криптографический ключ из мастер-пароля с использованием PBKDF2.
     * @param masterPassword Мастер-пароль
     * @returns Криптографический ключ
     */
    private async deriveKey(masterPassword: string): Promise<CryptoKey> {
        const passwordBuffer = new TextEncoder().encode(masterPassword);

        // Импортируем пароль как ключ для PBKDF2
        const baseKey = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: this.KEY_DERIVATION_ALGORITHM },
            false,
            ['deriveKey']
        );

        // Генерируем производный ключ
        return crypto.subtle.deriveKey(
            {
                name: this.KEY_DERIVATION_ALGORITHM,
                salt: this.SALT,
                iterations: this.ITERATIONS,
                hash: 'SHA-256'
            },
            baseKey,
            { name: this.ALGORITHM, length: this.KEY_LENGTH * 8 },
            true,
            ['encrypt', 'decrypt']
        );
    }
}