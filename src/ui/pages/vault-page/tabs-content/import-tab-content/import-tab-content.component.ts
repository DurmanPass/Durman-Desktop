import { Component } from '@angular/core';
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {NgForOf, NgIf} from "@angular/common";
import {EncryptValue} from "../../../../../utils/crypto.utils";
import {PasswordEntryInterface} from "../../../../../interfaces/data/passwordEntry.interface";
import {IvService} from "../../../../../services/routes/iv.service";
import {BrowserPasswordService} from "../../../../../services/import/browser-password.service";
import {PasswordManagerService} from "../../../../../services/password/password-manager.service";
import {PasswordService} from "../../../../../services/routes/password/password.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-import-tab-content',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    NgIf,
    NgForOf,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './import-tab-content.component.html',
  styleUrl: './import-tab-content.component.css'
})
export class ImportTabContentComponent {
  passwords: { entry: PasswordEntryInterface; selected: boolean; created: boolean }[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
      private http: HttpClient,
      private csvPasswordParserService: BrowserPasswordService,
  ) {}

  protected serverPasswordService = new PasswordService(this.http);
  protected passwordManagerService = new PasswordManagerService(this.serverPasswordService);
  protected ivService = new IvService(this.http);


  async importPasswords() {
    this.isLoading = true;
    this.error = null;
    this.passwords = [];

    try {
      const entries = await this.csvPasswordParserService.parseCsvFile();
      this.passwords = entries.map(entry => ({
        entry,
        selected: true, // По умолчанию все выбраны
        created: false, // Ещё не созданы
      }));
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to import passwords';
    } finally {
      this.isLoading = false;
    }
  }

  async transferToDurmanPass() {
    this.isLoading = true;
    this.error = null;

    try {
      for (const item of this.passwords) {
        if (!item.selected || item.created) continue;

        const localEntry = { ...item.entry };
        if (localEntry.credentials.password) {
          const iv = await this.ivService.generateIv();
          localEntry.credentials.password = await EncryptValue(localEntry.credentials.password, iv);
          localEntry.credentials.encryption_iv = iv;
        }

        await this.passwordManagerService.createPassword(localEntry);
        item.created = true; // Помечаем как созданную
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to transfer passwords to DurmanPass';
    } finally {
      this.isLoading = false;
    }
  }
}
