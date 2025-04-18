import { PasswordEntryInterface } from "../../interfaces/data/passwordEntry.interface";
import { PasswordManagerService } from "./password-manager.service"; // Предполагаемый путь
import * as XLSX from 'xlsx'; // Для экспорта в Excel
import { invoke } from "@tauri-apps/api/core";
import {writeFile} from "@tauri-apps/plugin-fs";
import {ExportPasswordsHtmlTemplate} from "../../shared/export-templates/passwords/passwords-template.html";
import {AppConstConfig} from "../../shared/const/app/app.const";
import {TauriCommands} from "../../shared/const/app/tauri/tauri.commands";
import {EXPORT_PASSWORDS_TYPES} from "../../shared/enums/export/passwords/export-passwords.enum";
import {DecryptValue} from "../../utils/crypto.utils";


export class PasswordExportService {

    private static baseFilename = AppConstConfig.APP_NAME + AppConstConfig.EXPORT.DEFAULT_EXPORT_FILENAMES.PASSWORD;

    // Получение данных из PasswordManagerService
    private static async getEntries(): Promise<PasswordEntryInterface[]> {
        return await Promise.all(
            PasswordManagerService.getAllEntries().map(async (entry) => {
                entry.credentials.password = await DecryptValue(
                    entry.credentials.password,
                    entry.credentials.encryption_iv
                );
                return entry;
            })
        );
    }

    // Вспомогательная функция для добавления даты к имени файла
    private static getFileNameWithDate(baseName: string, extension: string): string {
        const date = new Date().toISOString().split('T')[0]; // Формат: YYYY-MM-DD
        return `${baseName}_${date}.${extension}`;
    }

    // Экспорт в XLSX
    public static async exportToXlsx(filePath: string, fileName: string = this.baseFilename): Promise<void> {
        const entries = await this.getEntries();
        console.log(entries);
        const worksheetData = entries.map(entry => ({
            Name: entry.name ? entry.name : '-',
            URL: entry.location.url ? entry.location.url : '-',
            Username: entry.credentials.username ? entry.credentials.username : '-',
            Email: entry.credentials.email ? entry.credentials.email : '-',
            PhoneNumber: entry.credentials.phoneNumber ? entry.credentials.phoneNumber : '-',
            Pin: entry.credentials.pin ? entry.credentials.pin : '-',
            PasswordStrength: entry.credentials.passwordStrength ? entry.credentials.passwordStrength : '-',
            Password: entry.credentials.password ? entry.credentials.password : '-',
            Category: entry.metadata.categoryLabel ? entry.metadata.categoryLabel : '-',
            CreatedAt: entry.metadata.createdAt ? entry.metadata.createdAt : '-',
            UpdatedAt: entry.metadata.updatedAt ? entry.metadata.updatedAt : '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Passwords');
        const excelData = XLSX.write(workbook, { bookType:  EXPORT_PASSWORDS_TYPES.XLSX, type: 'array' }); // Uint8Array
        const fullPath = `${filePath}/${this.getFileNameWithDate(fileName, EXPORT_PASSWORDS_TYPES.XLSX)}`;

        // Сохраняем файл через Tauri plugin-fs
        await writeFile(
            fullPath,
            excelData
        );
    }

    public static async exportToHtml(filePath: string, fileName: string = this.baseFilename): Promise<void> {
        const entries = await this.getEntries();
        let htmlTemplate = ExportPasswordsHtmlTemplate;

        // Генерируем строки таблицы
        const tableRows = entries
            .map(
                entry => `
          <tr>
            <td>${entry.name || '-'}</td>
            <td>${entry.location.url || '-'}</td>
            <td>${entry.credentials.username || '-'}</td>
            <td>${entry.credentials.email || '-'}</td>
            <td>${entry.credentials.phoneNumber || '-'}</td>
            <td>${entry.credentials.pin || '-'}</td>
            <td>${entry.credentials.passwordStrength || '-'}</td>
            <td>${entry.credentials.password || '-'}</td>
            <td>${entry.metadata.categoryLabel || 'Все'}</td>
            <td>${entry.metadata.createdAt || '-'}</td>
            <td>${entry.metadata.updatedAt || '-'}</td>
            <td>${entry.description || '-'}</td>
          </tr>
        `
            )
            .join('');

        // Подставляем строки в шаблон
        const htmlContent = htmlTemplate.replace('{{TABLE_ROWS}}', tableRows);
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(htmlContent); // Преобразуем строку в Uint8Array
        const fullPath = `${filePath}/${this.getFileNameWithDate(fileName, EXPORT_PASSWORDS_TYPES.HTML)}`;

        try {
            // Сохраняем файл через Tauri plugin-fs
            await writeFile(fullPath, uint8Array);
            console.log(`HTML file saved successfully at: ${fullPath}`);
        } catch (err) {
            console.error('Error saving HTML file:', err);
            throw new Error('Failed to export to HTML');
        }
    }

    // Экспорт в защищённый паролем ZIP через Tauri
    public static async exportToZip(filePath: string, password: string, fileName: string = this.baseFilename): Promise<void> {
        const entries = this.getEntries();
        const jsonData = JSON.stringify(entries, null, 2);
        const fullPath = `${filePath}/${this.getFileNameWithDate(fileName, EXPORT_PASSWORDS_TYPES.ZIP)}`;

        const savedPath = await invoke<string>(TauriCommands.EXPORT_TO_ENCRYPTED_ZIP, {
            data: jsonData,
            password,
            fileName: fullPath
        });
    }
}