import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import {StoreService} from "../vault/store.service";
import {StoreKeys} from "../../shared/const/vault/store.keys";
import {PasswordEntryInterface} from "../../interfaces/data/passwordEntry.interface";
import {open, save} from "@tauri-apps/plugin-dialog";
import {readFile} from "@tauri-apps/plugin-fs";
import {invoke} from "@tauri-apps/api/core";

@Injectable({
    providedIn: 'root',
})
export class MediaEncryptionService {
    private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private readonly ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg'];
    private readonly ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'webm'];
    private readonly ALLOWED_AUDIO_EXTENSIONS = ['mp3', 'wav'];

    async encryptToMedia(entry: PasswordEntryInterface, mediaType: 'image' | 'video' | 'audio'): Promise<string> {
        const masterPassword = await StoreService.get(StoreKeys.MASTER_PASSWORD);
        const userId = await StoreService.get(StoreKeys.USER_ID);
        if (!masterPassword || !userId) {
            throw new Error('Master password or user ID not found');
        }

        // Собираем непустые поля
        const dataToEncrypt: Partial<PasswordEntryInterface> = {
            id: entry.id,
            name: entry.name,
            description: entry.description,
            favicon: entry.favicon,
            credentials: {
                username: entry.credentials.username,
                email: entry.credentials.email,
                password: entry.credentials.password,
                encryption_iv: entry.credentials.encryption_iv,
                phoneNumber: entry.credentials.phoneNumber,
                passwordStrength: entry.credentials.passwordStrength,
                pin: entry.credentials.pin,
                twoFactorCode: entry.credentials.twoFactorCode,
                recoveryCodes: entry.credentials.recoveryCodes,
            },
            location: {
                url: entry.location.url,
                domain: entry.location.domain,
            },
            metadata: {
                createdAt: entry.metadata.createdAt,
                updatedAt: entry.metadata.updatedAt,
                lastUsed: entry.metadata.lastUsed,
                usageCount: entry.metadata.usageCount,
                tags: entry.metadata.tags,
                category: entry.metadata.category,
                categoryLabel: entry.metadata.categoryLabel,
            },
            security: {
                isFavorite: entry.security.isFavorite,
                requires2FA: entry.security.requires2FA,
                sensitive: entry.security.sensitive,
            },
        };

        // Удаляем null/undefined/пустые поля
        const cleanData = JSON.parse(JSON.stringify(dataToEncrypt, (key, value) => {
            if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
                return undefined;
            }
            return value;
        }));

        const dataString = JSON.stringify(cleanData);
        const dataBuffer = Buffer.from(dataString, 'utf-8');

        // Загружаем медиафайл
        const filePath = await open({
            filters: [{
                name: mediaType.charAt(0).toUpperCase() + mediaType.slice(1),
                extensions: mediaType === 'image' ? this.ALLOWED_IMAGE_EXTENSIONS :
                    mediaType === 'video' ? this.ALLOWED_VIDEO_EXTENSIONS :
                        this.ALLOWED_AUDIO_EXTENSIONS,
            }],
        });

        if (!filePath || typeof filePath !== 'string') {
            throw new Error('No file selected');
        }

        const fileData = await readFile(filePath);
        if (fileData.length > this.MAX_FILE_SIZE) {
            throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)} MB`);
        }

        // Шифруем данные
        const key = await this.deriveKey(masterPassword, userId);
        const encryptedData = await invoke('encrypt_data', {
            data: Buffer.from(dataString).toString('base64'),
            key,
        }) as string;

        let outputPath: string;
        if (mediaType === 'image') {
            outputPath = await this.embedInImage(fileData, Buffer.from(encryptedData, 'base64'), filePath);
        } else {
            outputPath = await this.embedInMedia(fileData, Buffer.from(encryptedData, 'base64'), filePath, mediaType);
        }

        return outputPath;
    }

    async decryptFromMedia(mediaType: 'image' | 'video' | 'audio'): Promise<PasswordEntryInterface> {
        const masterPassword = await StoreService.get(StoreKeys.MASTER_PASSWORD);
        const userId = await StoreService.get(StoreKeys.USER_ID);
        if (!masterPassword || !userId) {
            throw new Error('Master password or user ID not found');
        }

        const filePath = await open({
            filters: [{
                name: mediaType.charAt(0).toUpperCase() + mediaType.slice(1),
                extensions: mediaType === 'image' ? this.ALLOWED_IMAGE_EXTENSIONS :
                    mediaType === 'video' ? this.ALLOWED_VIDEO_EXTENSIONS :
                        this.ALLOWED_AUDIO_EXTENSIONS,
            }],
        });

        if (!filePath || typeof filePath !== 'string') {
            throw new Error('No file selected');
        }

        const fileData = await readFile(filePath);
        if (fileData.length > this.MAX_FILE_SIZE) {
            throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)} MB`);
        }

        const encryptedData = mediaType === 'image' ?
            await this.extractFromImage(fileData) :
            await this.extractFromMedia(fileData, mediaType);

        const key = await this.deriveKey(masterPassword, userId);
        const decryptedData = await invoke('decrypt_data', {
            data: encryptedData.toString('base64'),
            key,
        }) as string;

        return JSON.parse(Buffer.from(decryptedData, 'base64').toString('utf-8'));
    }

    private async deriveKey(masterPassword: string, userId: string): Promise<string> {
        // Генерируем ключ на основе мастер-пароля и userId (пример с PBKDF2)
        return invoke('derive_key', {
            password: masterPassword,
            salt: userId,
            iterations: 100000,
            keyLength: 32,
        }) as Promise<string>;
    }

    private async embedInImage(fileData: Uint8Array, data: Buffer, originalPath: string): Promise<string> {
        // Реализация стеганографии (LSB)
        const outputPath = await save({
            filters: [{ name: 'Image', extensions: ['png'] }],
            defaultPath: originalPath.replace(/\.[^/.]+$/, '_encrypted.png'),
        });

        if (!outputPath) {
            throw new Error('No output path selected');
        }

        // Передаём данные в Rust для стеганографии
        await invoke('embed_in_image', {
            imageData: Buffer.from(fileData).toString('base64'),
            data: data.toString('base64'),
            outputPath,
        });

        return outputPath;
    }

    private async extractFromImage(fileData: Uint8Array): Promise<Buffer> {
        // Извлечение данных из изображения
        const data = await invoke('extract_from_image', {
            imageData: Buffer.from(fileData).toString('base64'),
        }) as string;
        return Buffer.from(data, 'base64');
    }

    private async embedInMedia(fileData: Uint8Array, data: Buffer, originalPath: string, mediaType: 'video' | 'audio'): Promise<string> {
        const outputPath = await save({
            filters: [{ name: mediaType.charAt(0).toUpperCase() + mediaType.slice(1), extensions: [mediaType === 'video' ? 'mp4' : 'mp3'] }],
            defaultPath: originalPath.replace(/\.[^/.]+$/, `_encrypted.${mediaType === 'video' ? 'mp4' : 'mp3'}`),
        });

        if (!outputPath) {
            throw new Error('No output path selected');
        }

        // Встраиваем данные в метаданные
        await invoke('embed_in_media', {
            mediaData: Buffer.from(fileData).toString('base64'),
            data: data.toString('base64'),
            outputPath,
            mediaType,
        });

        return outputPath;
    }

    private async extractFromMedia(fileData: Uint8Array, mediaType: 'video' | 'audio'): Promise<Buffer> {
        const data = await invoke('extract_from_media', {
            mediaData: Buffer.from(fileData).toString('base64'),
            mediaType,
        }) as string;
        return Buffer.from(data, 'base64');
    }
}