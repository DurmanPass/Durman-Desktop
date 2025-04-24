import {Component, EventEmitter, Output} from '@angular/core';
import {EncryptValue} from "../../../../utils/crypto.utils";
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {readTextFile, stat} from "@tauri-apps/plugin-fs";
import {HashService} from "../../../../services/hash/hash.service";
import {JsonParserService} from "../../../../services/json/json-parser.service";
import {ToastService} from "../../../../services/notification/toast.service";
import {open} from "@tauri-apps/plugin-dialog";
import {DecimalPipe, NgIf} from "@angular/common";
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";

@Component({
  selector: 'app-recovery-passwords-modal',
  standalone: true,
  imports: [
    DecimalPipe,
    NgIf,
    SolidButtonComponent
  ],
  templateUrl: './recovery-passwords-modal.component.html',
  styleUrl: './recovery-passwords-modal.component.css'
})
export class RecoveryPasswordsModalComponent {
  selectedFile: { name: string; size: number } | null = null;
  fileHash: string | null = null;
  fileInfo: { name: string; size: number } | null = null;
  filePath: string | null = null;
  isProcessing: boolean = false;
  @Output() closed = new EventEmitter<void>();

  constructor(
      private hashService: HashService,
      private jsonParserService: JsonParserService,
  ) {}

  async selectFile(): Promise<void> {
    try {
      this.isProcessing = true;
      const filePath = await this.getFilePath();
      await this.handleFile(filePath);
    } catch (err) {
      ToastService.danger('Ошибка при выборе файла');
      console.error('Error selecting file:', err);
      this.resetFile();
    } finally {
      this.isProcessing = false;
    }
  }

  // Обработка файла (чтение, хэширование)
  private async handleFile(filePath: string): Promise<void> {
    console.log('handleFile called with path:', filePath);
    this.filePath = filePath;

    try {
      // Получение информации о файле
      const fileStat = await stat(filePath);
      const fileName = filePath.split(/[\\/]/).pop() || 'unknown.json';
      this.selectedFile = {
        name: fileName,
        size: fileStat.size
      };

      // Вычисление хэша
      this.fileHash = await this.hashService.getFileHash(filePath);
    } catch (err) {
      ToastService.danger('Ошибка при обработке файла');
      console.error('Error handling file:', err);
      this.resetFile();
      throw err;
    }
  }

  // Получение пути к файлу через Tauri dialog
  private async getFilePath(): Promise<string> {
    const filePath = await open({
      filters: [{ name: 'JSON', extensions: ['json'] }],
      multiple: false
    });
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('No file selected');
    }
    return filePath;
  }

  // Восстановление паролей
  async restorePasswords(): Promise<void> {
    if (!this.selectedFile || !this.fileHash || !this.filePath) {
      ToastService.warning('Выберите JSON-файл для восстановления');
      return;
    }

    this.isProcessing = true;
    try {
      const jsonContent = await readTextFile(this.filePath);
      const entries = this.jsonParserService.parseJsonToPasswordEntries(jsonContent);

      // Шифрование паролей
      const encryptedEntries = await Promise.all(
          entries.map(async (entry: PasswordEntryInterface) => {
            if (entry.credentials.password) {
              const iv = entry.credentials.encryption_iv;
              entry.credentials.password = await EncryptValue(entry.credentials.password, iv);
            }
            return entry;
          })
      );

      // Сохранение записей
      // await this.passwordManagerService.saveEntries(encryptedEntries);
      ToastService.success('Пароли успешно восстановлены!');
      this.closeModal();
    } catch (err) {
      ToastService.danger('Ошибка при восстановлении паролей');
      console.error('Error restoring passwords:', err);
    } finally {
      this.isProcessing = false;
    }
  }

  // Сброс выбранного файла
  private resetFile(): void {
    this.selectedFile = null;
    this.fileHash = null;
    this.filePath = null;
  }

  closeModal(){
    this.resetFile();
    this.closed.emit();
  }
}
