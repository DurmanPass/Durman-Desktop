import { PasswordEntryInterface } from "../../interfaces/data/passwordEntry.interface";
import { PasswordManagerService } from "./password-manager.service"; // Предполагаемый путь
import * as XLSX from 'xlsx'; // Для экспорта в Excel
import { invoke } from "@tauri-apps/api/core";
import {writeFile} from "@tauri-apps/plugin-fs";
import {ExportPasswordsHtmlTemplate} from "../../shared/export-templates/passwords/passwords-template.html";
import {AppConstConfig} from "../../shared/const/app/app.const";
import {TauriCommands} from "../../shared/const/app/tauri/tauri.commands";
import {EXPORT_PASSWORDS_TYPES} from "../../shared/enums/export/passwords/export-passwords.enum";


export class PasswordExportService {

    private static baseFilename = AppConstConfig.APP_NAME + AppConstConfig.EXPORT.DEFAULT_EXPORT_FILENAMES.PASSWORD;

    // Получение данных из PasswordManagerService
    private static getEntries(): PasswordEntryInterface[] {
        return PasswordManagerService.getAllEntries();
    }

    // Вспомогательная функция для добавления даты к имени файла
    private static getFileNameWithDate(baseName: string, extension: string): string {
        const date = new Date().toISOString().split('T')[0]; // Формат: YYYY-MM-DD
        return `${baseName}_${date}.${extension}`;
    }

    // Экспорт в XLSX
    public static async exportToXlsx(filePath: string, fileName: string = this.baseFilename): Promise<void> {
        const entries = this.getEntries();
        const worksheetData = entries.map(entry => ({
            Name: entry.name,
            URL: entry.location.url,
            Username: entry.credentials.username,
            Password: entry.credentials.password,
            Category: entry.metadata.category,
            CreatedAt: entry.metadata.createdAt,
            UpdatedAt: entry.metadata.updatedAt
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Passwords');
        const excelData = XLSX.write(workbook, { bookType:  EXPORT_PASSWORDS_TYPES.XLSX, type: 'array' }); // Uint8Array
        const fullPath = `${filePath}/${this.getFileNameWithDate(fileName, EXPORT_PASSWORDS_TYPES.XLSX)}`;

        // Сохраняем файл через Tauri plugin-fs
        await writeFile(
            fullPath,
            excelData // Передаём Uint8Array напрямую
        );
    }

    // Экспорт в HTML
    public static async exportToHtml(filePath: string, fileName: string = this.baseFilename): Promise<void> {
        const entries = this.getEntries();
        let htmlTemplate = ExportPasswordsHtmlTemplate;

        // Генерируем строки таблицы
        const tableRows = entries
            .map(
                entry => `
          <tr>
            <td>${entry.name}</td>
            <td>${entry.location.url}</td>
            <td>${entry.credentials.username}</td>
            <td>${entry.credentials.password}</td>
            <td>${entry.metadata.category}</td>
          </tr>
        `
            )
            .join('');

        // Подставляем строки в шаблон
        const htmlContent = htmlTemplate.replace('{{TABLE_ROWS}}', tableRows);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const fullPath = `${filePath}/${this.getFileNameWithDate(fileName, EXPORT_PASSWORDS_TYPES.HTML)}`;

        // Вызываем Rust-команду для сохранения файла
        const savedPath = await invoke<string>(TauriCommands.SAVE_FILE, {
            data: Array.from(uint8Array), // Преобразуем Uint8Array в массив
            filePath: fullPath
        });
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