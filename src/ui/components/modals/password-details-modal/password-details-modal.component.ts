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
import {SettingsLocalService} from "../../../../services/settings/app-settings.service";
import {ToastService} from "../../../../services/notification/toast.service";
import {DecryptValue, EncryptValue} from "../../../../utils/crypto.utils";
import {PasswordService} from "../../../../services/routes/password/password.service";
import {PasswordManagerService} from "../../../../services/password/password-manager.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IvService} from "../../../../services/routes/iv.service";
import {CategoryService} from "../../../../services/routes/category/category.service";
import {CategoryLocalService} from "../../../../services/category/category-local.service";
import {Category} from "../../../../interfaces/data/category.interface";
import {SettingsService} from "../../../../services/routes/settings/settings.service";

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
    CheckboxComponent,
      HttpClientModule
  ],
  templateUrl: './password-details-modal.component.html',
  styleUrl: './password-details-modal.component.css'
})
export class PasswordDetailsModalComponent {
  @Input() passwordEntry: PasswordEntryInterface | null = null; // Данные о пароле
  @Input() mode: PasswordDetailsModalModes = PasswordDetailsModalModes.CREATE;
  @Input() headerBackground: string = 'rgb(34,34,35)'; // Базовый цвет для градиента
  @Output() editRequested = new EventEmitter<string>(); // Запрос на редактирование
  @Output() closed = new EventEmitter<void>();
  localEntry: PasswordEntryInterface;
  isEditLocalEntry: boolean = false;
  categoryOptions: { label: string; value: string }[] = [];
  @Input() categories: Category[] = []
  // @Input() selectedCategory: string = 'All';
  selectedCategory: string = 'All';
  @Output() updatePass = new EventEmitter<string>();

  constructor(private http: HttpClient) {
    this.localEntry = this.createEmptyEntry();
    this.updateCategories();
  }
  private passwordStrengthService = new PasswordStrengthService();
  protected serverPasswordService = new PasswordService(this.http);
  protected passwordManagerService = new PasswordManagerService(this.serverPasswordService);
  protected ivService = new IvService(this.http);
  @Input() categoryService: CategoryService = new CategoryService(this.http);
  @Input() categoryLocalService: CategoryLocalService = new CategoryLocalService(this.categoryService);
  cat = 'All';

  protected settingsService = new SettingsService(this.http);
  protected settingsLocalService = new SettingsLocalService(this.settingsService);

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
    this.updateCategories();
  }

  ngOnInit(){
    this.updateCategories();
  }

  ngOnDestroy(){
    this.clearData();
  }

  clearData(){
    this.passwordEntry = null;
    this.localEntry = this.createEmptyEntry();
    // this.isEditLocalEntry = false;
  }

  onEditLocalEntry(){
    this.isEditLocalEntry = !this.isEditLocalEntry;
  }

  private updateCategories(): void {
    this.categories = this.categoryLocalService.getCategories();
    this.categoryOptions = this.categories.map(category => ({
      value: category.id,
      label: category.name
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
      copyToClipboard(value, this.settingsLocalService.getClearBuffer(), this.settingsLocalService.getClearBufferTimeout());
      ToastService.success('Скопировано в буфер обмена!')
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
    else if (field === 'credentials.email') {
      this.localEntry.credentials.email = value;
    }
    else if (field === 'pin-code') {
      this.localEntry.credentials.pin = value;
    }
  }

  updateTextAreaField(field: string, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;

    switch (field) {
      case 'description_field':
        this.localEntry.description = value;
        break;
      case 'recovery_codes':
        this.localEntry.credentials.recoveryCodes = value
            .split(/[\n,]+/) // Разделяем по запятым или переносам строки
            .map(code => code.trim()) // Удаляем пробелы
            .filter(code => code !== ''); // Удаляем пустые строки
        break;
      default:
        console.warn(`Unknown field: ${field}`);
    }
  }

  updateCheckboxField(field: string, checked: boolean): void {
    if (field === 'isFavorite_field') {
      this.localEntry.security.isFavorite = checked;
    }
  }

  updateSelectField(fieldId: string, event: string): void {
    switch (fieldId) {
      case 'category_field':
        this.localEntry.metadata.category = event;
        this.selectedCategory = event;
        this.cat = this.categoryOptions.find(opt => opt.value === event)?.label || '';
        break;
      default:
        console.warn(`Unknown field: ${fieldId}`);
    }
  }
  async onUpdateEntry(){
    //TODO Проверка совпадает ли localEntry с passwordEntry
    //TODO Обновить запись пароля
    if(this.localEntry === this.passwordEntry){return;}
    this.localEntry.credentials.password = await EncryptValue(this.localEntry.credentials.password, this.localEntry.credentials.encryption_iv);
    await this.passwordManagerService.updatePassword(this.localEntry.id ? this.localEntry.id : '', this.localEntry)
    this.closed.emit();
    this.clearData();
    this.isEditLocalEntry = false;
    ToastService.success("Запись была успешно обновлена!");
  }

  async onCreateEntry(){
    const iv = await this.ivService.generateIv();
    this.localEntry.credentials.password =  await EncryptValue(this.localEntry.credentials.password, iv);
    this.localEntry.credentials.encryption_iv = iv;
    // const selectedOption = this.categoryOptions.find(option => option.label === this.selectedCategory);
    // console.log(selectedOption?.value);
    // this.localEntry.metadata.category = selectedOption ? selectedOption.value : '';
    await this.passwordManagerService.createPassword(this.localEntry);
    this.closed.emit();
    this.updatePass.emit(this.cat);
    this.clearData();
    ToastService.success("Запись была успешно создана!");
  }

  protected readonly PasswordDetailsModalModes = PasswordDetailsModalModes;
  protected readonly CategoryManagerService = CategoryManagerService;
  protected readonly SettingsService = SettingsService;
}
