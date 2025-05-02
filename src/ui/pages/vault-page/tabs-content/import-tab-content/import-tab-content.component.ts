import { Component } from '@angular/core';
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {BrowserPassword, BrowserPasswordService} from "../../../../../services/import/browser-password.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-import-tab-content',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './import-tab-content.component.html',
  styleUrl: './import-tab-content.component.css'
})
export class ImportTabContentComponent {
  passwords: BrowserPassword[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private browserPasswordService: BrowserPasswordService) {}

  importPasswords(): void {
    this.isLoading = true;
    this.error = null;
    this.passwords = [];
    this.browserPasswordService.getBrowserPasswords().subscribe({
      next: (passwords) => {
        this.passwords = passwords;
        this.isLoading = false;
        console.log('Imported passwords:', passwords);
      },
      error: (err) => {
        this.error = err.message || 'Не удалось импортировать пароли. Убедитесь, что Chrome установлен и закрыт.';
        this.isLoading = false;
        console.error('Import error:', err);
      }
    });
  }
}
