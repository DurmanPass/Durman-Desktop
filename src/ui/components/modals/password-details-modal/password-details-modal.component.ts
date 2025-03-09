import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {copyToClipboard} from "../../../../utils/clipboard.utils";
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";
import {DatePipe, NgIf} from "@angular/common";
import {InputComponent} from "../../inputs/input/input.component";
import {PasswordStrengthBarComponent} from "../../bars/password-strength-bar/password-strength-bar.component";
import {PasswordDetailsModalModes} from "../../../../shared/enums/modes/modals/password-details-modal-modes.enum";
import {SelectComponent} from "../../controls/select/select.component";
import {CategoryManagerService} from "../../../../services/password/category-manager.service";
import {CheckboxComponent} from "../../controls/checkbox/checkbox.component";

@Component({
  selector: 'app-password-details-modal',
  standalone: true,
  imports: [
    SolidButtonComponent,
    NgIf,
    DatePipe,
    InputComponent,
    PasswordStrengthBarComponent,
    SelectComponent,
    CheckboxComponent
  ],
  templateUrl: './password-details-modal.component.html',
  styleUrl: './password-details-modal.component.css'
})
export class PasswordDetailsModalComponent {
  @Input() passwordEntry: PasswordEntryInterface | null = null; // Данные о пароле
  @Input() mode: PasswordDetailsModalModes = PasswordDetailsModalModes.CREATE;
  @Input() headerBackground: string = 'rgb(34,34,35)'; // Базовый цвет для градиента
  @Output() editRequested = new EventEmitter<string>(); // Запрос на редактирование
  localEntry: PasswordEntryInterface;
  idEditLocalEntry: boolean = false;
  categoryOptions: { value: string, label: string }[] = [];
  categories: string[] = [];
  constructor() {
    this.localEntry = this.createEmptyEntry();
    this.updateCategories();
  }

  ngOnChanges(): void {
    // Если передан passwordEntry, используем его, иначе создаём пустой объект в режиме CREATE
    if (this.mode === PasswordDetailsModalModes.CREATE) {
      this.localEntry = this.createEmptyEntry();
      this.idEditLocalEntry = true;
    } else if (this.passwordEntry) {
      this.localEntry = { ...this.passwordEntry }; // Копируем, чтобы не мутировать исходный объект
    }
  }

  private updateCategories(): void {
    this.categories = CategoryManagerService.getAllCategories();
    this.categoryOptions = this.categories.map(category => ({
      value: category,
      label: category
    }));
  }

  private createEmptyEntry(): PasswordEntryInterface {
    return {
      id: '',
      description: '',
      name: '',
      favicon: '',
      location: {
        url: '',
        domain: ''
      },
      credentials: {
        username: '',
        password: '',
        passwordStrength: 0,
        email: '',
        phoneNumber: '',
        pin: '',
        twoFactorCode: '',
        recoveryCodes: []
      },
      metadata: {
        category: '',//
        createdAt: new Date().toString(),//
        updatedAt: new Date().toString(),//
        usageCount: 0,//
        lastUsed: '',//
        tags: []
      },
      security: {
        isFavorite: false,
        requires2FA: false,
        sensitive: false
      }
    };
  }

  getHeaderGradient(): string {
    // Преобразуем rgb в rgba с разной прозрачностью
    const opaque = this.headerBackground; // 100% непрозрачности
    const semiTransparent = `${this.headerBackground.replace('rgb', 'rgba').replace(')', ', 0.5)')}`; // 50% прозрачности
    const transparent = `${this.headerBackground.replace('rgb', 'rgba').replace(')', ', 0)')}`; // 0% непрозрачности

    return `linear-gradient(-75deg, ${transparent} 0%, ${semiTransparent} 25%, ${opaque} 50%, ${semiTransparent} 75%, ${transparent} 100%)`;
  }

  copyToClipboard(value: string): void {
    if (value) {
      copyToClipboard(value);
    }
  }

  editEntry(): void {
    if (this.passwordEntry?.id) {
      this.editRequested.emit(this.passwordEntry.id);
    }
  }

  protected readonly PasswordDetailsModalModes = PasswordDetailsModalModes;
  protected readonly CategoryManagerService = CategoryManagerService;
}
