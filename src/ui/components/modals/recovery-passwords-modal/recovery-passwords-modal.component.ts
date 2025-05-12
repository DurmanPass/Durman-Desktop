import {Component, EventEmitter, Output} from '@angular/core';
import {EncryptValue} from "../../../../utils/crypto.utils";
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {readFile, readTextFile, stat, writeFile} from "@tauri-apps/plugin-fs";
import {HashService} from "../../../../services/hash/hash.service";
import {JsonParserService} from "../../../../services/json/json-parser.service";
import {ToastService} from "../../../../services/notification/toast.service";
import {open, save} from "@tauri-apps/plugin-dialog";
import {DecimalPipe, NgIf} from "@angular/common";
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";
import {BackupService} from "../../../../services/routes/backup/backup.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CryptoFileService} from "../../../../services/crypto/crypto-file.service";
import {StoreService} from "../../../../services/vault/store.service";
import {StoreKeys} from "../../../../shared/const/vault/store.keys";
import {PasswordService} from "../../../../services/routes/password/password.service";
import {PasswordManagerService} from "../../../../services/password/password-manager.service";
import {CategoryService} from "../../../../services/routes/category/category.service";
import {CategoryLocalService} from "../../../../services/category/category-local.service";

@Component({
  selector: 'app-recovery-passwords-modal',
  standalone: true,
  imports: [
    DecimalPipe,
    NgIf,
    SolidButtonComponent,
      HttpClientModule
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
  @Output() recovery = new EventEmitter<void>();

  constructor(
      private hashService: HashService,
      private jsonParserService: JsonParserService,
      private http: HttpClient,
      private cryptoFileService: CryptoFileService
  ) {}

  private backupService = new BackupService(this.http, this.cryptoFileService);

  protected categoryService = new CategoryService(this.http)
  protected categoryLocalService = new CategoryLocalService(this.categoryService);
  protected serverPasswordService = new PasswordService(this.http);
  protected passwordManagerService = new PasswordManagerService(this.serverPasswordService);


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
      filters: [{ name: 'Durman backup passwords', extensions: ['durman'] }],
      multiple: false
    });
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('No file selected');
    }
    return filePath;
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

  async createBackup(){
    await this.backupService.backupPasswords();
    this.closeModal();
  }

  async restorePasswords(){
    await this.selectFile();
    // const decryptBackup = await this.cryptoFileService.decryptFile(encryptBackup, StoreService.get(StoreKeys.MASTER_PASSWORD));

    if (!this.filePath) {
      ToastService.warning('Выберите файл для восстановления (.durman)');
      return;
    }

    this.isProcessing = true;
    try {
      // Читаем зашифрованный файл и преобразуем в Blob
      const fileData = await readFile(this.filePath);
      const encryptBackup = new Blob([fileData], { type: 'application/octet-stream' });

      // Получаем мастер-пароль
      const masterPassword = await StoreService.get(StoreKeys.MASTER_PASSWORD);
      if (!masterPassword) {
        throw new Error('Мастер-пароль не найден');
      }

      // Расшифровываем файл
      const decryptBackup = await this.cryptoFileService.decryptFile(encryptBackup, masterPassword);
      await this.backupService.restorePasswords(decryptBackup);

      this.recovery.emit();
      ToastService.success('Пароли успешно восстановлены!');
      this.closeModal();
    } catch (err) {
      ToastService.danger(`Ошибка при восстановлении паролей: ${err}`);
      console.error('Error restoring passwords:', err);
    } finally {
      this.isProcessing = false;
    }
  }
}
