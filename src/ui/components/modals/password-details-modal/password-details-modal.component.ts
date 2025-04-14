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
import {PasswordStrengthService} from "../../../../services/password/password-strength.service";
import {SettingsService} from "../../../../services/settings/app-settings.service";
import {ToastService} from "../../../../services/notification/toast.service";
import {StoreService} from "../../../../services/vault/store.service";
import {StoreKeys} from "../../../../shared/const/vault/store.keys";
import {CryptoAesGcmService} from "../../../../services/crypto/crypto-aes-gcm.service";
import {DecryptValue} from "../../../../utils/crypto.utils";

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
  isEditLocalEntry: boolean = false;
  categoryOptions: { value: string, label: string }[] = [];
  categories: string[] = [];
  constructor() {
    this.localEntry = this.createEmptyEntry();
    this.updateCategories();
  }
  private passwordStrengthService = new PasswordStrengthService();

  async ngOnChanges() {
    if (this.mode === PasswordDetailsModalModes.CREATE) {
      this.isEditLocalEntry = false;
      this.localEntry = this.createEmptyEntry();
      this.isEditLocalEntry = true;
    } else if (this.passwordEntry) {
      this.isEditLocalEntry = false;
      this.localEntry = { ...this.passwordEntry };

      if (this.localEntry) {
        this.localEntry.credentials.password = await DecryptValue(this.localEntry.credentials.password, this.localEntry.credentials.encryption_iv);
      }
    }
  }

  ngOnDestroy(){
    this.passwordEntry = null;
    this.localEntry = this.createEmptyEntry();
    this.isEditLocalEntry = false;
  }

  onEditLocalEntry(){
    this.isEditLocalEntry = !this.isEditLocalEntry;
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
      copyToClipboard(value, SettingsService.getClearBuffer(), SettingsService.getClearBufferTimeout());
    }
  }

  editEntry(): void {
    if (this.passwordEntry?.id) {
      this.editRequested.emit(this.passwordEntry.id);
      this.onEditLocalEntry();
    }
  }

  // Обновление полей при изменении значений в input
  updateField(field: keyof PasswordEntryInterface | string, value: string): void {
    if (field === 'name') {
      this.localEntry.name = value;
    }
    if (field === 'location.url') {
      this.localEntry.location.url = value;
    } else if (field === 'location.domain') {
      this.localEntry.location.domain = value;
    } else if (field === 'credentials.username') {
      this.localEntry.credentials.username = value;
    } else if (field === 'credentials.phoneNumber') {
      this.localEntry.credentials.phoneNumber = value;
    } else if (field === 'credentials.password') {
      this.localEntry.credentials.password = value;
      this.localEntry.credentials.passwordStrength = this.passwordStrengthService.getPasswordScore(this.localEntry.credentials.password);
    } else if (field === 'name') {
      this.localEntry.name = value;
    } else if (field === 'metadata.category') {
      this.localEntry.metadata.category = value;
    }
  }

  onUpdateEntry(){
    //TODO Проверка совпадает ли localEntry с passwordEntry
    //TODO Обновить запись пароля
    this.isEditLocalEntry = false;
    ToastService.success("Запись была успешно обновлена!");
  }

  onCreateEntry(){
    //TODO Создать запись пароля
    ToastService.success("Запись была успешно создана!");
  }

  protected readonly PasswordDetailsModalModes = PasswordDetailsModalModes;
  protected readonly CategoryManagerService = CategoryManagerService;
  protected readonly SettingsService = SettingsService;
}
