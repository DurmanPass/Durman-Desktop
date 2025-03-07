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

@Component({
  selector: 'app-password-tab-content',
  standalone: true,
  imports: [
    InputComponent,
    NgIf,
    NgForOf,
    SolidButtonComponent,
    HeaderDescriptionComponent
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


  filteredEntries: PasswordEntryInterface[] = [];
  stats: PasswordManagerStats = { total: 0, favorites: 0, weak: 0, frequent: 0 };

  categories: string[] = []; // Список уникальных категорий
  selectedCategory: string = 'All'; // Текущая выбранная категория

  exportPath: string = ''

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
    // Здесь можно открыть модальное окно для добавления
  }

  editEntry(id: string): void {
    // Здесь можно открыть модальное окно для редактирования
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

  async onExportChange(event: Event) {

    await this.selectExportPath();

    if(this.exportPath === ''){
      return;
    }

    const target = event.target as HTMLSelectElement;
    const format = target.value as EXPORT_PASSWORDS_TYPES | '';
    if (format) {
      this.exportPasswords(format, this.exportPath);
    }
    target.value = '';
  }

  async selectExportPath() {
    const selectedPath = await DialogService.selectPath();
    if (selectedPath) {
      this.exportPath = selectedPath as string;
    }
  }

  exportPasswords(format: 'xlsx' | 'html' | 'pdf' | 'zip', path: string): void {
    switch (format) {
      case 'xlsx':
        PasswordExportService.exportToXlsx(path,'my_passwords.xlsx');
        break;
      case 'html':
        PasswordExportService.exportToHtml(path,'my_passwords.html');
        break;
      case 'zip':
        const password = prompt('Введите пароль для ZIP-архива:');
        if (password) {
          PasswordExportService.exportToZip(path,password, 'my_passwords.zip')
              .catch(err => console.error('Ошибка экспорта в ZIP:', err));
        }
        break;
    }
  }

  protected readonly VIEW_MANAGER_MODES = VIEW_MANAGER_MODES;
  protected readonly ThemeColors = ThemeColors;
  protected readonly PasswordManagerService = PasswordManagerService;
}
