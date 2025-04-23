import {Component, EnvironmentInjector, inject} from '@angular/core';
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {PasswordManagerStateInterface} from "../../../../../interfaces/data/passwordManagerState.interface";
import {VIEW_MANAGER_MODES} from "../../../../../shared/enums/modes/view-manager.enum";
import {SORT_ORDER_ENTRY, SORT_PASSWORD_ENTRY} from "../../../../../shared/enums/modes/sort-password-entry.enum";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ThemeColors} from "../../../../../shared/const/colors/general/themeColors";
import {PasswordEntryInterface} from "../../../../../interfaces/data/passwordEntry.interface";
import {PasswordManagerService} from "../../../../../services/password/password-manager.service";
import {PasswordManagerStats} from "../../../../../interfaces/data/passwordManagerStats";
import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
import {copyToClipboard} from "../../../../../utils/clipboard.utils";
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {PasswordExportService} from "../../../../../services/password/password-export.service";
import {DialogService} from "../../../../../services/filesystem/dialog.service";
import {EXPORT_PASSWORDS_TYPES} from "../../../../../shared/enums/export/passwords/export-passwords.enum";
import {ChipsComponent} from "../../../../components/controls/chips/chips.component";
import {SelectComponent} from "../../../../components/controls/select/select.component";
import {ModalBaseComponent} from "../../../../components/modals/modal-base/modal-base.component";
import {
  PasswordDetailsModalComponent
} from "../../../../components/modals/password-details-modal/password-details-modal.component";
import {PasswordDetailsModalModes} from "../../../../../shared/enums/modes/modals/password-details-modal-modes.enum";
import {CategoryModalModes} from "../../../../../shared/enums/modes/modals/category-model-modes.enum";
import {CategoryModalComponent} from "../../../../components/modals/category-modal/category-modal.component";
import {EntriesTableComponent} from "../../../../components/tables/entries-table/entries-table.component";
import {ToastService} from "../../../../../services/notification/toast.service";
import {SettingsService} from "../../../../../services/settings/app-settings.service";
import {Category} from "../../../../../interfaces/data/category.interface";
import {CategoryService} from "../../../../../services/routes/category/category.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CategoryLocalService} from "../../../../../services/category/category-local.service";
import {ContextMenuComponent} from "../../../../components/contextMenus/context-menu/context-menu.component";
import {PasswordService} from "../../../../../services/routes/password/password.service";
import {DecryptValue} from "../../../../../utils/crypto.utils";
import {ConfirmModalComponent} from "../../../../components/modals/confirm-modal/confirm-modal.component";
import {ConfirmModalService} from "../../../../../services/modals/confirm-modal.service";
import {ModalsConfig} from "../../../../../shared/const/components/modals/modals.config";
import {
  RecoveryPasswordsModalComponent
} from "../../../../components/modals/recovery-passwords-modal/recovery-passwords-modal.component";

@Component({
  selector: 'app-password-tab-content',
  standalone: true,
  imports: [
    InputComponent,
    NgIf,
    NgForOf,
    SolidButtonComponent,
    HeaderDescriptionComponent,
    ChipsComponent,
    SelectComponent,
    ModalBaseComponent,
    PasswordDetailsModalComponent,
    CategoryModalComponent,
    EntriesTableComponent,
    HttpClientModule,
    ContextMenuComponent,
    ConfirmModalComponent,
    NgClass,
    RecoveryPasswordsModalComponent
  ],
  templateUrl: './password-tab-content.component.html',
  styleUrl: './password-tab-content.component.css'
})
export class PasswordTabContentComponent {
  PasswordManagerState: PasswordManagerStateInterface = {
    viewMode: VIEW_MANAGER_MODES.TABLE,
    searchQuery: '',
    sortCriterion: SORT_PASSWORD_ENTRY.CREATED_AT,
    sortOrder: SORT_ORDER_ENTRY.ASC
  };

  modalsControls = {
    createOrEditPassword: {
      isModalOpen: false,
      mode: PasswordDetailsModalModes.CREATE
    },
    createOrEditCategory: {
      isModalOpen: false,
      mode: CategoryModalModes.CREATE
    },
    recoveryPasswords: {
      isModalOpen: false
    }
  };

  passwordTableColumns = [
    { label: 'Название', render: (entry: PasswordEntryInterface) => entry.name ? entry.name : '' },
    { label: 'URL', render: (entry: PasswordEntryInterface) => entry.location.domain ? entry.location.domain : '' },
    { label: 'Имя пользователя', render: (entry: PasswordEntryInterface) => entry.credentials.username ? entry.credentials.username : ''},
    { label: 'Электронная почта', render: (entry: PasswordEntryInterface) => entry.credentials.email ? entry.credentials.email : ''},
    { label: 'Номер телефона', render: (entry: PasswordEntryInterface) => entry.credentials.phoneNumber ? entry.credentials.phoneNumber : '' },
    { label: 'Категория', render: (entry: PasswordEntryInterface) => entry.metadata.categoryLabel ? entry.metadata.categoryLabel : 'Все'}
  ];

  filteredEntries: PasswordEntryInterface[] = [];
  stats: PasswordManagerStats = { total: 0, favorites: 0, weak: 0, frequent: 0 };
  categories: Category[] = [];
  selectedCategory: string = 'All';
  selectedCategoryEntry: Category | null = null;
  exportPath: string = '';
  selectedPasswordEntry: PasswordEntryInterface | null = null;

  exportOptions = [
    { value: EXPORT_PASSWORDS_TYPES.XLSX, label: 'XLSX' },
    { value: EXPORT_PASSWORDS_TYPES.HTML, label: 'HTML' },
    { value: EXPORT_PASSWORDS_TYPES.ZIP, label: 'ZIP (защищённый паролем)' }
  ];

  // Опции для выпадающего списка сортировки
  sortOptions = [
    { value: SORT_PASSWORD_ENTRY.NAME, label: 'Название' },
    { value: SORT_PASSWORD_ENTRY.URL, label: 'URL' },
    { value: SORT_PASSWORD_ENTRY.USERNAME, label: 'Имя пользователя' },
    { value: SORT_PASSWORD_ENTRY.EMAIL, label: 'Электронная почта' },
    { value: SORT_PASSWORD_ENTRY.PHONE_NUMBER, label: 'Номер телефона' },
    { value: SORT_PASSWORD_ENTRY.CATEGORY, label: 'Категория' },
    { value: SORT_PASSWORD_ENTRY.CREATED_AT, label: 'Дата создания' }
  ];

  // Обработчик изменения критерия сортировки
  async onSortCriterionChange(criterion: string) {
    this.PasswordManagerState.sortCriterion = criterion as SORT_PASSWORD_ENTRY;
    await this.updateEntries();
  }

  // Переключение направления сортировки
  async toggleSortOrder() {
    this.PasswordManagerState.sortOrder =
        this.PasswordManagerState.sortOrder === SORT_ORDER_ENTRY.ASC
            ? SORT_ORDER_ENTRY.DESC
            : SORT_ORDER_ENTRY.ASC;
    await this.updateEntries();
  }

  constructor(
      private http: HttpClient
  ) {}

  protected categoryService = new CategoryService(this.http)
  protected categoryLocalService = new CategoryLocalService(this.categoryService);
  protected serverPasswordService = new PasswordService(this.http);
  protected passwordManagerService = new PasswordManagerService(this.serverPasswordService);

  private injector = inject(EnvironmentInjector);

  selectedEntryIds: string[] = [];


  async ngOnInit() {
    await this.categoryLocalService.syncCategories();
    await this.updateCategories();
    await this.updateEntries();
    this.updateStats();
  }

  async onSearchQueryChange(query: string) {
    this.PasswordManagerState.searchQuery = query;
    await this.updateCategories();
    await this.updateEntries();
    this.updateStats();
  }

  async selectCategory(category: string) {
    this.selectedCategory = category;
    await this.updateEntries();
  }

  protected async updateCategories() {
    this.selectedCategory = 'All';
    this.categories = this.categoryLocalService.getCategories();
    await this.updateEntries();
  }

  onSelectedCategory(category: Category) {
    this.selectedCategoryEntry = category;
  }

  toggleViewMode(): void {
    this.PasswordManagerState.viewMode =
        this.PasswordManagerState.viewMode === VIEW_MANAGER_MODES.TABLE
            ? VIEW_MANAGER_MODES.CARD
            : VIEW_MANAGER_MODES.TABLE;
  }

  private async updateEntries() {
    let entries = PasswordManagerService.getEntriesSortedBy(
        this.PasswordManagerState.sortCriterion,
        this.PasswordManagerState.sortOrder
    );

    entries.map(async entry => {
      let category = await this.categoryLocalService.getCategoryById(entry.metadata.category ? entry.metadata.category : '');
      entry.metadata.categoryLabel = category.name;
    })

    if (this.selectedCategory !== 'All') {
      entries = entries.filter(entry => entry.metadata.categoryLabel === this.selectedCategory);
    }

    if (this.PasswordManagerState.searchQuery) {
      entries = entries.filter(entry =>
          (entry.name?.toLowerCase() ?? '').includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          (entry.metadata.categoryLabel?.toLowerCase() ?? '').includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          (entry.credentials.username?.toLowerCase() ?? '').includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          (entry.location.domain?.toLowerCase() ?? '').includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          (entry.credentials.email?.toLowerCase() ?? '').includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          (entry.credentials.phoneNumber?.toLowerCase() ?? '').includes(this.PasswordManagerState.searchQuery.toLowerCase())
      );
    }

    this.filteredEntries = entries;
  }

  private updateStats(): void {
    const entries = PasswordManagerService.getAllEntries();
    this.stats = {
      total: entries.length,
      favorites: entries.filter(e => e.security.isFavorite).length,
      weak: entries.filter(e => e.credentials.passwordStrength != null && e.credentials.passwordStrength < 3).length,
      frequent: entries.filter(e => e.metadata.usageCount !== null && e.metadata.usageCount > 5).length
    };
  }

  addEntry(): void {
    this.selectedPasswordEntry = null;
    this.modalsControls.createOrEditPassword.isModalOpen = true;
    this.modalsControls.createOrEditPassword.mode = PasswordDetailsModalModes.CREATE;
  }

  async editEntry(id: string): Promise<void> {
    try {
      this.selectedPasswordEntry = await this.passwordManagerService.getPasswordById(id);
      this.modalsControls.createOrEditPassword.isModalOpen = true;
      this.modalsControls.createOrEditPassword.mode = PasswordDetailsModalModes.EDIT;
    } catch (e) {
      ToastService.danger('Не удалось загрузить запись для редактирования!');
      console.error(e);
    }
  }

  async copyEntry(id: string) {
    const entry = PasswordManagerService.getEntryById(id);
    if (entry && entry.credentials.password) {
      const decrypted = await DecryptValue(entry.credentials.password, entry.credentials.encryption_iv ? entry.credentials.encryption_iv : '');
      copyToClipboard(
          decrypted,
          SettingsService.getClearBuffer(),
          SettingsService.getClearBufferTimeout()
      );
      ToastService.success('Пароль был успешно скопирован в буфер обмена!');
    }
  }

  async deleteEntry(id: string): Promise<void> {
    const result = await ConfirmModalService.createConfirmModal(
        this.injector,
        ModalsConfig.ConfirmModal.deletePassword.title,
        ModalsConfig.ConfirmModal.deletePassword.description,
        {requirePassword: true}
    );

    if (!result) {
      return;
    }

    try {
      await this.passwordManagerService.deletePassword(id);
      await this.updateEntries();
      this.updateStats();
      await this.updateCategories();

      ToastService.success('Запись была успешно удалена!');
    } catch (e) {
      ToastService.danger('Не удалось удалить запись!');
    }
  }

  async deleteSelectedEntries(): Promise<void> {
    if (this.selectedEntryIds.length === 0) {
      ToastService.danger('Выберите хотя бы одну запись для удаления!');
      return;
    }

    const result = await ConfirmModalService.createConfirmModal(
        this.injector,
        'Удаление нескольких записей',
        `Вы уверены, что хотите удалить ${this.selectedEntryIds.length} записей? Это действие нельзя отменить.`,
        { requirePassword: true }
    );

    if (!result) {
      return;
    }

    try {
      await Promise.all(
          this.selectedEntryIds.map(id => this.passwordManagerService.deletePassword(id))
      );
      let localLen = this.selectedEntryIds.length;
      this.selectedEntryIds = []; // Очищаем выбор
      await this.updateEntries();
      this.updateStats();
      await this.updateCategories();
      ToastService.success(`${localLen} записей успешно удалено!`);
    } catch (e) {
      ToastService.danger('Не удалось удалить выбранные записи!');
      console.error(e);
    }
  }

  onSelectionChange(selectedIds: string[]): void {
    this.selectedEntryIds = selectedIds;
  }

  async onExportChange(value: string) {
    await this.selectExportPath();
    if (this.exportPath === '') {
      return;
    }
    const format = value as EXPORT_PASSWORDS_TYPES;
    if (format) {
      this.exportPasswords(format, this.exportPath);
    }
  }

  async selectExportPath() {
    const selectedPath = await DialogService.selectPath();
    if (selectedPath) {
      this.exportPath = selectedPath as string;
    }
  }

  exportPasswords(format: EXPORT_PASSWORDS_TYPES, path: string): void {
    try {
      switch (format) {
        case EXPORT_PASSWORDS_TYPES.XLSX:
          PasswordExportService.exportToXlsx(path);
          ToastService.success('Пароли успешно экспортированы в формат xlsx!');
          break;
        case EXPORT_PASSWORDS_TYPES.HTML:
          PasswordExportService.exportToHtml(path);
          ToastService.success('Пароли успешно экспортированы в формат html!');
          break;
        case EXPORT_PASSWORDS_TYPES.ZIP:
          const password = prompt('Введите пароль для ZIP-архива:');
          if (password) {
            PasswordExportService.exportToZip(path, password).catch(err => {
              ToastService.danger('Ошибка экспорта в ZIP!');
              console.error('Ошибка экспорта в ZIP:', err);
            });
            ToastService.success('Пароли успешно экспортированы в формат zip!');
          }
          break;
      }
    } catch (e) {
      ToastService.danger('Ошибка при экспорте паролей!');
      console.error(e);
    }
  }

  async closeCreateOrEditPasswordModal() {
    this.modalsControls.createOrEditPassword.isModalOpen = false;
    this.selectedPasswordEntry = null;
    await this.updateEntries();
    this.updateStats();
  }

  openCategoryModal(mode: CategoryModalModes) {
    this.modalsControls.createOrEditCategory.mode = mode;
    this.modalsControls.createOrEditCategory.isModalOpen = true;
  }

  async closeCreateOrEditCategoryModal() {
    this.modalsControls.createOrEditCategory.isModalOpen = false;
    await this.updateCategories();
  }

  closeRecoveryPasswordsModal() {
    this.modalsControls.recoveryPasswords.isModalOpen = false;
  }

  openRecoveryModal(){
    this.modalsControls.recoveryPasswords.isModalOpen = true;
  }


  protected readonly VIEW_MANAGER_MODES = VIEW_MANAGER_MODES;
  protected readonly ThemeColors = ThemeColors;
  protected readonly PasswordManagerService = PasswordManagerService;
  protected readonly SORT_ORDER_ENTRY = SORT_ORDER_ENTRY;
}
