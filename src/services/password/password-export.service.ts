import { PasswordEntryInterface } from "../../interfaces/data/passwordEntry.interface";
import { PasswordManagerService } from "./password-manager.service"; // Предполагаемый путь
import * as XLSX from 'xlsx'; // Для экспорта в Excel
import jsPDF from 'jspdf'; // Для экспорта в PDF
import autoTable from 'jspdf-autotable'; // Для таблиц в PDF
import {invoke} from "@tauri-apps/api/core";

export class PasswordExportService {
    // Получение данных из PasswordManagerService
    private static getEntries(): PasswordEntryInterface[] {
        return PasswordManagerService.getAllEntries();
    }

    // Экспорт в XLSX
    public static exportToXlsx(fileName: string = 'passwords.xlsx'): void {
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
        XLSX.writeFile(workbook, fileName);
    }

    // Экспорт в HTML
    public static exportToHtml(fileName: string = 'passwords.html'): void {
        const entries = this.getEntries();
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Passwords</title>
        <style>
          table { border-collapse: collapse; width: 100%; max-width: 800px; margin: 20px auto; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Ваши пароли</h1>
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>URL</th>
              <th>Имя пользователя</th>
              <th>Пароль</th>
              <th>Категория</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(entry => `
              <tr>
                <td>${entry.name}</td>
                <td>${entry.location.url}</td>
                <td>${entry.credentials.username}</td>
                <td>${entry.credentials.password}</td>
                <td>${entry.metadata.category}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        this.downloadFile(blob, fileName);
    }

    // Экспорт в PDF
    public static exportToPdf(fileName: string = 'passwords.pdf'): void {
        const entries = this.getEntries();
        const doc = new jsPDF();
        doc.text('Ваши пароли', 10, 10);

        const tableData = entries.map(entry => [
            entry.name,
            entry.location.url,
            entry.credentials.username,
            entry.credentials.password,
            entry.metadata.category
        ]);

        autoTable(doc, {
            head: [['Название', 'URL', 'Имя пользователя', 'Пароль', 'Категория']],
            body: tableData,
            startY: 20,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [50, 50, 50] }
        });

        doc.save(fileName);
    }

    // Экспорт в защищённый паролем ZIP через Tauri
    public static async exportToZip(password: string, fileName: string = 'passwords.zip'): Promise<void> {
        const entries = this.getEntries();
        const jsonData = JSON.stringify(entries, null, 2);

        // Вызываем Rust-команду через Tauri
        const filePath = await invoke<string>('export_to_encrypted_zip', {
            data: jsonData,
            password,
            fileName
        });

        console.log(`ZIP-файл сохранён по пути: ${filePath}`);
    }

    // Вспомогательная функция для скачивания файла (для HTML и других форматов)
    private static downloadFile(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}