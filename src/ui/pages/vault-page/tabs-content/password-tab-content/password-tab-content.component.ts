import {Component} from '@angular/core';
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {PasswordManagerStateInterface} from "../../../../../interfaces/data/passwordManagerState.interface";
import {VIEW_MANAGER_MODES} from "../../../../../shared/enums/modes/view-manager.enum";
import {SORT_ORDER_ENTRY, SORT_PASSWORD_ENTRY} from "../../../../../shared/enums/modes/sort-password-entry.enum";
import {NgForOf, NgIf} from "@angular/common";
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
import {Table} from "jspdf-autotable";
import {TableColumn} from "../../../../../interfaces/components/table/tableColumn.interface";
import {EntriesTableComponent} from "../../../../components/tables/entries-table/entries-table.component";

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
    EntriesTableComponent
  ],
  templateUrl: './password-tab-content.component.html',
  styleUrl: './password-tab-content.component.css'
})
export class PasswordTabContentComponent {
  protected PasswordManagerState: PasswordManagerStateInterface = {
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
    }
  }

  passwordTableColumns = [
    { label: 'Название', render: (entry: PasswordEntryInterface) => entry.name },
    { label: 'URL', render: (entry: PasswordEntryInterface) => entry.location.domain },
    { label: 'Имя пользователя', render: (entry: PasswordEntryInterface) => entry.credentials.username },
    { label: 'Электронная почта', render: (entry: PasswordEntryInterface) => entry.credentials.email },
    { label: 'Номер телефона', render: (entry: PasswordEntryInterface) => entry.credentials.phoneNumber || '' },
    { label: 'Категория', render: (entry: PasswordEntryInterface) => entry.metadata.category }
  ];

  closeCreateOrEditPasswordModal(): void {
    this.modalsControls.createOrEditPassword.isModalOpen = false;
    this.selectedPasswordEntry = null;
  }

  openCategoryModal(){
    this.modalsControls.createOrEditCategory.isModalOpen = true;
  }

  closeCreateOrEditCategoryModal(): void {
    this.modalsControls.createOrEditCategory.isModalOpen = false;
  }

  filteredEntries: PasswordEntryInterface[] = [];
  stats: PasswordManagerStats = { total: 0, favorites: 0, weak: 0, frequent: 0 };

  categories: string[] = []; // Список уникальных категорий
  selectedCategory: string = 'All'; // Текущая выбранная категория

  exportPath: string = ''

  // Опции для экспорта
  exportOptions = [
    { value: EXPORT_PASSWORDS_TYPES.XLSX, label: 'XLSX' },
    { value: EXPORT_PASSWORDS_TYPES.HTML, label: 'HTML' },
    { value: EXPORT_PASSWORDS_TYPES.ZIP, label: 'ZIP (защищённый паролем)' }
  ];

  selectedPasswordEntry: PasswordEntryInterface | null = null; // Выбранная запись

  onSearchQueryChange(query: string){
    this.PasswordManagerState.searchQuery = query;
    this.updateCategories();
    this.updateEntries();
    this.updateStats();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.updateEntries();
  }

  private updateCategories(): void {
    const allEntries = PasswordManagerService.getAllEntries();
    this.categories = [...new Set(allEntries.map(entry => entry.metadata.category).filter(category => category))];
  }

  ngOnInit(): void {
    this.updateCategories();
    this.updateEntries();
    this.updateStats();
  }

  toggleViewMode(): void {
    this.PasswordManagerState.viewMode =
        this.PasswordManagerState.viewMode === VIEW_MANAGER_MODES.TABLE
            ? VIEW_MANAGER_MODES.CARD
            : VIEW_MANAGER_MODES.TABLE;
  }

  private updateEntries(): void {
    let entries = PasswordManagerService.getEntriesSortedBy(this.PasswordManagerState.sortCriterion, this.PasswordManagerState.sortOrder);

    // Фильтрация по категории
    if (this.selectedCategory !== 'All') {
      entries = entries.filter(entry => entry.metadata.category === this.selectedCategory);
    }

    // Фильтрация по поисковому запросу
    if (this.PasswordManagerState.searchQuery) {
      entries = entries.filter(entry =>
          entry.name.toLowerCase().includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          entry.metadata.category.toLowerCase().includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          entry.credentials.username.toLowerCase().includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          entry.location.domain.toLowerCase().includes(this.PasswordManagerState.searchQuery.toLowerCase())
      );
    }

    this.filteredEntries = entries;
  }

  private updateStats(): void {
    const entries = PasswordManagerService.getAllEntries();
    this.stats = {
      total: entries.length,
      favorites: entries.filter(e => e.security.isFavorite).length,
      weak: entries.filter(e => e.credentials.passwordStrength < 3).length,
      frequent: entries.filter(e => e.metadata.usageCount > 5).length
    };
  }

  addEntry(): void {
    this.modalsControls.createOrEditPassword.isModalOpen = true;
    this.modalsControls.createOrEditPassword.mode = PasswordDetailsModalModes.CREATE;
  }

  editEntry(id: string): void {
    const entry = PasswordManagerService.getEntryById(id);
    if(entry){
      this.selectedPasswordEntry = entry;
      this.modalsControls.createOrEditPassword.isModalOpen = true;
      this.modalsControls.createOrEditPassword.mode = PasswordDetailsModalModes.EDIT;
    }
  }

  copyEntry(id: string): void {
    const entry = PasswordManagerService.getEntryById(id);
    if (entry && entry.credentials.password) {
      copyToClipboard(entry.credentials.password);
    }
  }

  deleteEntry(id: string): void {
    PasswordManagerService.removeEntry(id);
    this.updateEntries();
    this.updateStats();
    this.updateCategories();
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
    switch (format) {
      case EXPORT_PASSWORDS_TYPES.XLSX:
        PasswordExportService.exportToXlsx(path);
        break;
      case EXPORT_PASSWORDS_TYPES.HTML:
        PasswordExportService.exportToHtml(path);
        break;
      case EXPORT_PASSWORDS_TYPES.ZIP:
        const password = prompt('Введите пароль для ZIP-архива:');
        if (password) {
          PasswordExportService.exportToZip(path,password)
              .catch(err => console.error('Ошибка экспорта в ZIP:', err));
        }
        break;
    }
  }

  protected readonly VIEW_MANAGER_MODES = VIEW_MANAGER_MODES;
  protected readonly ThemeColors = ThemeColors;
  protected readonly PasswordManagerService = PasswordManagerService;
}
